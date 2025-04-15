import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MedicalInfo } from "@shared/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const formSchema = z.object({
  bloodType: z.string().optional(),
  allergies: z.string().optional(),
  conditions: z.string().optional(),
  medications: z.string().optional(),
});

interface MedicalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicalInfo: MedicalInfo | null | undefined;
}

export function MedicalInfoModal({ isOpen, onClose, medicalInfo }: MedicalInfoModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bloodType: medicalInfo?.bloodType || "",
      allergies: medicalInfo?.allergies || "",
      conditions: medicalInfo?.conditions || "",
      medications: medicalInfo?.medications || "",
    },
  });

  // Reset form when modal closes or medical info changes
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        bloodType: medicalInfo?.bloodType || "",
        allergies: medicalInfo?.allergies || "",
        conditions: medicalInfo?.conditions || "",
        medications: medicalInfo?.medications || "",
      });
    }
  }, [isOpen, medicalInfo, form]);

  const updateMedicalInfoMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);
      try {
        const response = await apiRequest("POST", "/api/medical-info", data);
        return await response.json();
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error("Failed to update medical information");
      }
    },
    onSuccess: (updatedInfo) => {
      queryClient.setQueryData(["/api/medical-info"], updatedInfo);
      toast({
        title: "Medical information updated",
        description: "Your medical information has been updated successfully.",
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    updateMedicalInfoMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-primary border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Medical Information</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="bloodType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Blood Type</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white/10 border-white/10 text-white">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-primary border-white/10">
                      {bloodTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="text-white hover:bg-white/10"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Allergies</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="List any allergies"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Chronic Conditions</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="List any chronic conditions"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="medications"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Current Medications</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="List current medications"
                      className="bg-white/10 border-white/10 text-white placeholder:text-white/50"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="bg-white/10 hover:bg-white/20 text-white border-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-secondary hover:bg-secondary/90 text-primary"
              >
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 