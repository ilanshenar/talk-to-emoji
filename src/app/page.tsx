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
    <main className="flex min-h-screen flex-col items-center justify-between p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 safe-top safe-bottom">
      <motion.div
        className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header
          className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-2"
          variants={itemVariants}
        >
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text drop-shadow-2xl leading-tight"
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
            className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg lg:text-xl font-medium bg-purple-800/40 text-purple-100 border-purple-600/50 px-3 py-1 sm:px-4 sm:py-2"
          >
            AI-Powered Speech to Emoji Converter
          </Badge>
          <motion.p
            className="text-purple-300 mt-4 sm:mt-6 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base md:text-lg px-2"
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
          className="px-1 sm:px-2"
        >
          <SpeechToEmoji />
        </motion.section>

        <motion.section
          className="mt-12 sm:mt-16 text-center px-2"
          variants={itemVariants}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-purple-100 mb-4 sm:mb-6">
            How Mojimajic Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="w-full"
              >
                <Card className="bg-purple-700/30 backdrop-blur-sm border-purple-600/50 hover:bg-purple-700/40 transition-all h-full">
                  <CardHeader className="text-center pb-3 sm:pb-4">
                    <div
                      className="text-3xl sm:text-4xl mb-2 sm:mb-3"
                      role="img"
                      aria-label={feature.title}
                    >
                      {feature.emoji}
                    </div>
                    <CardTitle className="text-base sm:text-lg text-purple-100">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-purple-300 text-xs sm:text-sm leading-relaxed text-center">
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
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="px-2"
        >
          <Card className="mt-12 sm:mt-16 bg-gradient-to-r from-purple-800/40 to-blue-800/40 backdrop-blur-sm border-purple-600/30">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-purple-100 text-center px-2">
                Perfect for Social Media & Messaging
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center text-purple-200 text-sm sm:text-base"
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <benefit.icon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 text-purple-300 flex-shrink-0" />
                    <span className="leading-tight">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </motion.div>

      <motion.footer
        className="mt-12 sm:mt-16 text-center text-purple-400 text-xs sm:text-sm space-y-2 px-4 pb-safe-bottom"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex flex-col xs:flex-row justify-center items-center space-y-2 xs:space-y-0 xs:space-x-6 mb-2">
          <a
            href="/privacy"
            className="hover:text-purple-200 underline underline-offset-2"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:text-purple-200 underline underline-offset-2"
          >
            Terms of Service
          </a>
        </div>
        <p className="leading-tight">
          &copy; 2024 Mojimajic. Transform your voice into emoji magic.
        </p>
      </motion.footer>
    </main>
  );
}
