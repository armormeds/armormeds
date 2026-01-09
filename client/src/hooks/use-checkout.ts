import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CheckoutParams {
  priceId: string;
  productName?: string;
  customerEmail?: string;
}

export function useCheckout() {
  const { toast } = useToast();

  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId, productName, customerEmail }: CheckoutParams) => {
      const response = await apiRequest("POST", "/api/stripe/checkout", {
        priceId,
        productName,
        customerEmail,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  const oneTimeCheckoutMutation = useMutation({
    mutationFn: async ({ priceId, productName, customerEmail }: CheckoutParams) => {
      const response = await apiRequest("POST", "/api/stripe/checkout-one-time", {
        priceId,
        productName,
        customerEmail,
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: any) => {
      toast({
        title: "Checkout Error",
        description: error.message || "Failed to start checkout. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    checkout: checkoutMutation.mutate,
    checkoutOneTime: oneTimeCheckoutMutation.mutate,
    isLoading: checkoutMutation.isPending || oneTimeCheckoutMutation.isPending,
  };
}
