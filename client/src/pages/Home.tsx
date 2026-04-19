import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check, Star, ShieldCheck, Truck, Clock, Users, Award, Stethoscope, Package, HeartPulse, Sparkles, BadgeCheck, CreditCard, RefreshCcw, Headphones } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";
const heroVideo = "/videos/pexels_diverse_faces_running.mp4";

export default function Home() {
  const { data: products } = useProducts();
  const weightLossProducts = products?.filter(p => p.category === "weight-loss") || [];

  const steps = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Complete Assessment",
      description: "Quick 5-minute online health questionnaire"
    },
    {
      icon: <Stethoscope className="w-5 h-5" />,
      title: "Provider Review",
      description: "Board-certified provider reviews within 24 hours"
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "Get Your Medication",
      description: "Prescription shipped discreetly to your door"
    },
    {
      icon: <HeartPulse className="w-5 h-5" />,
      title: "Ongoing Support",
      description: "Unlimited 24/7 care, check-ins & adjustments"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Austin, TX",
      text: "I've tried every diet out there for years. In just 3 months with ArmorMeds, I lost 32 pounds. The process was completely online and the support team answered every question I had.",
      weightLoss: "32 lbs",
      timeframe: "3 months",
      initials: "SM"
    },
    {
      name: "Michael R.",
      location: "Phoenix, AZ",
      text: "After struggling for years, this finally worked for me. The medication helped control my appetite and the provider was incredibly supportive throughout my entire journey.",
      weightLoss: "45 lbs",
      timeframe: "4 months",
      initials: "MR"
    },
    {
      name: "Jennifer K.",
      location: "Denver, CO",
      text: "The convenience of telehealth combined with real medication changed my life. I fit back into clothes I hadn't worn in 10 years. I genuinely feel like myself again.",
      weightLoss: "28 lbs",
      timeframe: "2.5 months",
      initials: "JK"
    }
  ];

  const stats = [
    { value: "50,000+", label: "Patients Treated" },
    { value: "15–20%", label: "Avg. Body Weight Lost" },
    { value: "24 hrs", label: "Prescription Review" },
    { value: "9 / 10", label: "Patients See Results" }
  ];

  const outcomeStats = [
    { value: "15–20%", label: "Average reduction in body weight", icon: "⚖️" },
    { value: "9 / 10", label: "Patients say it's the most effective treatment they've tried", icon: "🏆" },
    { value: "93%", label: "Of patients maintain their results long-term", icon: "📈" },
    { value: "24 hrs", label: "Average prescription approval time", icon: "⚡" },
  ];

  const faqs = [
    {
      question: "How do GLP-1 medications work for weight loss?",
      answer: "GLP-1 medications like Semaglutide and Tirzepatide work by mimicking a hormone that regulates appetite and blood sugar. They help you feel full longer, reduce cravings, and can lead to significant weight loss when combined with diet and exercise."
    },
    {
      question: "Am I a good candidate for this treatment?",
      answer: "Generally, candidates have a BMI of 27+ with weight-related health conditions, or a BMI of 30+. Our licensed providers will review your complete health history to determine if this treatment is right for you."
    },
    {
      question: "What are the common side effects?",
      answer: "The most common side effects are mild and temporary, including nausea, constipation, and decreased appetite. These typically improve as your body adjusts to the medication."
    },
    {
      question: "How much weight can I expect to lose?",
      answer: "Results vary by individual, but clinical studies show patients can lose 15-20% of their body weight. Our patients report an average of 15% body weight loss over 6-12 months."
    },
    {
      question: "Do I need insurance?",
      answer: "No insurance is required. We offer transparent, affordable pricing with no hidden fees. HSA and FSA funds are accepted."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. There are no long-term contracts. You can cancel your subscription at any time — no phone calls required, no hoops to jump through."
    }
  ];

  const treatments = [
    { href: "/medications", label: "Weight Loss", description: "Precision-compounded GLP-1 medications" },
    { href: "/hair-loss", label: "Hair Loss", description: "Prescription treatments for regrowth" },
    { href: "/sexual-health", label: "Sexual Health", description: "Discreet, effective solutions" }
  ];

  return (
    <div className="min-h-screen pt-16 lg:pt-20">
      {/* Marquee Trust Banner */}
      <div className="bg-primary text-primary-foreground py-3 overflow-hidden" data-testid="marquee-banner">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className="flex items-center gap-8 sm:gap-10 mx-6 shrink-0">
              <span className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="w-4 h-4 shrink-0" /> Trusted by over 50,000 patients
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <Clock className="w-4 h-4 shrink-0" /> 100% online process
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <CreditCard className="w-4 h-4 shrink-0" /> HSA & FSA accepted
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <Award className="w-4 h-4 shrink-0" /> Licensed compounding pharmacies
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <RefreshCcw className="w-4 h-4 shrink-0" /> No contracts, cancel anytime
              </span>
              <span className="flex items-center gap-2 text-sm font-medium">
                <Stethoscope className="w-4 h-4 shrink-0" /> Board-certified physicians
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section with Video Background */}
      <section className="relative min-h-[90vh] sm:min-h-[85vh] flex items-center overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            src={heroVideo}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="mb-4 sm:mb-6">
                  <span className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm text-white text-xs sm:text-sm font-medium border border-white/20">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    Trusted by over 50,000 patients nationwide
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 sm:mb-6 text-white">
                  We're simplifying the path to the{" "}
                  <span className="text-primary">Good Life</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  Access precision-compounded treatments for weight loss, hair restoration, and sexual health — 
                  prescribed by licensed providers and delivered to your door.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link href="/get-started">
                    <Button size="lg" className="rounded-full w-full sm:w-auto" data-testid="button-hero-start">
                      Find Your Treatment
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link href="/medications">
                    <Button size="lg" variant="outline" className="rounded-full w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white/30 text-white" data-testid="button-hero-medications">
                      View Treatments
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-white/70">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> No insurance needed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Free shipping
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> Cancel anytime
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary" /> HSA / FSA accepted
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y border-border/50 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-2xl sm:text-3xl font-display font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Treatment Categories */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">What We Treat</h2>
            <p className="text-muted-foreground">Comprehensive telehealth solutions for your wellness needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {treatments.map((treatment, idx) => (
              <Link key={idx} href={treatment.href}>
                <Card className="h-full card-hover cursor-pointer group">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{treatment.label}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{treatment.description}</p>
                    <span className="text-primary text-sm font-medium flex items-center gap-1">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground">Get started in just a few simple steps</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <Card className="h-full bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl font-display font-bold text-primary/20">0{idx + 1}</span>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link href="/get-started">
              <Button size="lg" className="h-12 px-8 rounded-full" data-testid="button-how-cta">
                Start Your Consultation
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground mt-3">No contracts · Cancel anytime · No insurance required</p>
          </div>
        </div>
      </section>

      {/* Featured Medications */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Weight Loss Medications</h2>
              <p className="text-muted-foreground">Precision-compounded GLP-1 treatments tailored for you</p>
            </div>
            <Link href="/medications">
              <Button variant="outline" className="rounded-full">
                View All <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {weightLossProducts.slice(0, 2).map((product, idx) => (
              <Card key={product.id} className="overflow-hidden card-hover">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/3 aspect-square bg-secondary/50 relative">
                    {idx === 0 && (
                      <div className="absolute top-2 left-2 z-10 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="flex-1 p-6">
                    <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-primary font-bold text-lg">{product.price}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{product.description}</p>
                    <div className="space-y-1.5 mb-4">
                      {Array.isArray(product.benefits) && product.benefits.slice(0, 2).map((benefit, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>Includes doctor consult + free shipping</span>
                      </div>
                    </div>
                    <Link href="/get-started">
                      <Button size="sm" className="w-full rounded-full">Get Started</Button>
                    </Link>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Outcome Statistics */}
      <section className="py-16 lg:py-20 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3 text-white">Results that speak for themselves</h2>
            <p className="text-primary-foreground/70">Real outcomes from real patients on our platform</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {outcomeStats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <p className="text-3xl sm:text-4xl font-display font-bold text-white mb-2">{stat.value}</p>
                <p className="text-sm text-primary-foreground/70 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">Real Results, Real People</h2>
            <p className="text-muted-foreground">ArmorMeds success stories keep pouring in</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <Card key={idx} className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {testimonial.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{testimonial.name}</p>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <BadgeCheck className="w-3 h-3" />
                          <span>Verified Patient</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">-{testimonial.weightLoss}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.timeframe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8 max-w-2xl mx-auto" data-testid="text-testimonial-disclaimer">
            * Results shown are not typical. Individual results vary based on starting weight, lifestyle, diet, and adherence to treatment. These testimonials reflect individual experiences.
          </p>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-10 md:p-14">
            <div className="text-5xl mb-6">🛡️</div>
            <h2 className="text-3xl font-display font-bold mb-4 text-slate-900">Our Promise to You</h2>
            <p className="text-lg text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              We're committed to your success. If you follow your treatment plan and don't see results, 
              our care team will work with you — adjusting your plan, your dosage, or your support — until you do.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm text-slate-700">
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-green-600" /> No long-term contracts
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-green-600" /> Cancel anytime, no phone call needed
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-green-600" /> HSA &amp; FSA funds accepted
              </span>
              <span className="flex items-center gap-2 font-medium">
                <Check className="w-4 h-4 text-green-600" /> Unlimited provider support
              </span>
            </div>
            <Link href="/get-started">
              <Button size="lg" className="h-12 px-10 rounded-full bg-green-600 hover:bg-green-700" data-testid="button-guarantee-cta">
                Get Started Today
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-y border-border/50 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <ShieldCheck className="w-6 h-6" />, label: "HIPAA Compliant" },
              { icon: <Award className="w-6 h-6" />, label: "Licensed Providers" },
              { icon: <CreditCard className="w-6 h-6" />, label: "HSA / FSA Accepted" },
              { icon: <Headphones className="w-6 h-6" />, label: "24/7 Support Team" }
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center justify-center gap-3 text-muted-foreground">
                <span className="text-primary">{badge.icon}</span>
                <span className="font-medium text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-3">Common Questions</h2>
            <p className="text-muted-foreground">Everything you need to know</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border/50">
                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline" data-testid={`faq-trigger-${idx}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-display font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-primary-foreground/80 mb-2">
            Join thousands of patients who have transformed their health with ArmorMeds.
          </p>
          <p className="text-primary-foreground/60 text-sm mb-8">No contracts · Cancel anytime · Free shipping</p>
          <Link href="/get-started">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8 rounded-full" data-testid="button-cta-start">
              Start Your Consultation
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
