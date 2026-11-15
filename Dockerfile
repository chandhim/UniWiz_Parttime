FROM php:8.2-cli-alpine

# Install PostgreSQL dev libraries and PDO pgsql extension for Supabase
RUN apk add --no-cache libpq-dev bash \
    && docker-php-ext-install pdo pdo_pgsql

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy uniwiz-backend folder contents
COPY uniwiz-backend/ .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Create upload directories with write permissions
RUN mkdir -p uploads/cvs uploads/covers uploads/required_docs uploads/gallery api/uploads/cvs \
    && chmod -R 777 uploads

# Default Render HTTP port
ENV PORT=10000
EXPOSE 10000

# Start PHP built-in web server binding to Render's assigned $PORT
CMD ["sh", "-c", "php -S 0.0.0.0:${PORT:-10000}"]
