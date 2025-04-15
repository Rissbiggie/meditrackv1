import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageCircle } from "lucide-react";

export default function HelpCenterPage() {
  const faqs = [
    {
      question: "How do I request emergency assistance?",
      answer: "To request emergency assistance, press the red 'EMERGENCY' button on the home screen. Your location will be automatically shared with emergency services, and the nearest available ambulance will be dispatched to your location."
    },
    {
      question: "How can I update my medical information?",
      answer: "You can update your medical information from your dashboard. Click on the 'Update Medical Information' button in the Medical Information section, and fill in your details including blood type, allergies, conditions, and current medications."
    },
    {
      question: "What should I do if I can't see nearby facilities?",
      answer: "First, ensure location services are enabled on your device. If the problem persists, try refreshing the page or logging out and back in. If you still experience issues, please contact our support team."
    },
    {
      question: "How do I add emergency contacts?",
      answer: "Navigate to your dashboard and find the Emergency Contacts section. Click on 'Manage Emergency Contacts' to add, edit, or remove contacts who should be notified in case of an emergency."
    },
    {
      question: "Is my medical information secure?",
      answer: "Yes, we take your privacy seriously. All medical information is encrypted and stored securely. Only authorized emergency responders can access this information during an active emergency."
    }
  ];

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Help Center" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          <h2 className="text-white font-semibold text-xl mb-4">Help Center</h2>

          {/* Quick Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
              <CardContent className="p-4 text-center">
                <Phone className="h-6 w-6 text-secondary mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Phone Support</h3>
                <p className="text-white/60 text-sm">24/7 Emergency Line</p>
                <p className="text-white font-medium">1-800-MEDI-HELP</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
              <CardContent className="p-4 text-center">
                <Mail className="h-6 w-6 text-secondary mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Email Support</h3>
                <p className="text-white/60 text-sm">Response within 24h</p>
                <p className="text-white font-medium">support@meditrack.com</p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
              <CardContent className="p-4 text-center">
                <MessageCircle className="h-6 w-6 text-secondary mx-auto mb-2" />
                <h3 className="text-white font-medium mb-1">Live Chat</h3>
                <p className="text-white/60 text-sm">Available 9AM-5PM</p>
                <Button 
                  className="mt-2 bg-secondary/20 hover:bg-secondary/30 text-secondary"
                  size="sm"
                >
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-4">Frequently Asked Questions</h3>
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-white/5 rounded-lg border-none"
                  >
                    <AccordionTrigger className="text-white hover:no-underline px-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/80 px-4 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card className="bg-white/10 backdrop-blur-sm rounded-xl mb-6 border-none">
            <CardContent className="p-4">
              <h3 className="text-white font-semibold mb-3">Additional Resources</h3>
              <div className="space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-start"
                >
                  <i className="fas fa-book mr-2"></i>
                  User Guide
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-start"
                >
                  <i className="fas fa-video mr-2"></i>
                  Video Tutorials
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full bg-white/5 hover:bg-white/10 text-white justify-start"
                >
                  <i className="fas fa-newspaper mr-2"></i>
                  Latest Updates
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Navbar />
    </div>
  );
} 