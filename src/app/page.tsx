"use client";

import OpenAISpeechToText from "./components/OpenAISpeechToText";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <div className="text-center mb-8 md:mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-pulse">
            MOJIMAJIC
          </h1>
          <p className="text-gray-400 mt-2">
            Speak and watch your words become emojis
          </p>
        </div>
        <OpenAISpeechToText />
      </div>
    </main>
  );
}
