import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('socket.io-client', () => ({
  io: () => ({ on: jest.fn(), off: jest.fn(), emit: jest.fn(), disconnect: jest.fn(), connected: false }),
}));

beforeEach(() => {
  localStorage.clear();
  global.fetch = jest.fn(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve([]) }));
});

afterEach(() => {
  jest.resetAllMocks();
});

test('shows the public landing page to a visitor who is not logged in', async () => {
  render(<App />);
  expect(await screen.findByText(/Part-Time Job Platform in Sri Lanka/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Sign In/i).length).toBeGreaterThan(0);
});

test('landing page requests data from the configured API base URL', async () => {
  render(<App />);
  await screen.findByText(/Part-Time Job Platform in Sri Lanka/i);
  const urls = global.fetch.mock.calls.map(([url]) => String(url));
  expect(urls.length).toBeGreaterThan(0);
  urls.forEach((url) => expect(url.startsWith('http://uniwiz-backend.test/api/')).toBe(true));
});
