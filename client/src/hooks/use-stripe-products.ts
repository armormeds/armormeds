import { useQuery } from "@tanstack/react-query";

interface StripePrice {
  id: string;
  unit_amount: number;
  currency: string;
  recurring: {
    interval: string;
    interval_count: number;
  } | null;
  active: boolean;
}

interface StripeProduct {
  id: string;
  name: string;
  description: string;
  active: boolean;
  metadata: Record<string, string>;
  images: string[];
  prices: StripePrice[];
}

interface StripeProductsResponse {
  data: StripeProduct[];
}

export function useStripeProducts(category?: string) {
  const queryKey = category 
    ? ["/api/stripe/products", category]
    : ["/api/stripe/products"];
    
  const query = useQuery<StripeProductsResponse>({
    queryKey,
    staleTime: 1000 * 60 * 5,
  });

  return {
    products: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
