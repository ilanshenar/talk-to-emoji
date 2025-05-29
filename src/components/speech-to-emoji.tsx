"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Mic,
  MicOff,
  Copy,
  X,
  Eye,
  EyeOff,
  Type,
  Send,
  RotateCcw,
  Shield,
} from "lucide-react";
import ConsentDialog, { useConsent } from "@/components/consent-dialog";

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
  const [inputMode, setInputMode] = useState<"voice" | "text">("text");
  const [textInput, setTextInput] = useState("");
  const [isProcessingText, setIsProcessingText] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Consent management
  const {
    consentStatus,
    showDialog,
    handleAccept,
    handleDecline,
    resetConsent,
  } = useConsent();

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

  // Handle consent change
  useEffect(() => {
    if (consentStatus === "declined" && inputMode === "voice") {
      setInputMode("text");
      toast.info("Voice recording disabled. You can still use text input!");
    }
  }, [consentStatus, inputMode]);

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

  // New function to convert text input to emojis
  const convertTextToEmojis = async (text: string) => {
    if (!text.trim()) {
      toast.error("Please enter some text");
      return;
    }

    try {
      setIsProcessingText(true);
      setStatus("processing");

      const emojiResponse = await fetch("/api/openai/emojis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text.trim() }),
      });

      if (!emojiResponse.ok) {
        throw new Error("Emoji conversion failed");
      }

      const emojiData = await emojiResponse.json();

      setMessages((prev) => [
        ...prev,
        {
          text: text.trim(),
          emojis: emojiData.emojis,
          isUser: true,
          isRevealed: false,
        },
      ]);

      setTextInput("");
      toast.success("Text converted to emojis!");
      setStatus("completed");
    } catch (error) {
      console.error("Error converting text to emojis:", error);
      toast.error("Failed to convert text to emojis");
      setStatus("failed");
    } finally {
      setIsProcessingText(false);
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    convertTextToEmojis(textInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      convertTextToEmojis(textInput);
    }
  };

  const startRecording = async () => {
    // Check consent before accessing microphone
    if (consentStatus !== "accepted") {
      toast.error("Please accept privacy terms to use voice recording");
      return;
    }

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

        {/* Mode Switcher */}
        <Card className="w-full max-w-md bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Button
                variant={inputMode === "voice" ? "default" : "ghost"}
                size="sm"
                onClick={() => setInputMode("voice")}
                className={`${
                  inputMode === "voice"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "text-purple-300 hover:text-purple-100"
                }`}
              >
                <Mic className="h-4 w-4 mr-2" />
                Voice
              </Button>
              <Button
                variant={inputMode === "text" ? "default" : "ghost"}
                size="sm"
                onClick={() => setInputMode("text")}
                className={`${
                  inputMode === "text"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "text-purple-300 hover:text-purple-100"
                }`}
              >
                <Type className="h-4 w-4 mr-2" />
                Text
              </Button>
            </div>

            <AnimatePresence mode="wait">
              {inputMode === "voice" ? (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    size="lg"
                    disabled={isProcessingText}
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
                </motion.div>
              ) : (
                <motion.div
                  key="text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleTextSubmit} className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type your message here..."
                        disabled={isProcessingText || isRecording}
                        className="w-full p-3 pr-12 rounded-lg bg-purple-900/40 border border-purple-600/50 text-purple-100 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      {textInput && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setTextInput("")}
                          className="absolute top-2 right-2 text-purple-400 hover:text-purple-200 h-8 w-8 p-0"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={
                        !textInput.trim() || isProcessingText || isRecording
                      }
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg transition-all"
                    >
                      {isProcessingText ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="mr-2"
                        >
                          <RotateCcw className="h-5 w-5" />
                        </motion.div>
                      ) : (
                        <Send className="h-5 w-5 mr-2" />
                      )}
                      {isProcessingText ? "Converting..." : "Convert to Emojis"}
                    </Button>
                  </form>
                  <p className="text-xs text-purple-400 mt-2 text-center">
                    Press Enter to convert • Shift+Enter for new line
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Mobile FAB */}
      <AnimatePresence>
        {isMobile && (
          <>
            {/* Mode Toggle FAB */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed bottom-6 left-6 z-50"
            >
              <Button
                onClick={() =>
                  setInputMode(inputMode === "voice" ? "text" : "voice")
                }
                size="icon"
                variant="secondary"
                className="w-12 h-12 rounded-full shadow-lg bg-purple-800/80 hover:bg-purple-700/80 border border-purple-600/50"
              >
                <motion.div
                  animate={{ rotate: inputMode === "text" ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {inputMode === "voice" ? (
                    <Type className="h-5 w-5 text-purple-200" />
                  ) : (
                    <Mic className="h-5 w-5 text-purple-200" />
                  )}
                </motion.div>
              </Button>
            </motion.div>

            {/* Main Action FAB */}
            {inputMode === "voice" && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="fixed bottom-6 right-6 z-50"
              >
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  size="icon"
                  disabled={isProcessingText}
                  className={`w-14 h-14 rounded-full shadow-lg ${
                    isRecording
                      ? "bg-gradient-to-r from-red-600 to-red-700"
                      : "bg-gradient-to-r from-purple-600 to-blue-600"
                  }`}
                >
                  <motion.div
                    animate={
                      isRecording
                        ? { scale: [1, 1.2, 1] }
                        : { scale: [1, 1.05, 1] }
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
          </>
        )}
      </AnimatePresence>

      {/* Privacy Settings Button */}
      <motion.div
        className="fixed top-4 right-4 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={resetConsent}
          size="sm"
          variant="ghost"
          className="bg-purple-900/60 backdrop-blur-sm border border-purple-600/30 text-purple-200 hover:bg-purple-800/60"
          title="Privacy Settings"
        >
          <Shield className="h-4 w-4 mr-2" />
          {!isMobile && "Privacy"}
        </Button>
      </motion.div>

      {/* Consent Dialog */}
      <ConsentDialog
        isOpen={showDialog}
        onAccept={handleAccept}
        onDecline={handleDecline}
      />

      {/* Consent Status Badge */}
      {consentStatus !== "pending" && (
        <motion.div
          className="fixed top-4 left-4 z-40"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
        >
          <Badge
            variant={consentStatus === "accepted" ? "default" : "secondary"}
            className={`${
              consentStatus === "accepted"
                ? "bg-green-800/60 text-green-200 border-green-600/30"
                : "bg-amber-800/60 text-amber-200 border-amber-600/30"
            } backdrop-blur-sm`}
          >
            {consentStatus === "accepted" ? "Voice Enabled" : "Text Only"}
          </Badge>
        </motion.div>
      )}
    </div>
  );
}
