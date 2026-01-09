import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check, Star, ShieldCheck, Truck, Clock, Users, Award, BadgeCheck, Stethoscope, Package, HeartPulse, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";

import heroImage from "@assets/stock_images/healthy_woman_wellne_643b05e6.jpg";
import lifestyleImage1 from "@assets/stock_images/healthy_woman_wellne_ced61cb2.jpg";
import lifestyleImage2 from "@assets/stock_images/healthy_woman_wellne_55c1efc6.jpg";
import medicationImage1 from "@assets/stock_images/medical_weight_loss__b996e716.jpg";
import medicationImage2 from "@assets/stock_images/medical_weight_loss__0a6aa8a8.jpg";
import healthyEating1 from "@assets/stock_images/happy_person_healthy_e1d4efb8.jpg";
import healthyEating2 from "@assets/stock_images/happy_person_healthy_d1777f1e.jpg";

export default function Home() {
  const { data: products } = useProducts();

  const steps = [
    {
      number: "1",
      icon: <Clock className="w-5 h-5" />,
      title: "Complete Assessment",
      description: "Answer a few questions about your health goals",
      duration: "5 min"
    },
    {
      number: "2",
      icon: <Stethoscope className="w-5 h-5" />,
      title: "Provider Review",
      description: "Licensed physician reviews your information",
      duration: "24 hrs"
    },
    {
      number: "3",
      icon: <Package className="w-5 h-5" />,
      title: "Get Medication",
      description: "Prescription shipped to your door",
      duration: "2-3 days"
    },
    {
      number: "4",
      icon: <HeartPulse className="w-5 h-5" />,
      title: "Ongoing Care",
      description: "Continuous support from your care team",
      duration: "Always"
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      location: "Austin, TX",
      image: healthyEating1,
      rating: 5,
      text: "I've lost 32 pounds in 3 months! The process was so simple and the support team is amazing.",
      weightLoss: "32 lbs",
      verified: true
    },
    {
      name: "Michael R.",
      location: "Phoenix, AZ",
      image: lifestyleImage1,
      rating: 5,
      text: "After trying every diet out there, this finally worked. Down 45 pounds and feeling great!",
      weightLoss: "45 lbs",
      verified: true
    },
    {
      name: "Jennifer K.",
      location: "Denver, CO",
      image: healthyEating2,
      rating: 5,
      text: "The convenience of telehealth combined with effective medication changed my life.",
      weightLoss: "28 lbs",
      verified: true
    }
  ];

  const faqs = [
    {
      question: "How do GLP-1 medications work?",
      answer: "GLP-1 medications mimic a natural hormone that regulates appetite and blood sugar. They help you feel full longer and reduce cravings, leading to sustainable weight loss."
    },
    {
      question: "Am I a good candidate?",
      answer: "Generally, candidates have a BMI of 27+ with weight-related conditions, or BMI of 30+. Our providers review your complete health history to determine eligibility."
    },
    {
      question: "What results can I expect?",
      answer: "Clinical studies show 15-20% body weight loss. Our patients average 15% loss over 6-12 months when following their treatment plan."
    },
    {
      question: "Do I need insurance?",
      answer: "No insurance required. We offer transparent, affordable pricing with no hidden fees and payment plans available."
    },
    {
      question: "How fast is shipping?",
      answer: "Once approved, medication ships within 1-2 business days. Most patients receive their order within 3-5 days with free shipping."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img 
            src={heroImage} 
            alt="Healthy lifestyle" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent lg:from-background lg:via-background/60 lg:to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="lg:w-1/2 lg:pr-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium mb-6">
                <BadgeCheck className="w-4 h-4" />
                <span>FDA-Approved Medications</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-6">
                Lose Weight With
                <span className="block text-primary">Medical Support</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Access GLP-1 medications like Semaglutide and Tirzepatide from licensed providers. 
                No insurance needed, delivered to your door.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link href="/get-started">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base" data-testid="button-hero-start">
                    Start Free Assessment
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/medications">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base" data-testid="button-hero-medications">
                    View Medications
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">50K+</p>
                  <p className="text-sm text-muted-foreground">Patients Treated</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">15%</p>
                  <p className="text-sm text-muted-foreground">Avg Weight Loss</p>
                </div>
                <div>
                  <p className="text-3xl font-display font-bold text-foreground">4.9</p>
                  <p className="text-sm text-muted-foreground">Patient Rating</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-6 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="font-medium">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5 text-primary" />
              <span className="font-medium">Licensed Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-primary" />
              <span className="font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <span className="font-medium">FDA-Registered Labs</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline Style */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple 4-step process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-primary" style={{ opacity: 0.2 + (idx * 0.2) }} />
                  <CardContent className="pt-6 pb-5 px-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {step.number}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          {step.icon}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                        {step.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/get-started">
              <Button size="lg" data-testid="button-steps-start">
                Begin Your Journey
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Medications Section - Card Grid */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-2">Our Medications</h2>
              <p className="text-muted-foreground">FDA-approved GLP-1 treatments for lasting results</p>
            </div>
            <Link href="/medications">
              <Button variant="ghost" className="text-primary" data-testid="link-view-all-meds">
                View All
                <ChevronRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {products ? products.slice(0, 2).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href="/medications">
                  <Card className="group cursor-pointer hover:shadow-lg transition-all h-full overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 aspect-square md:aspect-auto relative bg-gradient-to-br from-primary/5 to-primary/10">
                        <img 
                          src={idx === 0 ? medicationImage1 : medicationImage2} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {product.name}
                          </h3>
                          <span className="text-lg font-bold text-primary">{product.price}</span>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                        <ul className="space-y-2">
                          {Array.isArray(product.benefits) && product.benefits.slice(0, 3).map((benefit, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-4 pt-4 border-t border-border">
                          <span className="text-primary text-sm font-medium group-hover:underline">
                            Learn more
                            <ArrowRight className="inline ml-1 w-3 h-3" />
                          </span>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            )) : (
              [1, 2].map((i) => (
                <Card key={i} className="h-64 animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Results Section - Image + Content */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-2 lg:order-1"
            >
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-6">
                Real Results,<br />Real Transformations
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Our patients see significant, lasting weight loss with the support of licensed providers and proven medications. Join thousands who have transformed their health.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-muted/50 rounded-xl p-5">
                  <p className="text-3xl font-display font-bold text-primary mb-1">15-20%</p>
                  <p className="text-sm text-muted-foreground">Average body weight loss</p>
                </div>
                <div className="bg-muted/50 rounded-xl p-5">
                  <p className="text-3xl font-display font-bold text-primary mb-1">93%</p>
                  <p className="text-sm text-muted-foreground">Patient satisfaction rate</p>
                </div>
              </div>

              <Link href="/get-started">
                <Button size="lg" data-testid="button-results-start">
                  Start Your Transformation
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={lifestyleImage2} 
                    alt="Healthy lifestyle transformation" 
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-card rounded-xl shadow-lg p-4 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">Clinically Proven</p>
                      <p className="text-sm text-muted-foreground">FDA-approved treatments</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials - Horizontal Cards */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">What Our Patients Say</h2>
            <p className="text-lg text-muted-foreground">Real stories from real people</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {testimonials.map((testimonial, idx) => (
              <motion.div key={idx} variants={item}>
                <Card className="h-full overflow-hidden">
                  <div className="aspect-[16/9] relative">
                    <img 
                      src={testimonial.image} 
                      alt={`${testimonial.name}'s wellness journey`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      {testimonial.verified && (
                        <span className="text-xs text-green-400 font-medium flex items-center gap-1 bg-black/30 px-2 py-1 rounded-full">
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm">"{testimonial.text}"</p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={testimonial.image} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                        </div>
                      </div>
                      <div className="bg-primary/10 text-primary font-bold px-3 py-1.5 rounded-full text-sm">
                        -{testimonial.weightLoss}
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
      <section className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">Common Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our program</p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {faqs.map((faq, idx) => (
              <AccordionItem 
                key={idx} 
                value={`item-${idx}`} 
                className="bg-card border border-border rounded-lg px-6 data-[state=open]:shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary py-5" data-testid={`faq-trigger-${idx}`}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10">
            <p className="text-muted-foreground mb-4">Have more questions?</p>
            <Link href="/about">
              <Button variant="outline" data-testid="button-faq-contact">Contact Support</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground mb-6">
              Ready to Start Your Weight Loss Journey?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join over 50,000 patients who have achieved their health goals with our medically supervised program.
            </p>
            
            <Link href="/get-started">
              <Button 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 h-14 px-10 text-lg"
                data-testid="button-final-cta"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-primary-foreground/70">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Free consultation
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> No insurance required
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4" /> Cancel anytime
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
