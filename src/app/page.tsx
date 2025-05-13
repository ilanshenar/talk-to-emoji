"use client";

import OpenAISpeechToText from "./components/OpenAISpeechToText";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="text-center mb-16">
          <h1 className="text-7xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-transparent bg-clip-text animate-pulse">
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
