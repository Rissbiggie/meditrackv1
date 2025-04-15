import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EmergencyContact } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2, Trash2, PencilLine, Plus } from "lucide-react";

interface EmergencyContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ContactFormData {
  name: string;
  relationship: string;
  phone: string;
}

export function EmergencyContactsModal({ isOpen, onClose }: EmergencyContactsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedContact, setSelectedContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    relationship: "",
    phone: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch emergency contacts
  const { data: contacts = [], isLoading, error } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
    retry: 1,
    refetchOnWindowFocus: false,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to load emergency contacts. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Add contact mutation
  const addContact = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch("/api/emergency-contacts", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add contact");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      resetForm();
      toast({
        title: "Success",
        description: "Emergency contact added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add emergency contact",
        variant: "destructive",
      });
    },
  });

  // Update contact mutation
  const updateContact = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ContactFormData }) => {
      const response = await fetch(`/api/emergency-contacts/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update contact");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      resetForm();
      toast({
        title: "Success",
        description: "Emergency contact updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update emergency contact",
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteContact = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/emergency-contacts/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete contact");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      toast({
        title: "Success",
        description: "Emergency contact deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete emergency contact",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && selectedContact) {
        await updateContact.mutateAsync({ id: selectedContact.id, data: formData });
      } else {
        await addContact.mutateAsync(formData);
      }
    } catch (error) {
      // Error is handled by the mutation callbacks
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setIsEditing(true);
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
    });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await deleteContact.mutateAsync(id);
      } catch (error) {
        // Error is handled by the mutation callbacks
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedContact(null);
    setFormData({ name: "", relationship: "", phone: "" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-primary border border-accent/50 rounded-xl max-w-md w-full h-[90vh] shadow-2xl">
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-xl font-semibold">
                {isEditing ? "Edit Contact" : "Add Emergency Contact"}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white/60 hover:text-white"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-white">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-white/10 border-white/10 text-white"
                  required
                  disabled={addContact.isPending || updateContact.isPending}
                />
              </div>
              <div>
                <Label htmlFor="relationship" className="text-white">Relationship</Label>
                <Input
                  id="relationship"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  className="bg-white/10 border-white/10 text-white"
                  required
                  disabled={addContact.isPending || updateContact.isPending}
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/10 border-white/10 text-white"
                  required
                  pattern="[0-9+\-\s()]+"
                  disabled={addContact.isPending || updateContact.isPending}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90"
                  disabled={addContact.isPending || updateContact.isPending}
                >
                  {(addContact.isPending || updateContact.isPending) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isEditing ? (
                    "Update Contact"
                  ) : (
                    "Add Contact"
                  )}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="bg-white/10 text-white"
                    disabled={addContact.isPending || updateContact.isPending}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-8">
              <h3 className="text-white font-semibold mb-4">Emergency Contacts</h3>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-white/60" />
                </div>
              ) : error ? (
                <div className="bg-white/5 p-3 rounded-lg">
                  <p className="text-red-400 text-center">
                    Failed to load contacts. Please try again.
                  </p>
                </div>
              ) : contacts.length === 0 ? (
                <p className="text-white/60 text-center py-4">
                  No emergency contacts added yet
                </p>
              ) : (
                <div className="space-y-3">
                  {contacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="bg-white/5 p-3 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-white/60 text-sm">
                          {contact.relationship} • {contact.phone}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(contact)}
                          className="text-white/60 hover:text-white"
                          disabled={deleteContact.isPending}
                        >
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contact.id)}
                          className="text-white/60 hover:text-red-400"
                          disabled={deleteContact.isPending}
                        >
                          {deleteContact.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 