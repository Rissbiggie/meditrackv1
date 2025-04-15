import { useState } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Navbar } from "@/components/layout/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Phone, Mail, Clock, MapPin } from "lucide-react";

export default function ContactSupportPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      setIsSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-primary pb-20">
      <AppHeader title="Contact Support" />

      <main className="pt-20 px-4">
        <div className="fade-in">
          <h2 className="text-white font-semibold text-xl mb-4">Contact Support</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Form */}
            <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-4">Send us a message</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Name</label>
                    <Input
                      required
                      type="text"
                      placeholder="Your name"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Email</label>
                    <Input
                      required
                      type="email"
                      placeholder="Your email"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Subject</label>
                    <Input
                      required
                      type="text"
                      placeholder="How can we help?"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div>
                    <label className="text-white/80 text-sm mb-1 block">Message</label>
                    <Textarea
                      required
                      placeholder="Describe your issue..."
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50 min-h-[120px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary hover:bg-secondary/90 text-primary"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 text-secondary mt-1 mr-3" />
                      <div>
                        <p className="text-white font-medium">Phone Support</p>
                        <p className="text-white/60">1-800-MEDI-HELP</p>
                        <p className="text-white/60 text-sm">24/7 Emergency Support</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="h-5 w-5 text-secondary mt-1 mr-3" />
                      <div>
                        <p className="text-white font-medium">Email</p>
                        <p className="text-white/60">support@meditrack.com</p>
                        <p className="text-white/60 text-sm">Response within 24 hours</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-secondary mt-1 mr-3" />
                      <div>
                        <p className="text-white font-medium">Business Hours</p>
                        <p className="text-white/60">Monday - Friday</p>
                        <p className="text-white/60">9:00 AM - 5:00 PM EST</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-secondary mt-1 mr-3" />
                      <div>
                        <p className="text-white font-medium">Office Location</p>
                        <p className="text-white/60">123 Medical Center Drive</p>
                        <p className="text-white/60">Suite 200</p>
                        <p className="text-white/60">Boston, MA 02115</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm rounded-xl border-none">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="ghost" 
                      className="w-full bg-white/5 hover:bg-white/10 text-white justify-start"
                      onClick={() => window.location.href = '/help-center'}
                    >
                      Visit Help Center
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full bg-white/5 hover:bg-white/10 text-white justify-start"
                    >
                      FAQs
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full bg-white/5 hover:bg-white/10 text-white justify-start"
                    >
                      System Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Navbar />
    </div>
  );
} 