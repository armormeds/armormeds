import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Lock, Truck } from "lucide-react";
import type { Product } from "@shared/schema";

const SAFETY_LINKS: Record<string, string> = {
  sildenafil: "https://www.drugs.com/sildenafil.html",
  tadalafil:  "https://www.drugs.com/tadalafil.html",
  vardenafil: "https://www.drugs.com/vardenafil.html",
};

function getSafetyLink(name: string): string | null {
  const key = Object.keys(SAFETY_LINKS).find(k => name.toLowerCase().includes(k));
  return key ? SAFETY_LINKS[key] : null;
}

export default function SexualHealth() {
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = allProducts?.filter(p => p.category === "sexual-health") || [];

  const stats = [
    { value: "Thousands", label: "of Men Treated" },
    { value: "Clinically", label: "Proven Effective" },
    { value: "100%", label: "Discreet" },
    { value: "$2", label: "Per Dose" }
  ];

  const steps = [
    { title: "Quick Assessment", description: "5-minute online questionnaire" },
    { title: "Doctor Review", description: "Licensed provider evaluates your case" },
    { title: "Prescription", description: "If approved, Rx sent to pharmacy" },
    { title: "Discreet Delivery", description: "Plain packaging, no labels" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden bg-gradient-to-br from-slate-100 via-blue-50/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center lg:text-left lg:mx-0"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              <span>100% Private & Discreet</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Performance{" "}
              <span className="text-blue-600">redefined.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              FDA-approved ED treatments prescribed online by licensed providers. 
              Discreet packaging, free delivery, real results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link href="/get-started?category=sexual-health">
                <Button size="lg" className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" data-testid="button-hero-cta">
                  Get Started Now
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
                <p className="text-2xl sm:text-3xl font-display font-bold text-blue-600" data-testid={`stat-${idx}`}>{stat.value}</p>
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
            <h2 className="text-3xl font-display font-bold mb-3">ED Treatments</h2>
            <p className="text-muted-foreground">Proven medications to enhance performance and confidence</p>
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
                      <p className="text-blue-600 font-medium text-sm mb-3" data-testid={`text-product-price-${product.id}`}>{product.price}</p>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="space-y-1.5 mb-4">
                        {Array.isArray(product.benefits) && product.benefits.slice(0, 2).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <Link href="/get-started?category=sexual-health">
                        <Button className="w-full rounded-full" size="sm" data-testid={`button-get-started-${product.id}`}>
                          Get Started
                        </Button>
                      </Link>
                      {getSafetyLink(product.name) && (
                        <p className="text-xs text-muted-foreground mt-3 text-center">
                          Prescription required. Side effects may occur.{" "}
                          <a href={getSafetyLink(product.name)!} target="_blank" rel="noopener noreferrer" className="underline">
                            View safety info
                          </a>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Sexual health products coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">Simple & Discreet Process</h2>
            <p className="text-muted-foreground">Get started in just a few steps</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <Card key={idx} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-blue-600">{idx + 1}</span>
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
      <section className="py-16 lg:py-20 bg-slate-800">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">
            Take control of your health
          </h2>
          <p className="text-slate-300 mb-8">
            Private consultations, proven treatments, delivered to your door
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-slate-300">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Licensed Providers
            </span>
            <span className="flex items-center gap-2">
              <Lock className="h-4 w-4" /> 100% Confidential
            </span>
            <span className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Free Discreet Shipping
            </span>
          </div>
          <Link href="/get-started?category=sexual-health">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-full" data-testid="button-bottom-cta">
              Start Your Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
