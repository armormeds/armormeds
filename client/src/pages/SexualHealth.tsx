import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Clock, Truck, Lock, Heart } from "lucide-react";
import type { Product } from "@shared/schema";

export default function SexualHealth() {
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = allProducts?.filter(p => p.category === "sexual-health") || [];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-700/85" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 no-default-hover-elevate no-default-active-elevate" data-testid="badge-hero">
              <Lock className="w-3 h-3 mr-1" />
              100% Private & Discreet
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Performance
              <span className="block text-blue-400">Redefined</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              FDA-approved treatments for ED and sexual wellness, prescribed online by licensed 
              providers. Discreet packaging, free delivery, real results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/get-started?category=sexual-health">
                <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 shadow-lg" data-testid="button-hero-cta">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 rounded-full px-8 backdrop-blur-sm" data-testid="button-hero-learn">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-muted/30 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary" data-testid="stat-patients">500K+</p>
              <p className="text-sm text-muted-foreground">Men Treated</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary" data-testid="stat-effective">95%</p>
              <p className="text-sm text-muted-foreground">Effective Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary" data-testid="stat-discreet">100%</p>
              <p className="text-sm text-muted-foreground">Discreet Shipping</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary" data-testid="stat-price">$2</p>
              <p className="text-sm text-muted-foreground">Per Dose</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Sexual Health Treatments
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Proven medications to enhance performance and confidence
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[400px] rounded-2xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
                    <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="space-y-2 mb-4">
                        {Array.isArray(product.benefits) && product.benefits.slice(0, 3).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-primary flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-lg font-bold text-primary" data-testid={`text-product-price-${product.id}`}>{product.price}</span>
                        <Link href="/get-started?category=sexual-health">
                          <Button size="sm" className="rounded-full" data-testid={`button-get-started-${product.id}`}>
                            Get Started
                          </Button>
                        </Link>
                      </div>
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

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Simple & Discreet Process</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Quick Assessment</h3>
              <p className="text-sm text-muted-foreground">5-minute online health questionnaire</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Doctor Review</h3>
              <p className="text-sm text-muted-foreground">Licensed provider evaluates your case</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Prescription</h3>
              <p className="text-sm text-muted-foreground">If approved, your Rx is sent to pharmacy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="font-semibold mb-2">Discreet Delivery</h3>
              <p className="text-sm text-muted-foreground">Plain packaging, no labels</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Take Control of Your Health
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Private consultations, proven treatments, delivered to your door
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Licensed Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>100% Confidential</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Free Discreet Shipping</span>
            </div>
          </div>
          <Link href="/get-started?category=sexual-health">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-10 shadow-lg" data-testid="button-bottom-cta">
              Start Your Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
