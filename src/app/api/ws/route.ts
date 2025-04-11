import { WebSocketServer } from 'ws';
import { NextResponse } from 'next/server';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

export async function GET() {
  return NextResponse.json({ status: 'WebSocket server is running' });
} 