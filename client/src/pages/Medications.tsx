import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Info, Shield, BadgeCheck, CreditCard, RefreshCcw, Headphones } from "lucide-react";
import { SafetyDisclosure } from "@/components/SafetyDisclosure";

const FIRST_MONTH_PRICES: Record<string, { sale: string; original: string; save: string }> = {
  "Semaglutide": { sale: "$149", original: "$299", save: "Save $150" },
  "Tirzepatide": { sale: "$199", original: "$399", save: "Save $200" },
};

const INCLUDED_ITEMS = [
  "Board-certified physician consultation",
  "Unlimited 1:1 provider support",
  "Written prescription",
  "4 weeks of medication",
  "Free discreet shipping",
];

export default function Medications() {
  const { data: allProducts, isLoading } = useProducts();
  const products = allProducts?.filter(p => p.category === "weight-loss");

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-5xl font-display font-bold text-slate-900 mb-6">Our Treatments</h1>
          <p className="text-xl text-slate-600">
            Precision-compounded GLP-1 medications, formulated and tailored for every individual to support healthy appetite regulation and lasting weight loss.
          </p>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600 mb-10">
          <span className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-green-600" /> Licensed providers</span>
          <span className="flex items-center gap-2"><CreditCard className="w-4 h-4 text-blue-600" /> HSA / FSA accepted</span>
          <span className="flex items-center gap-2"><RefreshCcw className="w-4 h-4 text-primary" /> No contracts, cancel anytime</span>
          <span className="flex items-center gap-2"><Headphones className="w-4 h-4 text-amber-600" /> 24/7 unlimited support</span>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-16 flex items-start gap-4 max-w-4xl mx-auto">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Prescription Required</h3>
            <p className="text-blue-800/80">
              These medications require a prescription. Our licensed providers will evaluate your medical history 
              to determine the best treatment plan for you. Most prescriptions are reviewed within 24 hours.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {isLoading ? (
            [1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-[700px] animate-pulse shadow-sm"></div>
            ))
          ) : (
            products?.map((product, idx) => {
              const promo = FIRST_MONTH_PRICES[product.name];
              const isPopular = idx === 0;
              return (
                <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative">
                  {isPopular && (
                    <div className="absolute top-5 left-5 z-10 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden group">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {promo && (
                      <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl shadow-md text-right">
                        <p className="text-xs text-slate-400 line-through">{promo.original}/mo</p>
                        <p className="text-lg font-bold text-primary leading-tight">{promo.sale} first month</p>
                        <p className="text-xs text-green-600 font-semibold">{promo.save} instantly</p>
                      </div>
                    )}
                    {!promo && (
                      <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-slate-900 shadow-sm">
                        {product.price}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-8 md:p-10 flex flex-col flex-1">
                    <div className="mb-4">
                      <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{product.name}</h2>
                      {promo ? (
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-2xl font-bold text-primary">{promo.sale}<span className="text-base font-normal text-slate-500"> first month</span></span>
                          <span className="text-sm text-slate-400 line-through">{promo.original}/mo</span>
                        </div>
                      ) : (
                        <p className="text-xl font-semibold text-primary mb-1">{product.price}</p>
                      )}
                      <p className="text-base text-slate-600 leading-relaxed mt-2">{product.description}</p>
                    </div>

                    {/* What's Included */}
                    <div className="bg-slate-50 rounded-xl p-5 mb-6">
                      <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">What's Included</h4>
                      <ul className="space-y-2">
                        {INCLUDED_ITEMS.map((item, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                            <div className="bg-green-100 p-0.5 rounded-full flex-shrink-0">
                              <Check className="w-3 h-3 text-green-600" />
                            </div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3 mb-8 flex-1">
                      <h4 className="font-semibold text-slate-900">Key Benefits:</h4>
                      <ul className="grid grid-cols-1 gap-2">
                        {Array.isArray(product.benefits) && product.benefits.map((benefit, i) => (
                          <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                            <div className="mt-0.5 bg-blue-100 p-1 rounded-full flex-shrink-0">
                              <Check className="w-3 h-3 text-blue-600" />
                            </div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-6 border-t border-gray-100">
                      <Link href="/get-started">
                        <Button className="w-full h-14 text-lg rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
                          Get Started with {product.name}
                        </Button>
                      </Link>
                      <p className="text-center text-xs text-slate-400 mt-3">
                        No contracts · Cancel anytime · Free shipping
                      </p>
                      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 100% Online</span>
                        <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> HSA/FSA OK</span>
                        <span className="flex items-center gap-1"><BadgeCheck className="w-3 h-3 text-green-600" /> Licensed Providers</span>
                      </div>
                      <SafetyDisclosure productName={product.name} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Promise / Guarantee */}
        <div className="mt-20 max-w-3xl mx-auto text-center bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-3xl p-10">
          <div className="text-4xl mb-4">🛡️</div>
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-3">Our Promise</h3>
          <p className="text-slate-600 leading-relaxed mb-6">
            We stand behind our treatments. If you follow your plan and aren't satisfied with your progress, 
            our care team will work with you — adjusting your dosage, your plan, or your support — at no extra cost.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-700">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> No long-term contracts</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> Cancel without calling anyone</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-600" /> Unlimited provider access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
