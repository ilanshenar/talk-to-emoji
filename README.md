# EMOJIFIER

A fun speech-to-emoji game for kids! Speak into the microphone and watch your words transform into emojis. Can you guess what the emojis mean?

## Features

- Real-time speech-to-text using OpenAI's Whisper API
- Automatic emoji conversion using GPT-4o-mini
- Kid-friendly interface with fun animations
- Profanity filter with funny responses
- Support for English and Spanish
- Reveal/hide text functionality

## Getting Started

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Create a `.env.local` file with your environment variables (see `.env.example`)
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

### Deployment to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add the following environment variables in your Vercel project settings:
   - `OPENAI_API_KEY`
   - `AWS_ACCESS_KEY_ID` (if using AWS services)
   - `AWS_SECRET_ACCESS_KEY` (if using AWS services)
   - `AWS_REGION` (if using AWS services)
   - `AWS_S3_BUCKET` (if using AWS services)
5. Deploy!

The app will be automatically deployed and available at your Vercel URL.

## Environment Variables

See `.env.example` for required environment variables.

## Technologies Used

- Next.js 15
- OpenAI API (Whisper and GPT-4o-mini)
- Tailwind CSS
- TypeScript

## License

MIT
