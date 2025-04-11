"use client";

import { useState, useRef, useEffect } from "react";

export default function AdminPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("");
  const [transcription, setTranscription] = useState("");
  const [emojis, setEmojis] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Connect to WebSocket server
      const ws = new WebSocket("ws://localhost:3001");
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setStatus("Connected and recording...");
      };

      ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.text) {
          setTranscription(data.text);

          // Convert text to emojis
          try {
            const response = await fetch("/api/process", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: data.text }),
            });

            if (response.ok) {
              const result = await response.json();
              setEmojis(result.emojis);
            }
          } catch (error) {
            console.error("Error converting to emojis:", error);
          }
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setStatus("Connection error");
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setStatus("Connection closed");
      };

      // Start sending audio data
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const processor = audioContext.createScriptProcessor(4096, 1, 1);

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const audioData = e.inputBuffer.getChannelData(0);
          ws.send(audioData);
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setStatus("Error accessing microphone");
    }
  };

  const stopRecording = () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsRecording(false);
    setStatus("Recording stopped");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Emoji Translator Admin</h1>
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-full ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          } text-white font-semibold`}
        >
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
        {status && <p className="mt-4 text-gray-600">{status}</p>}
        {transcription && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Transcription:</h2>
            <p className="text-gray-700">{transcription}</p>
          </div>
        )}
        {emojis && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h2 className="font-semibold mb-2">Emojis:</h2>
            <p className="text-2xl">{emojis}</p>
          </div>
        )}
      </div>
    </div>
  );
}
