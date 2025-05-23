"use client";

import OpenAISpeechToText from "./components/OpenAISpeechToText";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <header className="text-center mb-8 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-pulse">
            MOJIMAJIC
          </h1>
          <h2 className="text-gray-600 mt-2 text-lg md:text-xl">
            AI-Powered Speech to Emoji Converter
          </h2>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto">
            Transform your voice into expressive emojis instantly. Speak
            naturally and watch as our AI converts your words into fun, colorful
            emoji representations perfect for social media and messaging.
          </p>
        </header>

        <section aria-label="Speech to Emoji Converter Tool">
          <OpenAISpeechToText />
        </section>

        <section className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            How Mojimajic Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl mb-3">🎤</div>
              <h4 className="font-semibold text-lg mb-2">1. Speak</h4>
              <p className="text-gray-600 text-sm">
                Click the microphone button and speak naturally. Our advanced
                speech recognition captures your words with high accuracy.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl mb-3">🤖</div>
              <h4 className="font-semibold text-lg mb-2">2. AI Magic</h4>
              <p className="text-gray-600 text-sm">
                Our AI analyzes your speech and intelligently converts
                meaningful words into relevant emojis while preserving sentence
                structure.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-semibold text-lg mb-2">3. Copy & Share</h4>
              <p className="text-gray-600 text-sm">
                Get your emoji-fied text instantly! Copy it with one click and
                share your creative expressions anywhere.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Perfect for Social Media & Messaging
          </h3>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700">
            <li className="flex items-center">
              <span className="text-xl mr-2">✨</span>
              Make your social media posts more engaging
            </li>
            <li className="flex items-center">
              <span className="text-xl mr-2">💬</span>
              Add personality to your messages
            </li>
            <li className="flex items-center">
              <span className="text-xl mr-2">🎨</span>
              Create unique emoji art from speech
            </li>
            <li className="flex items-center">
              <span className="text-xl mr-2">🚀</span>
              Express yourself in a fun, visual way
            </li>
          </ul>
        </section>
      </div>

      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>&copy; 2024 Mojimajic. Transform your voice into emoji magic.</p>
      </footer>
    </main>
  );
}
