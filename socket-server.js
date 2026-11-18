// FILE: socket-server.js
// =============================================================================
// Real-Time Socket.IO Chat Server for UniWiz
// Powered by Node.js, Express, Socket.IO, and Prisma ORM connected to Supabase
// =============================================================================

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);

const PORT = process.env.SOCKET_PORT || 4000;

app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'UniWiz Socket.IO Real-time Chat Server',
    timestamp: new Date().toISOString()
  });
});

// Setup Socket.IO Server with CORS
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://uniwiz-backend.test'],
    methods: ['GET', 'POST'],
    credentials: true
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

// Track Online Users: Map<userId, socketId[]>
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  // User joins their personal room for direct notifications
  socket.on('setup', (userId) => {
    if (!userId) return;
    const uid = Number(userId);
    socket.userId = uid;
    socket.join(`user_${uid}`);

    // Add to online users tracker
    if (!onlineUsers.has(uid)) {
      onlineUsers.set(uid, new Set());
    }
    onlineUsers.get(uid).add(socket.id);

    console.log(`[Socket] User ${uid} registered personal room: user_${uid}`);
    io.emit('user_status_changed', { userId: uid, isOnline: true });
  });

  // User joins a specific conversation room
  socket.on('join_conversation', (conversationId) => {
    if (!conversationId) return;
    const roomId = `conv_${conversationId}`;
    socket.join(roomId);
    console.log(`[Socket] Socket ${socket.id} joined room ${roomId}`);
    socket.emit('joined_conversation', { conversationId });
  });

  // User leaves conversation room
  socket.on('leave_conversation', (conversationId) => {
    if (!conversationId) return;
    const roomId = `conv_${conversationId}`;
    socket.leave(roomId);
    console.log(`[Socket] Socket ${socket.id} left room ${roomId}`);
  });

  // User typing indicator
  socket.on('typing', ({ conversation_id, user_id, user_name }) => {
    if (!conversation_id) return;
    socket.to(`conv_${conversation_id}`).emit('user_typing', {
      conversation_id,
      user_id,
      user_name
    });
  });

  // User stop typing indicator
  socket.on('stop_typing', ({ conversation_id, user_id }) => {
    if (!conversation_id) return;
    socket.to(`conv_${conversation_id}`).emit('user_stop_typing', {
      conversation_id,
      user_id
    });
  });

  // Mark messages as read in real-time
  socket.on('mark_as_read', async ({ conversation_id, user_id }) => {
    if (!conversation_id || !user_id) return;

    try {
      const convId = Number(conversation_id);
      const uid = Number(user_id);

      if (!isNaN(convId)) {
        await prisma.message.updateMany({
          where: {
            conversationId: convId,
            receiverId: uid,
            isRead: false
          },
          data: {
            isRead: true
          }
        });

        io.to(`conv_${conversation_id}`).emit('messages_read', {
          conversation_id: convId,
          read_by: uid
        });
      }
    } catch (err) {
      console.error('[Socket] Error marking messages as read:', err.message);
    }
  });

  // Send Message Event
  socket.on('send_message', async (data, callback) => {
    try {
      const {
        conversation_id,
        sender_id,
        receiver_id,
        job_id,
        message_text
      } = data;

      if (!sender_id || !receiver_id || !message_text || !message_text.trim()) {
        if (callback) callback({ error: 'Incomplete message parameters.' });
        return;
      }

      const sId = Number(sender_id);
      const rId = Number(receiver_id);
      const jId = job_id ? Number(job_id) : null;
      let convId = Number(conversation_id);

      // 1. Resolve or create conversation
      let conversation = null;
      if (!isNaN(convId) && convId > 0 && !String(conversation_id).startsWith('temp_')) {
        conversation = await prisma.conversation.findUnique({
          where: { id: convId }
        });
      }

      if (!conversation) {
        // Find existing conversation between the two users
        conversation = await prisma.conversation.findFirst({
          where: {
            OR: [
              { userOneId: sId, userTwoId: rId },
              { userOneId: rId, userTwoId: sId }
            ]
          }
        });

        if (!conversation) {
          // Create new conversation in Supabase
          conversation = await prisma.conversation.create({
            data: {
              userOneId: sId,
              userTwoId: rId,
              jobId: jId
            }
          });
        }
      }

      convId = conversation.id;

      // 2. Insert message into Supabase
      const message = await prisma.message.create({
        data: {
          conversationId: convId,
          senderId: sId,
          receiverId: rId,
          messageText: message_text.trim()
        },
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              companyName: true,
              profileImageUrl: true,
              role: true
            }
          }
        }
      });

      // Format payload matching the frontend schema
      const formattedMessage = {
        id: message.id,
        conversation_id: convId,
        sender_id: message.senderId,
        receiver_id: message.receiverId,
        message_text: message.messageText,
        is_read: message.isRead,
        created_at: message.createdAt.toISOString(),
        sender: {
          id: message.sender.id,
          first_name: message.sender.firstName,
          last_name: message.sender.lastName,
          company_name: message.sender.companyName,
          profile_image_url: message.sender.profileImageUrl,
          // Prisma returns enum keys (e.g. 'STUDENT'); the PHP API and frontend use the DB values ('student')
          role: message.sender.role ? String(message.sender.role).toLowerCase() : null
        }
      };

      // 3. Broadcast to conversation room (instant delivery to both participants)
      io.to(`conv_${convId}`).emit('receive_message', formattedMessage);

      // If client was on a temporary conversation ID, also emit to that temp room
      if (conversation_id && String(conversation_id).startsWith('temp_')) {
        io.to(`conv_${conversation_id}`).emit('receive_message', formattedMessage);
      }

      // 4. Send notification directly to receiver's personal user room
      io.to(`user_${rId}`).emit('new_message_notification', {
        conversation_id: convId,
        message: formattedMessage,
        unread_count_increment: 1
      });

      console.log(`[Socket] Message ${message.id} delivered in conversation ${convId}`);

      if (callback) {
        callback({ success: true, message: formattedMessage, conversation_id: convId });
      }
    } catch (err) {
      console.error('[Socket] Error sending message:', err);
      if (callback) callback({ error: err.message || 'Failed to send message.' });
    }
  });

  // Client disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
    if (socket.userId && onlineUsers.has(socket.userId)) {
      const userSockets = onlineUsers.get(socket.userId);
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(socket.userId);
        io.emit('user_status_changed', { userId: socket.userId, isOnline: false });
      }
    }
  });
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down Socket.IO server...');
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`[UniWiz] Socket.IO Real-Time Chat Server running on http://localhost:${PORT}`);
});
