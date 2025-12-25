import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Star, ShieldCheck, Truck, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useProducts } from "@/hooks/use-products";

export default function Home() {
  const { data: products } = useProducts();

  const features = [
    {
      icon: <Clock className="w-8 h-8 text-primary" />,
      title: "Quick Online Form",
      description: "Fill out a simple medical questionnaire in minutes from your phone or computer."
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Licensed Providers",
      description: "A US-licensed medical provider will review your history and prescribe if appropriate."
    },
    {
      icon: <Truck className="w-8 h-8 text-primary" />,
      title: "Free Shipping",
      description: "Your medication is shipped discreetly to your door with all necessary supplies."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-white to-white -z-10" />
        {/* Background decorative blob */}
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
                  <span>Rated #1 for Telehealth Care</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6">
                  Weight Loss, <br/>
                  <span className="text-gradient">Simplified.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Get access to revolutionary GLP-1 medications like Semaglutide and Tirzepatide. 
                  No insurance needed. 100% online.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/get-started">
                    <Button className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all">
                      Start Your Journey
                    </Button>
                  </Link>
                  <Link href="/medications">
                    <Button variant="outline" className="h-14 px-8 text-lg rounded-full border-2 hover:bg-slate-50">
                      View Medications
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-sm text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" /> No Insurance Needed
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" /> FDA-Approved Labs
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
                {/* Image placeholder with medical/wellness theme */}
                {/* healthy lifestyle woman jogging outdoor */}
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 aspect-[4/5] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                  <img 
                    src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop" 
                    alt="Healthy lifestyle" 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Floating badge */}
                  <div className="absolute bottom-8 left-8 right-8 z-20 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <Star className="w-6 h-6 text-green-600 fill-green-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-lg">Results Driven</p>
                        <p className="text-slate-600">Average 15% body weight loss</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-display font-bold mb-6">How It Works</h2>
            <p className="text-xl text-slate-600">
              We've streamlined the process to get you the care you need without the hassle of traditional doctor visits.
            </p>
          </div>
          
          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={item} className="text-center relative group">
                <div className="w-20 h-20 mx-auto bg-secondary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Medications */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl font-display font-bold mb-4">Our Medications</h2>
              <p className="text-lg text-slate-600">Clinically proven treatments for weight management.</p>
            </div>
            <Link href="/medications" className="hidden md:flex items-center text-primary font-semibold hover:gap-2 transition-all">
              View All <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products ? products.slice(0, 2).map((product) => (
              <Link key={product.id} href={`/medications`}>
                <div className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-primary/20 h-full cursor-pointer flex flex-col md:flex-row gap-8 items-center">
                  <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-100">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                    <p className="text-primary font-bold text-lg mb-4">{product.price}</p>
                    <p className="text-slate-600 mb-6 line-clamp-2">{product.description}</p>
                    <ul className="space-y-2 mb-6">
                      {/* Show first 2 benefits */}
                      {Array.isArray(product.benefits) && product.benefits.slice(0, 2).map((benefit, i) => (
                        <li key={i} className="flex items-center justify-center md:justify-start gap-2 text-sm font-medium text-slate-700">
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
              // Loading state skeletons
              [1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl p-8 h-64 animate-pulse"></div>
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

      {/* FAQ / Trust Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-display font-bold mb-8">Ready to transform your life?</h2>
          <p className="text-xl text-primary-foreground/90 mb-12 leading-relaxed">
            Join thousands of others who have successfully reached their weight loss goals with our medically supervised program.
          </p>
          <Link href="/get-started">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-8 h-auto rounded-full shadow-xl">
              Start Your Consultation
            </Button>
          </Link>
          <p className="mt-6 text-sm text-primary-foreground/70">
            No commitment required. Cancel anytime.
          </p>
        </div>
      </section>
    </div>
  );
}
