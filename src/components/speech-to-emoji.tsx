"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mic, MicOff, Copy, X, Eye, EyeOff } from "lucide-react";

interface Message {
  text: string;
  emojis?: string;
  isUser: boolean;
  isRevealed?: boolean;
  isProfanity?: boolean;
}

export default function SpeechToEmoji() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [isMobile, setIsMobile] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [previousMessageCount, setPreviousMessageCount] = useState(0);

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
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Auto-scroll to bottom only when new messages are added
  useEffect(() => {
    if (messages.length > previousMessageCount && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
    setPreviousMessageCount(messages.length);
  }, [messages.length, previousMessageCount]);

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
    toast.success("Message removed");
  };

  const copyEmojis = async (emojis: string, index: number) => {
    try {
      await navigator.clipboard.writeText(emojis);
      setCopiedIndex(index);
      toast.success("Emojis copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy emojis:", error);
      toast.error("Failed to copy emojis");
    }
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

            toast.success("Speech converted to emojis!");
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
          toast.error("Failed to process audio");
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started!");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Error accessing microphone",
          isUser: false,
        },
      ]);
      toast.error("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
      toast.success("Recording stopped!");
    }
  };

  // Animation variants
  const messageVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  const emojiVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 500, damping: 30 },
    },
  };

  return (
    <div className="flex flex-col items-center w-full gap-6">
      {/* Messages Container */}
      <div className="space-y-4 w-full max-h-[70vh] overflow-y-auto px-2 pb-4 hide-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              transition={{ duration: 0.3 }}
            >
              <Card
                className={`relative ${
                  message.isUser
                    ? "bg-purple-700/40 backdrop-blur-sm border-purple-600/50 ml-0 md:ml-8"
                    : "bg-slate-700/40 backdrop-blur-sm border-slate-600/50 mr-0 md:mr-8"
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    {message.emojis && (
                      <motion.div
                        variants={emojiVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-4xl text-center flex-1"
                      >
                        {message.emojis}
                      </motion.div>
                    )}
                    <div className="flex gap-2 ml-auto">
                      {message.emojis && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyEmojis(message.emojis!, index)}
                          className="text-purple-300 hover:text-purple-100 h-8 w-8 p-0"
                        >
                          {copiedIndex === index ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="text-green-400"
                            >
                              ✓
                            </motion.div>
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMessage(index)}
                        className="text-purple-300 hover:text-red-400 h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <AnimatePresence>
                    {message.isRevealed && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mb-3"
                      >
                        <p className="text-purple-100 text-sm">
                          {message.text}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReveal(index)}
                    className="text-purple-300 hover:text-purple-100 h-auto p-2"
                  >
                    {message.isRevealed ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide Text
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        Reveal Text
                      </>
                    )}
                  </Button>

                  {isMobile && (
                    <p className="text-xs text-purple-400 mt-2 text-center">
                      Swipe left to delete • Swipe up to reveal/hide
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Status and Controls */}
      <div className="flex flex-col items-center gap-4 w-full px-2 sticky bottom-0 pt-2">
        {status && (
          <Badge
            variant="secondary"
            className="text-purple-300 bg-purple-800/40"
          >
            Status: {status}
          </Badge>
        )}

        {status === "processing" && (
          <motion.div
            className="flex space-x-2 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {["🤔", "🎤", "🎧", "🎯", "🎨"].map((emoji, index) => (
              <motion.div
                key={index}
                className="text-3xl md:text-4xl"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1,
                  delay: index * 0.2,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
              >
                {emoji}
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="flex justify-center w-full">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            size="lg"
            className={`px-8 py-4 text-lg font-semibold ${
              isRecording
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            } shadow-lg transition-all`}
          >
            <motion.div
              animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className="mr-2"
            >
              {isRecording ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </motion.div>
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
      </div>

      {/* Mobile FAB */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              size="icon"
              className={`w-14 h-14 rounded-full shadow-lg ${
                isRecording
                  ? "bg-gradient-to-r from-red-600 to-red-700"
                  : "bg-gradient-to-r from-purple-600 to-blue-600"
              }`}
            >
              <motion.div
                animate={
                  isRecording ? { scale: [1, 1.2, 1] } : { scale: [1, 1.05, 1] }
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                {isRecording ? (
                  <MicOff className="h-6 w-6" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
