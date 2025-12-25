import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { type InsertLead } from "@shared/routes";
import { useCreateLead } from "@/hooks/use-leads";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function GetStarted() {
  const { mutate, isPending } = useCreateLead();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<InsertLead>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      medicationInterest: "",
      message: ""
    }
  });

  const onSubmit = (data: InsertLead) => {
    mutate(data, {
      onSuccess: () => setIsSuccess(true)
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-12 max-w-lg w-full text-center shadow-xl border border-gray-100"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4 text-slate-900">Request Received!</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Thank you for starting your journey with us. A care coordinator will review your information and contact you within 24 hours.
          </p>
          <Button 
            className="w-full h-12 rounded-xl"
            onClick={() => window.location.href = '/'}
          >
            Return Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left Side - Content */}
        <div className="flex-1 lg:pt-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
              Your Transformation <br/> Starts Here
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              Complete this short inquiry form to see if you qualify for our weight management program. 
              No payment is required today.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 mt-1">1</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Submit Inquiry</h3>
                  <p className="text-slate-600">Tell us about your goals and medical history.</p>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 ml-4"></div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm shrink-0 mt-1">2</div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-slate-400">Provider Review</h3>
                  <p className="text-slate-400">A licensed provider reviews your eligibility.</p>
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 ml-4"></div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-sm shrink-0 mt-1">3</div>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-slate-400">Medications Shipped</h3>
                  <p className="text-slate-400">If approved, medication is shipped to your door.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-100"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Jane Doe" className="h-12 rounded-xl bg-slate-50 border-gray-200 focus:bg-white transition-colors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" className="h-12 rounded-xl bg-slate-50 border-gray-200 focus:bg-white transition-colors" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Phone</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" className="h-12 rounded-xl bg-slate-50 border-gray-200 focus:bg-white transition-colors" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="medicationInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Interested In</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-gray-200 focus:bg-white transition-colors">
                            <SelectValue placeholder="Select medication" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="semaglutide">Semaglutide (Generic Ozempic)</SelectItem>
                          <SelectItem value="tirzepatide">Tirzepatide (Generic Mounjaro)</SelectItem>
                          <SelectItem value="unsure">Not sure / Advice needed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Additional Questions (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your goals..." 
                          className="min-h-[120px] rounded-xl bg-slate-50 border-gray-200 focus:bg-white transition-colors resize-none p-4" 
                          {...field} 
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 mt-4"
                >
                  {isPending ? "Submitting..." : (
                    <span className="flex items-center gap-2">
                      Check Eligibility <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
                
                <p className="text-xs text-center text-slate-400 mt-4">
                  By submitting this form, you agree to our Terms of Service and Privacy Policy. 
                  Your data is encrypted and secure.
                </p>
              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
