import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Clock, Truck, Sparkles } from "lucide-react";
import type { Product } from "@shared/schema";

export default function HairLoss() {
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = allProducts?.filter(p => p.category === "hair-loss") || [];

  const stats = [
    { value: "100K+", label: "Patients Treated" },
    { value: "90%", label: "See Results" },
    { value: "4.8", label: "Patient Rating" },
    { value: "$49", label: "Starting Price" }
  ];

  const steps = [
    { title: "Complete Assessment", description: "Answer questions about your hair loss history" },
    { title: "Doctor Review", description: "Licensed provider reviews your case" },
    { title: "Free Delivery", description: "Medications shipped discreetly to your door" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>FDA-Approved Treatments</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Restore your hair,{" "}
              <span className="text-amber-600">restore your confidence.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Clinically proven treatments prescribed by licensed providers. 
              Start seeing results in as little as 3-6 months.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/get-started?category=hair-loss">
                <Button size="lg" className="h-12 px-8 rounded-full bg-amber-600 hover:bg-amber-700 w-full sm:w-auto" data-testid="button-hero-cta">
                  Start Your Treatment
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-border/50 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl sm:text-3xl font-display font-bold text-amber-600" data-testid={`stat-${idx}`}>{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">Hair Loss Treatments</h2>
            <p className="text-muted-foreground">Prescription treatments proven to stop hair loss and promote regrowth</p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[350px] rounded-xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden card-hover" data-testid={`card-product-${product.id}`}>
                    <div className="aspect-[4/3] overflow-hidden bg-secondary/50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-semibold mb-1" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                      <p className="text-amber-600 font-medium text-sm mb-3" data-testid={`text-product-price-${product.id}`}>{product.price}</p>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="space-y-1.5 mb-4">
                        {Array.isArray(product.benefits) && product.benefits.slice(0, 2).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <Link href="/get-started?category=hair-loss">
                        <Button className="w-full rounded-full" size="sm" data-testid={`button-get-started-${product.id}`}>
                          Get Started
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Hair loss products coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground">Simple steps to start your treatment</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-amber-600">{idx + 1}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-amber-600">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Ready to restore your hair?
          </h2>
          <p className="text-amber-100 mb-8">
            Join thousands who have successfully treated their hair loss
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-amber-100">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Licensed Providers
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Free Shipping
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Results in 3-6 Months
            </span>
          </div>
          <Link href="/get-started?category=hair-loss">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-amber-50 h-12 px-8 rounded-full" data-testid="button-bottom-cta">
              Start Your Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
