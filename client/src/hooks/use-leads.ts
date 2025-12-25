import { useMutation } from "@tanstack/react-query";
import { api, type InsertLead } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// POST /api/leads
export function useCreateLead() {
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertLead) => {
      // Validate with schema first
      const validated = api.leads.create.input.parse(data);
      
      const res = await fetch(api.leads.create.path, {
        method: api.leads.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = await res.json();
          throw new Error(error.message || "Invalid input");
        }
        throw new Error("Failed to submit inquiry");
      }
      
      return api.leads.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Request Received",
        description: "A care coordinator will reach out to you shortly.",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
}
