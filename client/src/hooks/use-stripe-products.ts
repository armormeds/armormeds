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
  const query = useQuery<StripeProductsResponse>({
    queryKey: ["/api/stripe/products", category],
    staleTime: 1000 * 60 * 5,
  });

  const products = query.data?.data || [];
  
  const filteredProducts = category 
    ? products.filter(p => p.metadata?.category === category)
    : products;

  return {
    products: filteredProducts,
    isLoading: query.isLoading,
    error: query.error,
  };
}
