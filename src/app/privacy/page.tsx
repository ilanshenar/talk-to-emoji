import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
            Privacy Policy
          </h1>
          <p className="text-purple-300 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="space-y-6">
          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <div>
                <h4 className="font-semibold text-purple-100 mb-2">
                  Audio Data
                </h4>
                <p>
                  When you use our voice recording feature, we temporarily
                  collect and process your voice recordings to convert speech to
                  text. This audio data is:
                </p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    Processed through OpenAI&apos;s Whisper API for
                    transcription
                  </li>
                  <li>Not permanently stored on our servers</li>
                  <li>Automatically deleted after processing</li>
                  <li>Only collected with your explicit consent</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-100 mb-2">
                  Text Data
                </h4>
                <p>Text you input manually or generated from speech is:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>
                    Processed through OpenAI&apos;s GPT-4o-mini API for emoji
                    conversion
                  </li>
                  <li>Temporarily stored in your browser session only</li>
                  <li>Not saved to any permanent database</li>
                  <li>Cleared when you close your browser</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-purple-100 mb-2">
                  Technical Data
                </h4>
                <p>We may automatically collect:</p>
                <ul className="list-disc ml-6 mt-2 space-y-1">
                  <li>Device type and browser information</li>
                  <li>IP address (for security and analytics)</li>
                  <li>Usage patterns and error logs</li>
                  <li>Performance metrics</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>We use the collected information to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Convert your speech to text using OpenAI&apos;s Whisper
                  technology
                </li>
                <li>Transform text into emoji representations using AI</li>
                <li>Improve the accuracy and quality of our service</li>
                <li>Provide technical support and troubleshooting</li>
                <li>Ensure security and prevent abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                3. Data Sharing and Third Parties
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <div>
                <h4 className="font-semibold text-purple-100 mb-2">
                  OpenAI Services
                </h4>
                <p>
                  Your audio and text data is processed by OpenAI&apos;s APIs.
                  OpenAI&apos;s data handling is governed by their privacy
                  policy at{" "}
                  <a
                    href="https://openai.com/privacy"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    https://openai.com/privacy
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-100 mb-2">
                  No Sale of Personal Data
                </h4>
                <p>
                  We do not sell, rent, or trade your personal information to
                  third parties for marketing purposes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-purple-100 mb-2">
                  Legal Requirements
                </h4>
                <p>
                  We may disclose information if required by law, court order,
                  or to protect our rights and safety.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                4. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>We implement appropriate security measures including:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Encrypted data transmission (HTTPS/TLS)</li>
                <li>Secure API communications with OpenAI</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Prompt deletion of temporary data</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                5. Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>You have the right to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Decline microphone access (you can still use text input)
                </li>
                <li>Clear your browser data at any time</li>
                <li>Contact us regarding your data</li>
                <li>Request information about data processing</li>
                <li>Report privacy concerns</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                6. Children&apos;s Privacy (COPPA)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                Mojimajic is not designed for children under 13 years of age. We
                do not knowingly collect personal information from children
                under 13. If you are a parent or guardian and believe your child
                has provided us with personal information, please contact us
                immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                7. International Users
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                If you are accessing Mojimajic from outside the United States,
                please be aware that your information may be transferred to,
                stored, and processed in the United States and other countries
                where our service providers operate.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                8. Changes to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new privacy policy on
                this page and updating the &quot;last updated&quot; date.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">9. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                If you have any questions about this privacy policy or our
                practices, please contact us at:
              </p>
              <div className="bg-purple-900/50 p-4 rounded-lg">
                <p>Email: privacy@mojimajic.com</p>
                <p>Website: https://mojimajic.com</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <footer className="text-center mt-8 text-purple-400">
          <Link href="/" className="hover:text-purple-200 underline">
            ← Back to Mojimajic
          </Link>
        </footer>
      </div>
    </main>
  );
}
