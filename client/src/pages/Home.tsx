import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check, Star, ShieldCheck, Truck, Clock, Users, Award, BadgeCheck, Stethoscope, Package, HeartPulse } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";

export default function Home() {
  const { data: products } = useProducts();

  const steps = [
    {
      number: "01",
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Complete Health Assessment",
      description: "Fill out a simple online questionnaire about your health history and weight loss goals in just 5 minutes."
    },
    {
      number: "02",
      icon: <Stethoscope className="w-6 h-6 text-primary" />,
      title: "Provider Review",
      description: "A licensed healthcare provider reviews your information and determines if you're a good candidate within 24 hours."
    },
    {
      number: "03",
      icon: <Package className="w-6 h-6 text-primary" />,
      title: "Get Your Medication",
      description: "If approved, your prescription is filled and shipped directly to your door with all supplies included."
    },
    {
      number: "04",
      icon: <HeartPulse className="w-6 h-6 text-primary" />,
      title: "Ongoing Support",
      description: "Receive continuous care with check-ins, dosage adjustments, and access to your care team."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Austin, TX",
      rating: 5,
      text: "I've lost 32 pounds in 3 months! The process was so simple and the support team is amazing. I finally feel like myself again.",
      weightLoss: "32 lbs",
      timeframe: "3 months"
    },
    {
      name: "Michael R.",
      location: "Phoenix, AZ",
      rating: 5,
      text: "After trying every diet out there, this finally worked. The medication helped control my appetite and the doctors are very thorough.",
      weightLoss: "45 lbs",
      timeframe: "4 months"
    },
    {
      name: "Jennifer K.",
      location: "Denver, CO",
      rating: 5,
      text: "The convenience of telehealth combined with effective medication changed my life. Down 28 pounds and counting!",
      weightLoss: "28 lbs",
      timeframe: "2.5 months"
    }
  ];

  const stats = [
    { value: "50,000+", label: "Happy Patients", icon: <Users className="w-6 h-6" /> },
    { value: "15%", label: "Avg. Weight Loss", icon: <Award className="w-6 h-6" /> },
    { value: "4.9/5", label: "Patient Rating", icon: <Star className="w-6 h-6 fill-current" /> },
    { value: "24hr", label: "Provider Review", icon: <Clock className="w-6 h-6" /> }
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
      answer: "The most common side effects are mild and temporary, including nausea, constipation, and decreased appetite. These typically improve as your body adjusts to the medication. Our providers will discuss all potential side effects during your consultation."
    },
    {
      question: "How much weight can I expect to lose?",
      answer: "Results vary by individual, but clinical studies show patients can lose 15-20% of their body weight. Our patients report an average of 15% body weight loss over 6-12 months when following their treatment plan."
    },
    {
      question: "Do I need insurance to use WellnessMeds?",
      answer: "No insurance is required. We offer transparent, affordable pricing with no hidden fees. Our medications are competitively priced, and payment plans may be available."
    },
    {
      question: "How long does shipping take?",
      answer: "Once approved, your medication is typically shipped within 1-2 business days. Most patients receive their order within 3-5 business days, with free expedited shipping included."
    }
  ];

  const trustBadges = [
    { icon: <ShieldCheck className="w-8 h-8" />, label: "HIPAA Compliant" },
    { icon: <BadgeCheck className="w-8 h-8" />, label: "Licensed Providers" },
    { icon: <Truck className="w-8 h-8" />, label: "Free Shipping" },
    { icon: <Award className="w-8 h-8" />, label: "FDA-Registered Labs" }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-white to-white dark:from-secondary/20 dark:via-background dark:to-background -z-10" />
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
                  <Star className="w-4 h-4 fill-primary" />
                  <span>Trusted by 50,000+ Patients</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 dark:text-foreground leading-[1.1] mb-6">
                  Weight Loss, <br/>
                  <span className="text-gradient">Simplified.</span>
                </h1>
                <p className="text-xl text-slate-600 dark:text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Get access to revolutionary GLP-1 medications like Semaglutide and Tirzepatide. 
                  No insurance needed. 100% online.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/get-started">
                    <Button className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all" data-testid="button-hero-start">
                      Start Your Journey
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/medications">
                    <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-50 dark:hover:bg-muted" data-testid="button-hero-medications">
                      View Medications
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 dark:text-muted-foreground font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" /> No Insurance Needed
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" /> FDA-Approved Labs
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" /> Licensed Providers
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="flex-1 relative w-full max-w-xl lg:max-w-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative z-10"
              >
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 aspect-[4/5] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Healthy lifestyle" 
                    className="w-full h-full object-cover"
                  />
                  
                  <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/95 dark:bg-card/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                        <Star className="w-6 h-6 text-green-600 fill-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-foreground text-lg">Clinically Proven</p>
                        <p className="text-slate-600 dark:text-muted-foreground">Average 15% body weight loss</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="py-8 bg-slate-50 dark:bg-muted/30 border-y border-slate-100 dark:border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustBadges.map((badge, idx) => (
              <div key={idx} className="flex items-center justify-center gap-3 text-slate-600 dark:text-muted-foreground">
                <div className="text-primary">{badge.icon}</div>
                <span className="font-semibold text-sm">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <motion.div key={idx} variants={item} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 text-primary mb-4">
                  {stat.icon}
                </div>
                <p className="text-4xl font-display font-bold text-slate-900 dark:text-foreground mb-1">{stat.value}</p>
                <p className="text-slate-600 dark:text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-24 bg-slate-50 dark:bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-slate-900 dark:text-foreground">How It Works</h2>
            <p className="text-xl text-slate-600 dark:text-muted-foreground">
              Get started in minutes. Our simple 4-step process makes getting treatment easy.
            </p>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={item} className="relative">
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-5xl font-display font-bold text-primary/20">{step.number}</span>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        {step.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-foreground">{step.title}</h3>
                    <p className="text-slate-600 dark:text-muted-foreground leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-primary/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-12">
            <Link href="/get-started">
              <Button size="lg" className="h-14 px-10 text-lg rounded-full" data-testid="button-how-it-works-start">
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Medications */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-16">
            <div>
              <h2 className="text-4xl font-display font-bold mb-4 text-slate-900 dark:text-foreground">Our Medications</h2>
              <p className="text-lg text-slate-600 dark:text-muted-foreground">Clinically proven GLP-1 treatments for lasting weight loss.</p>
            </div>
            <Link href="/medications" className="hidden md:flex items-center text-primary font-semibold hover:gap-2 transition-all">
              View All <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products ? products.slice(0, 2).map((product) => (
              <Link key={product.id} href={`/medications`}>
                <div className="group bg-white dark:bg-card rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 dark:border-border hover:border-primary/20 h-full cursor-pointer flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-muted">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-foreground">{product.name}</h3>
                    <p className="text-primary font-bold text-lg mb-4">{product.price}</p>
                    <p className="text-slate-600 dark:text-muted-foreground mb-6 line-clamp-2">{product.description}</p>
                    <ul className="space-y-2 mb-6">
                      {Array.isArray(product.benefits) && product.benefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-slate-700 dark:text-muted-foreground">
                          <Check className="w-4 h-4 text-green-500 shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <span className="text-primary font-semibold group-hover:underline">Learn more</span>
                  </div>
                </div>
              </Link>
            )) : (
              [1, 2].map((i) => (
                <div key={i} className="bg-white dark:bg-card rounded-3xl p-8 h-64 animate-pulse"></div>
              ))
            )}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/medications">
              <Button variant="outline" className="w-full">View All Medications</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 dark:bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-slate-900 dark:text-foreground">Real Results from Real Patients</h2>
            <p className="text-xl text-slate-600 dark:text-muted-foreground">
              See what our patients are saying about their weight loss journey with WellnessMeds.
            </p>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div key={idx} variants={item}>
                <Card className="h-full">
                  <CardContent className="pt-8 pb-6 px-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 dark:text-muted-foreground mb-6 leading-relaxed italic">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-border">
                      <div>
                        <p className="font-bold text-slate-900 dark:text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-slate-500 dark:text-muted-foreground">{testimonial.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">-{testimonial.weightLoss}</p>
                        <p className="text-sm text-slate-500 dark:text-muted-foreground">{testimonial.timeframe}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-6 text-slate-900 dark:text-foreground">Frequently Asked Questions</h2>
            <p className="text-xl text-slate-600 dark:text-muted-foreground">
              Get answers to common questions about our weight loss program.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-slate-200 dark:border-border">
                <AccordionTrigger className="text-left text-lg font-semibold text-slate-900 dark:text-foreground hover:text-primary py-6" data-testid={`faq-trigger-${idx}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-slate-600 dark:text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-12">
            <p className="text-slate-600 dark:text-muted-foreground mb-4">Still have questions?</p>
            <Link href="/about">
              <Button variant="outline" data-testid="button-faq-contact">Contact Our Team</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-display font-bold mb-8">Ready to Transform Your Life?</h2>
          <p className="text-xl text-primary-foreground/90 mb-8 leading-relaxed">
            Join over 50,000 patients who have successfully reached their weight loss goals with our medically supervised program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/get-started">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-8 h-auto rounded-full shadow-xl" data-testid="button-cta-start">
                Start Your Consultation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/80">
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> No commitment required</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Cancel anytime</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Free shipping</span>
          </div>
        </div>
      </section>
    </div>
  );
}
