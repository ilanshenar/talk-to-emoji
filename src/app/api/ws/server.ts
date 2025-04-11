import { WebSocketServer } from 'ws';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  let audioBuffer: Float32Array[] = [];

  ws.on('message', async (message) => {
    try {
      // Convert the message to audio data
      const audioData = new Float32Array(message as ArrayBuffer);
      audioBuffer.push(audioData);

      // Process the audio buffer every 2 seconds
      if (audioBuffer.length >= 10) { // Adjust this based on your needs
        const combinedBuffer = new Float32Array(audioBuffer.reduce((acc, curr) => acc + curr.length, 0));
        let offset = 0;
        audioBuffer.forEach(buffer => {
          combinedBuffer.set(buffer, offset);
          offset += buffer.length;
        });

        // Convert to base64
        const base64Audio = Buffer.from(combinedBuffer.buffer).toString('base64');

        // Send to OpenAI for transcription
        const transcription = await openai.audio.transcriptions.create({
          file: {
            name: 'audio.wav',
            data: Buffer.from(base64Audio, 'base64'),
          },
          model: "whisper-1",
          language: "en",
          response_format: "json",
        });

        // Send the transcription back to the client
        ws.send(JSON.stringify({ text: transcription.text }));

        // Clear the buffer
        audioBuffer = [];
      }
    } catch (error) {
      console.error('Error processing audio:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
}); 