import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  const sections = [
    {
      title: "Information We Collect",
      icon: <Database className="h-6 w-6 text-secondary" />,
      content: [
        "Personal identification information (Name, email address, phone number)",
        "Medical information (Blood type, allergies, conditions, medications)",
        "Emergency contact information",
        "Location data during emergency situations",
        "Device information and usage statistics"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: <Eye className="h-6 w-6 text-secondary" />,
      content: [
        "To provide emergency medical services",
        "To contact emergency services and your designated contacts",
        "To improve our services and user experience",
        "To maintain and update your medical profile",
        "To communicate important updates and notifications"
      ]
    },
    {
      title: "Data Security",
      icon: <Lock className="h-6 w-6 text-secondary" />,
      content: [
        "End-to-end encryption for all sensitive data",
        "Regular security audits and updates",
        "Secure data storage with industry-standard protocols",
        "Limited access to authorized personnel only",
        "Compliance with healthcare data protection regulations"
      ]
    },
    {
      title: "Your Rights",
      icon: <Shield className="h-6 w-6 text-secondary" />,
      content: [
        "Access your personal information",
        "Correct any inaccurate data",
        "Request deletion of your data",
        "Opt-out of non-essential communications",
        "Export your data in a portable format"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Privacy Policy" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-xl mb-2">Privacy Policy</h2>
              <p className="text-white/60 mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-white/80 mb-6">
                At MediTrack, we take your privacy seriously. This Privacy Policy explains how we collect,
                use, disclose, and safeguard your information when you use our service.
              </p>

              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      {section.icon}
                      <h3 className="text-white font-semibold ml-2">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-white/70 flex items-start">
                          <span className="text-secondary mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-white font-semibold">Contact Us</h3>
                <p className="text-white/70">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="text-white/70 space-y-2">
                  <li>• By email: privacy@meditrack.com</li>
                  <li>• By phone: 1-800-MEDI-HELP</li>
                  <li>• By mail: 123 Medical Center Drive, Suite 200, Boston, MA 02115</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
    </div>
  );
} 