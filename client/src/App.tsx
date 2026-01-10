import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "wouter";

import Home from "@/pages/Home";
import Medications from "@/pages/Medications";
import HairLoss from "@/pages/HairLoss";
import SexualHealth from "@/pages/SexualHealth";
import GetStarted from "@/pages/GetStarted";
import About from "@/pages/About";
import Admin from "@/pages/Admin";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import RefundPolicy from "@/pages/RefundPolicy";
import Providers from "@/pages/Providers";
import CheckoutSuccess from "@/pages/CheckoutSuccess";
import CheckoutCancel from "@/pages/CheckoutCancel";
import MyAppointments from "@/pages/MyAppointments";
import NotFound from "@/pages/not-found";

// Helper to scroll to top on route change
function ScrollToTopWrapper() {
  const [pathname] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTopWrapper />
      <Navigation />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/medications" component={Medications} />
          <Route path="/hair-loss" component={HairLoss} />
          <Route path="/sexual-health" component={SexualHealth} />
          <Route path="/get-started" component={GetStarted} />
          <Route path="/about" component={About} />
          <Route path="/admin" component={Admin} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/refund-policy" component={RefundPolicy} />
          <Route path="/providers" component={Providers} />
          <Route path="/checkout/success" component={CheckoutSuccess} />
          <Route path="/checkout/cancel" component={CheckoutCancel} />
          <Route path="/my-appointments" component={MyAppointments} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
