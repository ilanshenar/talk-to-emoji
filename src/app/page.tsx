"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SpeechToEmoji from "@/components/speech-to-emoji";
import {
  Mic,
  Bot,
  Copy,
  Sparkles,
  MessageCircle,
  Palette,
  Rocket,
} from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      icon: Mic,
      title: "1. Speak",
      description:
        "Click the microphone button and speak naturally. Our advanced speech recognition captures your words with high accuracy.",
      emoji: "🎤",
    },
    {
      icon: Bot,
      title: "2. AI Magic",
      description:
        "Our AI analyzes your speech and intelligently converts meaningful words into relevant emojis while preserving sentence structure.",
      emoji: "🤖",
    },
    {
      icon: Copy,
      title: "3. Copy & Share",
      description:
        "Get your emoji-fied text instantly! Copy it with one click and share your creative expressions anywhere.",
      emoji: "📋",
    },
  ];

  const benefits = [
    { icon: Sparkles, text: "Make your social media posts more engaging" },
    { icon: MessageCircle, text: "Add personality to your messages" },
    { icon: Palette, text: "Create unique emoji art from speech" },
    { icon: Rocket, text: "Express yourself in a fun, visual way" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800">
      <motion.div
        className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          className="text-center mb-8 md:mb-16"
          variants={itemVariants}
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-2xl"
            animate={{
              scale: [1, 1.02, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            MOJIMAJIC
          </motion.h1>
          <Badge
            variant="secondary"
            className="mt-4 text-lg md:text-xl font-medium bg-purple-800/40 text-purple-100 border-purple-600/50"
          >
            AI-Powered Speech to Emoji Converter
          </Badge>
          <motion.p
            className="text-purple-300 mt-6 max-w-2xl mx-auto leading-relaxed text-base md:text-lg"
            variants={itemVariants}
          >
            Transform your voice into expressive emojis instantly. Speak
            naturally and watch as our AI converts your words into fun, colorful
            emoji representations perfect for social media and messaging.
          </motion.p>
        </motion.header>

        <motion.section
          aria-label="Speech to Emoji Converter Tool"
          variants={itemVariants}
        >
          <SpeechToEmoji />
        </motion.section>

        <motion.section className="mt-16 text-center" variants={itemVariants}>
          <h3 className="text-2xl font-bold text-purple-100 mb-6">
            How Mojimajic Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
              >
                <Card className="bg-purple-700/30 backdrop-blur-sm border-purple-600/50 hover:bg-purple-700/40 transition-all h-full">
                  <CardHeader className="text-center">
                    <div
                      className="text-4xl mb-3"
                      role="img"
                      aria-label={feature.title}
                    >
                      {feature.emoji}
                    </div>
                    <CardTitle className="text-lg text-purple-100">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-purple-300 text-sm leading-relaxed text-center">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <Card className="mt-16 bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-sm border-purple-600/30">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-purple-100 text-center">
                Perfect for Social Media & Messaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center text-purple-200"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon className="h-5 w-5 mr-3 text-purple-300" />
                    {benefit.text}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>

      <motion.footer
        className="mt-16 text-center text-purple-400 text-sm space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex justify-center space-x-6 mb-2">
          <a href="/privacy" className="hover:text-purple-200 underline">
            Privacy Policy
          </a>
          <a href="/terms" className="hover:text-purple-200 underline">
            Terms of Service
          </a>
        </div>
        <p>&copy; 2024 Mojimajic. Transform your voice into emoji magic.</p>
      </motion.footer>
    </main>
  );
}
