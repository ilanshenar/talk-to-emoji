"use client";

import { useState, useRef, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

interface Message {
  text: string;
  emojis?: string;
  isUser: boolean;
  isRevealed?: boolean;
  isProfanity?: boolean;
}

export default function OpenAISpeechToText() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Default language since we removed the language selector
  const selectedLanguage = "en";

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setShowFab(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Reset copy status after timeout
  useEffect(() => {
    if (copiedIndex !== null) {
      const timeout = setTimeout(() => {
        setCopiedIndex(null);
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [copiedIndex]);

  const toggleReveal = (index: number) => {
    setMessages((prev) =>
      prev.map((msg, i) =>
        i === index ? { ...msg, isRevealed: !msg.isRevealed } : msg
      )
    );
  };

  const removeMessage = (index: number) => {
    setMessages((prev) => prev.filter((_, i) => i !== index));
  };

  const copyEmojis = (emojis: string, index: number) => {
    navigator.clipboard.writeText(emojis);
    setCopiedIndex(index);
  };

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

        try {
          setStatus("processing");
          const formData = new FormData();
          formData.append("file", audioBlob, "audio.wav");
          formData.append("model", "whisper-1");
          formData.append("language", selectedLanguage);

          const response = await fetch("/api/openai/transcribe", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Transcription failed");
          }

          const data = await response.json();

          if (data.text) {
            // Convert text to emojis
            const emojiResponse = await fetch("/api/openai/emojis", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: data.text }),
            });

            const emojiData = await emojiResponse.json();

            setMessages((prev) => [
              ...prev,
              {
                text: data.text,
                emojis: emojiData.emojis,
                isUser: true,
                isRevealed: false,
              },
            ]);
          }

          setStatus("completed");
        } catch (error) {
          console.error("Error processing audio:", error);
          setMessages((prev) => [
            ...prev,
            {
              text: "Error processing audio",
              isUser: false,
            },
          ]);
          setStatus("failed");
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Error accessing microphone",
          isUser: false,
        },
      ]);
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

  // Configure swipe handlers for mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: (eventData) => {
      // Find the message element being swiped
      const targetElement = eventData.event.target as HTMLElement;
      const messageElement = targetElement.closest("[data-message-index]");
      if (messageElement) {
        const index = parseInt(
          messageElement.getAttribute("data-message-index") || "0",
          10
        );
        removeMessage(index);
      }
    },
    onSwipedUp: (eventData) => {
      // Find the message element being swiped
      const targetElement = eventData.event.target as HTMLElement;
      const messageElement = targetElement.closest("[data-message-index]");
      if (messageElement) {
        const index = parseInt(
          messageElement.getAttribute("data-message-index") || "0",
          10
        );
        toggleReveal(index);
      }
    },
    trackMouse: false,
  });

  return (
    <div className="flex flex-col items-center w-full gap-4">
      <div
        {...swipeHandlers}
        className="space-y-4 w-full max-h-[70vh] overflow-y-auto px-2 pb-4 hide-scrollbar"
        role="log"
        aria-live="polite"
        aria-label="Speech to emoji conversion results"
      >
        {messages.map((message, index) => (
          <article
            key={index}
            data-message-index={index}
            className={`p-4 rounded-lg relative ${
              message.isUser
                ? "bg-blue-100 ml-0 md:ml-8"
                : "bg-gray-100 mr-0 md:mr-8"
            }`}
            role="article"
            aria-labelledby={`message-${index}`}
          >
            <button
              onClick={() => removeMessage(index)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 transition-colors p-2"
              aria-label={`Remove message ${index + 1}`}
              title="Remove this message"
            >
              ✕
            </button>
            {message.emojis && (
              <div className="relative">
                <div
                  className="text-4xl mb-4 text-center text-gray-800 select-none"
                  aria-label={`Emoji representation: ${message.emojis}`}
                  role="img"
                >
                  {message.emojis}
                </div>
                <button
                  onClick={() => copyEmojis(message.emojis!, index)}
                  className="absolute top-0 right-8 p-2 text-gray-500 hover:text-blue-600 transition-colors"
                  aria-label={`Copy emojis: ${message.emojis}`}
                  title={
                    copiedIndex === index
                      ? "Copied!"
                      : "Copy emojis to clipboard"
                  }
                >
                  {copiedIndex === index ? (
                    <span
                      className="text-green-500"
                      aria-label="Copied successfully"
                    >
                      ✓
                    </span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect
                        x="9"
                        y="9"
                        width="13"
                        height="13"
                        rx="2"
                        ry="2"
                      ></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  )}
                </button>
              </div>
            )}
            <div
              className={`transition-all duration-500 ease-in-out ${
                message.isRevealed
                  ? "opacity-100 max-h-96"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
              id={`message-${index}`}
            >
              <p className="text-gray-800" aria-label="Original spoken text">
                {message.text}
              </p>
            </div>
            <button
              onClick={() => toggleReveal(index)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 p-2"
              aria-expanded={message.isRevealed}
              aria-controls={`message-${index}`}
            >
              {message.isRevealed ? "Hide Text" : "Reveal Text"}
            </button>
            {isMobile && (
              <div
                className="text-xs text-gray-400 mt-2 text-center"
                role="note"
              >
                Swipe left to delete • Swipe up to reveal/hide
              </div>
            )}
          </article>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex flex-col items-center gap-4 w-full px-2 sticky bottom-0 pt-2">
        <div className="text-gray-600 text-sm" role="status" aria-live="polite">
          {status && `Status: ${status}`}
        </div>
        {status === "processing" && (
          <div
            className="flex space-x-2 mb-2"
            role="img"
            aria-label="Processing animation"
          >
            {["🤔", "🎤", "🎧", "🎯", "🎨"].map((emoji, index) => (
              <div
                key={index}
                className="text-3xl md:text-4xl animate-bounce"
                style={{
                  animationDelay: `${index * 0.2}s`,
                  animationDuration: "1s",
                }}
                aria-hidden="true"
              >
                {emoji}
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-center w-full">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-8 py-4 rounded-lg font-semibold ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white flex items-center justify-center gap-2`}
            aria-label={
              isRecording ? "Stop recording speech" : "Start recording speech"
            }
            aria-pressed={isRecording}
          >
            <span
              className={isRecording ? "animate-pulse" : ""}
              aria-hidden="true"
            >
              {isRecording ? "🔴" : "🎤"}
            </span>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>
      </div>

      {showFab && (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center ${
            isRecording ? "bg-red-500" : "bg-blue-500"
          } text-white z-50 animate-pulse-slow`}
          aria-label={
            isRecording ? "Stop recording speech" : "Start recording speech"
          }
          title={isRecording ? "Stop recording" : "Start recording"}
        >
          <span className="text-2xl" aria-hidden="true">
            {isRecording ? "🔴" : "🎤"}
          </span>
        </button>
      )}
    </div>
  );
}
