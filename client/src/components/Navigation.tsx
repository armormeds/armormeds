import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/medications", label: "Weight Loss" },
    { href: "/hair-loss", label: "Hair Loss" },
    { href: "/sexual-health", label: "Sexual Health" },
    { href: "/about", label: "About" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20 items-center">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer group">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">
              Armor<span className="text-primary">Meds</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location === link.href 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/order-status">
              <Button variant="ghost" className="rounded-full px-5 h-10 font-medium text-sm text-muted-foreground hover:text-foreground" data-testid="button-nav-order-status">
                Track Order
              </Button>
            </Link>
            <Link href="/get-started">
              <Button className="rounded-full px-6 h-10 font-medium shadow-none" data-testid="button-nav-start">
                Get Started
              </Button>
            </Link>
          </div>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-border/50 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {links.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    location === link.href 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 space-y-2">
                <Link href="/order-status" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full h-12 text-base font-medium" data-testid="button-mobile-order-status">
                    Track Order
                  </Button>
                </Link>
                <Link href="/get-started" onClick={() => setIsOpen(false)}>
                  <Button className="w-full rounded-full h-12 text-base font-medium" data-testid="button-mobile-start">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
