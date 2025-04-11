"use client";

import { useState, useRef } from "react";

export default function AdminPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [emojis, setEmojis] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        await handleTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const handleTranscription = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("language", "en-US");

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to start transcription");
      }

      const { jobId } = await response.json();

      // Poll for transcription status
      const pollStatus = async () => {
        const statusResponse = await fetch(
          `/api/transcribe/status?jobId=${jobId}`
        );
        const statusData = await statusResponse.json();

        if (statusData.status === "completed") {
          setTranscription(statusData.transcript);
          setEmojis(statusData.emojis);
          setIsProcessing(false);
        } else if (statusData.status === "failed") {
          throw new Error("Transcription failed");
        } else {
          setTimeout(pollStatus, 2000);
        }
      };

      pollStatus();
    } catch (error) {
      console.error("Error during transcription:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="space-y-4">
          <div className="flex space-x-4">
            <button
              onClick={startRecording}
              disabled={isRecording || isProcessing}
              className={`px-4 py-2 rounded ${
                isRecording || isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {isRecording ? "Recording..." : "Start Recording"}
            </button>

            <button
              onClick={stopRecording}
              disabled={!isRecording}
              className={`px-4 py-2 rounded ${
                !isRecording
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Stop Recording
            </button>
          </div>

          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Processing audio...</p>
            </div>
          )}

          {transcription && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Transcription:</h2>
              <p className="bg-gray-50 p-4 rounded">{transcription}</p>
            </div>
          )}

          {emojis && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Emojis:</h2>
              <p className="text-4xl">{emojis}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
