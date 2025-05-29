import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-transparent bg-clip-text">
            Terms of Service
          </h1>
          <p className="text-purple-300 mt-2">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <div className="space-y-6">
          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                By accessing or using Mojimajic (&quot;the Service&quot;), you
                agree to be bound by these Terms of Service (&quot;Terms&quot;).
                If you disagree with any part of these terms, you may not access
                the Service.
              </p>
              <p>
                These Terms apply to all visitors, users, and others who access
                or use the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                2. Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                Mojimajic is an AI-powered service that converts speech and text
                into emoji representations. The Service includes:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Speech-to-text transcription using OpenAI&apos;s Whisper
                  technology
                </li>
                <li>Text-to-emoji conversion using AI language models</li>
                <li>Text input for direct emoji conversion</li>
                <li>Copy and share functionality for generated emojis</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                3. User Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                You must be at least 13 years old to use this Service. By using
                the Service, you represent and warrant that:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>You are at least 13 years of age</li>
                <li>You have the legal capacity to enter into these Terms</li>
                <li>
                  Your use of the Service will not violate any applicable law or
                  regulation
                </li>
                <li>All information you provide is accurate and truthful</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                4. Acceptable Use
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>You agree NOT to use the Service to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  Upload, post, or transmit any content that is illegal,
                  harmful, threatening, abusive, or offensive
                </li>
                <li>
                  Violate any local, state, national, or international law or
                  regulation
                </li>
                <li>
                  Infringe upon or violate our intellectual property rights or
                  the intellectual property rights of others
                </li>
                <li>
                  Harass, abuse, insult, harm, defame, slander, disparage,
                  intimidate, or discriminate
                </li>
                <li>Submit false or misleading information</li>
                <li>
                  Attempt to gain unauthorized access to our systems or networks
                </li>
                <li>
                  Use the Service for commercial purposes without our express
                  written consent
                </li>
                <li>
                  Interfere with or circumvent the security features of the
                  Service
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                5. Privacy and Data
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs your use of the Service, to
                understand our practices.
              </p>
              <p>
                By using the Service, you consent to the collection and use of
                information as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                6. Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                The Service and its original content, features, and
                functionality are and will remain the exclusive property of
                Mojimajic and its licensors. The Service is protected by
                copyright, trademark, and other laws.
              </p>
              <p>
                You retain ownership of any content you input into the Service,
                but you grant us a limited license to process this content for
                the purpose of providing the Service.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                7. Third-Party Services
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                Our Service uses third-party services, including OpenAI&apos;s
                APIs. Your use of the Service is also subject to these third
                parties&apos; terms of service and privacy policies:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <a
                    href="https://openai.com/terms"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    OpenAI Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href="https://openai.com/privacy"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    OpenAI Privacy Policy
                  </a>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">8. Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                THE SERVICE IS PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS
                AVAILABLE&quot; BASIS. WE MAKE NO WARRANTIES, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>The accuracy or reliability of AI-generated content</li>
                <li>The availability or uptime of the Service</li>
                <li>The fitness for any particular purpose</li>
                <li>The security of data transmission</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                9. Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                IN NO EVENT SHALL MOJIMAJIC BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, OR
                OTHER INTANGIBLE LOSSES.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">10. Termination</CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                We may terminate or suspend your access immediately, without
                prior notice or liability, for any reason whatsoever, including
                without limitation if you breach the Terms.
              </p>
              <p>
                Upon termination, your right to use the Service will cease
                immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                11. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                We reserve the right, at our sole discretion, to modify or
                replace these Terms at any time. If a revision is material, we
                will try to provide at least 30 days notice prior to any new
                terms taking effect.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-800/30 backdrop-blur-sm border-purple-600/50">
            <CardHeader>
              <CardTitle className="text-purple-100">
                12. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-200 space-y-4">
              <p>
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <div className="bg-purple-900/50 p-4 rounded-lg">
                <p>Email: legal@mojimajic.com</p>
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
