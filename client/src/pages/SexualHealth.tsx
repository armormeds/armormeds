import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Check, ArrowRight, Shield, Lock, Truck, Star, BadgeCheck, CreditCard, RefreshCcw, Headphones } from "lucide-react";
import { SafetyDisclosure } from "@/components/SafetyDisclosure";
import type { Product } from "@shared/schema";

const TESTIMONIALS = [
  {
    name: "Robert H.",
    location: "Dallas, TX",
    text: "I put this off for years out of embarrassment. ArmorMeds made the whole process so easy — no awkward in-person visits. The medication works and arrived in plain packaging.",
    initials: "RH",
    result: "Life-changing"
  },
  {
    name: "Marcus W.",
    location: "Atlanta, GA",
    text: "The consultation was quick and completely confidential. Tadalafil changed everything for me. My confidence is back and my relationship is stronger than ever.",
    initials: "MW",
    result: "Confidence restored"
  },
  {
    name: "Steven K.",
    location: "Seattle, WA",
    text: "I tried Sildenafil and it worked the first time. The price is unbeatable and the whole process — from intake form to delivery — took less than a week.",
    initials: "SK",
    result: "Fast results"
  }
];

const INCLUDED = [
  "Licensed physician consultation",
  "Personalized prescription",
  "Medication included",
  "Free discreet shipping",
  "Unlimited provider support",
];

export default function SexualHealth() {
  const { data: allProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const products = allProducts?.filter(p => p.category === "sexual-health") || [];

  const stats = [
    { value: "50,000+", label: "Men Treated" },
    { value: "9 / 10", label: "Patients See Results" },
    { value: "100%", label: "Discreet Delivery" },
    { value: "$2", label: "Per Dose" }
  ];

  const steps = [
    { title: "Quick Assessment", description: "5-minute online questionnaire — completely private" },
    { title: "Doctor Review", description: "Board-certified provider evaluates your case within 24 hours" },
    { title: "Prescription Approved", description: "If approved, your medication is prepared and packaged" },
    { title: "Discreet Delivery", description: "Plain packaging with no labels — delivered free to your door" }
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
              <span>100% Private &amp; Discreet</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              Performance{" "}
              <span className="text-blue-600">redefined.</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
              Precision-compounded ED treatments, prescribed online by licensed providers and tailored to your individual needs.
              Discreet packaging, free delivery, real results.
            </p>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-600" /> No contracts</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-600" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-600" /> HSA / FSA accepted</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-blue-600" /> Plain packaging</span>
            </div>
            
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
                  <Card className="h-full overflow-hidden card-hover flex flex-col" data-testid={`card-product-${product.id}`}>
                    <div className="aspect-[4/3] overflow-hidden bg-secondary/50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold mb-1" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                      <p className="text-blue-600 font-bold text-sm mb-2" data-testid={`text-product-price-${product.id}`}>{product.price}</p>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                      <div className="space-y-1.5 mb-4 flex-1">
                        {Array.isArray(product.benefits) && product.benefits.slice(0, 3).map((benefit, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm">
                            <Check className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>Includes doctor consult + free shipping</span>
                        </div>
                      </div>
                      <Link href="/get-started?category=sexual-health">
                        <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700" size="sm" data-testid={`button-get-started-${product.id}`}>
                          Get Started
                        </Button>
                      </Link>
                      <p className="text-center text-xs text-muted-foreground mt-2">No contracts · Cancel anytime</p>
                      <SafetyDisclosure productName={product.name} />
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

      {/* What's Included */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-4">Everything included. Nothing hidden.</h2>
              <p className="text-muted-foreground mb-6">
                One simple price covers everything you need — from the consultation to your door.
              </p>
              <ul className="space-y-3">
                {INCLUDED.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4 mt-6 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-blue-600" /> HSA / FSA accepted</span>
                <span className="flex items-center gap-1.5"><RefreshCcw className="w-4 h-4 text-primary" /> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><Headphones className="w-4 h-4 text-blue-600" /> 24/7 support</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-blue-100 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">100% Private &amp; Confidential</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Your information is protected by HIPAA. Plain packaging, no labels, no one will know what's inside.
                All consultations are completely private.
              </p>
              <Link href="/get-started?category=sexual-health">
                <Button className="w-full rounded-full bg-blue-600 hover:bg-blue-700" data-testid="button-included-cta">
                  Start Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">Real Results, Real Men</h2>
            <p className="text-muted-foreground">Thousands of men have taken back control of their health</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <Card key={idx} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-5 leading-relaxed text-sm">"{t.text}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <BadgeCheck className="w-3 h-3" />
                          <span>Verified Patient</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{t.result}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-center text-xs text-muted-foreground mt-6 max-w-2xl mx-auto">
            * Individual results vary. These testimonials reflect individual patient experiences and are not typical results.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">Simple &amp; Discreet Process</h2>
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
          <p className="text-slate-300 mb-2">
            Private consultations, precision-compounded treatments, delivered discreetly to your door
          </p>
          <p className="text-slate-400/70 text-sm mb-8">No contracts · Cancel anytime · HSA / FSA accepted</p>
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
