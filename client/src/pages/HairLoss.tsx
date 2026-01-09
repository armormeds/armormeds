import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Clock, Truck, Star, Sparkles } from "lucide-react";
import type { Product } from "@shared/schema";

export default function HairLoss() {
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = allProducts?.filter(p => p.category === "hair-loss") || [];

  return (
    <div className="min-h-screen bg-background">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/90 via-amber-800/80 to-amber-700/70" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30 no-default-hover-elevate no-default-active-elevate" data-testid="badge-hero">
              <Sparkles className="w-3 h-3 mr-1" />
              FDA-Approved Treatments
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight">
              Reclaim Your
              <span className="block text-amber-300">Confidence</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl">
              Clinically proven hair loss treatments prescribed by licensed providers. 
              Start seeing results in as little as 3-6 months with our personalized approach.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/get-started">
                <Button size="lg" className="bg-white text-amber-900 hover:bg-white/90 rounded-full px-8 shadow-lg" data-testid="button-hero-cta">
                  Start Your Treatment
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
              <p className="text-3xl font-bold text-primary" data-testid="stat-patients">100K+</p>
              <p className="text-sm text-muted-foreground">Patients Treated</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary" data-testid="stat-success">90%</p>
              <p className="text-sm text-muted-foreground">See Results</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary" data-testid="stat-rating">4.8/5</p>
              <p className="text-sm text-muted-foreground">Patient Rating</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-primary" data-testid="stat-price">$49</p>
              <p className="text-sm text-muted-foreground">Starting Price</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Hair Loss Treatments
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Prescription treatments proven to stop hair loss and promote regrowth
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
                    <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
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
                        <Link href="/get-started">
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
              <p className="text-muted-foreground">Hair loss products coming soon.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">How It Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Complete Assessment</h3>
              <p className="text-sm text-muted-foreground">Answer questions about your hair loss history and health</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Doctor Review</h3>
              <p className="text-sm text-muted-foreground">A licensed provider reviews and prescribes your treatment</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Free Delivery</h3>
              <p className="text-sm text-muted-foreground">Medications shipped discreetly to your door</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to Restore Your Hair?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands who have successfully treated their hair loss
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <span>Licensed Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>Results in 3-6 Months</span>
            </div>
          </div>
          <Link href="/get-started">
            <Button size="lg" className="bg-white text-amber-700 hover:bg-white/90 rounded-full px-10 shadow-lg" data-testid="button-bottom-cta">
              Start Your Free Consultation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
