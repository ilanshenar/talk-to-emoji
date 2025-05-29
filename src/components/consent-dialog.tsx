"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Shield, Eye, ExternalLink } from "lucide-react";

interface ConsentDialogProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export default function ConsentDialog({
  isOpen,
  onAccept,
  onDecline,
}: ConsentDialogProps) {
  useEffect(() => {
    // Check if user has already given consent
    const consent = localStorage.getItem("mojimajic-consent");
    if (consent === "accepted") {
      onAccept();
    } else if (consent === "declined") {
      onDecline();
    }
  }, [onAccept, onDecline]);

  const handleAccept = () => {
    localStorage.setItem("mojimajic-consent", "accepted");
    onAccept();
  };

  const handleDecline = () => {
    localStorage.setItem("mojimajic-consent", "declined");
    onDecline();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3, type: "spring" }}
          className="w-full max-w-2xl"
        >
          <Card className="bg-slate-900/95 backdrop-blur-lg border-purple-600/50 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-600/20 rounded-full">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-purple-100">
                Privacy & Data Consent
              </CardTitle>
              <Badge
                variant="secondary"
                className="mx-auto bg-purple-800/40 text-purple-200"
              >
                Your Privacy Matters
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="text-purple-200 space-y-4">
                <p className="text-center">
                  Welcome to Mojimajic! Before you start converting speech to
                  emojis, please understand how we handle your data.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-purple-800/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Mic className="h-5 w-5 text-purple-400 mr-2" />
                      <h4 className="font-semibold text-purple-100">
                        Voice Data
                      </h4>
                    </div>
                    <ul className="text-sm space-y-1 text-purple-300">
                      <li>• Processed by OpenAI&apos;s Whisper API</li>
                      <li>• Never permanently stored</li>
                      <li>• Deleted immediately after processing</li>
                      <li>• Used only for speech-to-text conversion</li>
                    </ul>
                  </div>

                  <div className="bg-purple-800/20 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Eye className="h-5 w-5 text-purple-400 mr-2" />
                      <h4 className="font-semibold text-purple-100">
                        Text Data
                      </h4>
                    </div>
                    <ul className="text-sm space-y-1 text-purple-300">
                      <li>• Processed by OpenAI&apos;s GPT-4o-mini</li>
                      <li>• Stored only in your browser session</li>
                      <li>• Cleared when you close the browser</li>
                      <li>• Used only for emoji conversion</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-amber-900/20 border border-amber-600/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-200 mb-2">
                    Important:
                  </h4>
                  <ul className="text-sm space-y-1 text-amber-100">
                    <li>• You can use text input without microphone access</li>
                    <li>• You can revoke consent at any time</li>
                    <li>• We comply with GDPR, CCPA, and COPPA regulations</li>
                    <li>• This service is not intended for users under 13</li>
                  </ul>
                </div>

                <div className="flex items-center justify-center space-x-4 text-sm">
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 underline flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Privacy Policy
                  </a>
                  <a
                    href="/terms"
                    target="_blank"
                    className="text-blue-400 hover:text-blue-300 underline flex items-center"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Terms of Service
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="flex-1 border-purple-600/50 text-purple-200 hover:bg-purple-800/30"
                >
                  Use Text Only
                </Button>
                <Button
                  onClick={handleAccept}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Accept & Enable Voice
                </Button>
              </div>

              <p className="text-xs text-purple-400 text-center">
                By clicking &quot;Accept & Enable Voice&quot;, you consent to
                our data practices as described in our Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Hook for managing consent state
export function useConsent() {
  const [consentStatus, setConsentStatus] = useState<
    "pending" | "accepted" | "declined"
  >("pending");
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("mojimajic-consent");
    if (consent === "accepted") {
      setConsentStatus("accepted");
    } else if (consent === "declined") {
      setConsentStatus("declined");
    } else {
      setShowDialog(true);
    }
  }, []);

  const handleAccept = () => {
    setConsentStatus("accepted");
    setShowDialog(false);
  };

  const handleDecline = () => {
    setConsentStatus("declined");
    setShowDialog(false);
  };

  const resetConsent = () => {
    localStorage.removeItem("mojimajic-consent");
    setConsentStatus("pending");
    setShowDialog(true);
  };

  return {
    consentStatus,
    showDialog,
    handleAccept,
    handleDecline,
    resetConsent,
  };
}
