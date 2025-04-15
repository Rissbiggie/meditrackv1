import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, AlertTriangle, Scale, HelpCircle } from "lucide-react";

export default function TermsOfServicePage() {
  const sections = [
    {
      title: "Acceptance of Terms",
      icon: <FileText className="h-6 w-6 text-secondary" />,
      content: `By accessing and using MediTrack's services, you acknowledge that you have read,
        understood, and agree to be bound by these Terms of Service. If you do not agree
        with any part of these terms, you must not use our services.`
    },
    {
      title: "Service Description",
      icon: <HelpCircle className="h-6 w-6 text-secondary" />,
      subsections: [
        {
          title: "Emergency Services",
          content: "MediTrack provides emergency medical assistance coordination, including:",
          items: [
            "Emergency response coordination",
            "Real-time location sharing with emergency services",
            "Medical information access for emergency responders",
            "Emergency contact notification"
          ]
        },
        {
          title: "Medical Information Management",
          content: "Users can store and manage their medical information:",
          items: [
            "Personal medical profiles",
            "Emergency contact information",
            "Medical history and conditions",
            "Current medications and allergies"
          ]
        }
      ]
    },
    {
      title: "User Responsibilities",
      icon: <AlertTriangle className="h-6 w-6 text-secondary" />,
      content: "As a user of MediTrack, you agree to:",
      items: [
        "Provide accurate and up-to-date medical information",
        "Use the service only for legitimate emergency purposes",
        "Maintain the confidentiality of your account credentials",
        "Report any unauthorized use of your account",
        "Comply with all applicable laws and regulations"
      ]
    },
    {
      title: "Legal Disclaimers",
      icon: <Scale className="h-6 w-6 text-secondary" />,
      content: "Important legal information:",
      items: [
        "MediTrack is not a substitute for professional medical advice",
        "We do not guarantee immediate emergency response times",
        "Service availability may vary by location",
        "We are not liable for damages arising from service use",
        "Medical information accuracy depends on user input"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Terms of Service" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h2 className="text-white font-semibold text-xl mb-2">Terms of Service</h2>
              <p className="text-white/60 mb-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
              <p className="text-white/80 mb-6">
                Please read these Terms of Service carefully before using MediTrack's services.
                These terms govern your use of our application and services.
              </p>

              <div className="space-y-6">
                {sections.map((section, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      {section.icon}
                      <h3 className="text-white font-semibold ml-2">{section.title}</h3>
                    </div>
                    
                    {section.content && (
                      <p className="text-white/70 mb-3">{section.content}</p>
                    )}

                    {section.items && (
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-white/70 flex items-start">
                            <span className="text-secondary mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {section.subsections && (
                      <div className="space-y-4 mt-3">
                        {section.subsections.map((subsection, subIndex) => (
                          <div key={subIndex} className="bg-white/5 rounded-lg p-3">
                            <h4 className="text-white font-medium mb-2">{subsection.title}</h4>
                            <p className="text-white/70 mb-2">{subsection.content}</p>
                            <ul className="space-y-2">
                              {subsection.items.map((item, itemIndex) => (
                                <li key={itemIndex} className="text-white/70 flex items-start">
                                  <span className="text-secondary mr-2">•</span>
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-white font-semibold">Contact Us</h3>
                <p className="text-white/70">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="text-white/70 space-y-2">
                  <li>• By email: legal@meditrack.com</li>
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