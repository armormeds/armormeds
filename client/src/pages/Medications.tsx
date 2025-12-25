import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Check, Info, Shield } from "lucide-react";

export default function Medications() {
  const { data: products, isLoading } = useProducts();

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-display font-bold text-slate-900 mb-6">Our Treatments</h1>
          <p className="text-xl text-slate-600">
            We offer FDA-approved GLP-1 medications that help regulate appetite and blood sugar levels.
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-16 flex items-start gap-4 max-w-4xl mx-auto">
          <Info className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Prescription Required</h3>
            <p className="text-blue-800/80">
              These medications require a prescription. Our licensed providers will evaluate your medical history 
              to determine the best treatment plan for you.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {isLoading ? (
            // Skeleton Loading
            [1, 2].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-[600px] animate-pulse shadow-sm"></div>
            ))
          ) : (
            products?.map((product) => (
              <div key={product.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full font-bold text-slate-900 shadow-sm">
                    {product.price}
                  </div>
                </div>
                
                <div className="p-8 md:p-10 flex flex-col flex-1">
                  <div className="mb-6">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">{product.name}</h2>
                    <p className="text-lg text-slate-600 leading-relaxed">{product.description}</p>
                  </div>
                  
                  <div className="space-y-4 mb-10 flex-1">
                    <h4 className="font-semibold text-slate-900">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {Array.isArray(product.benefits) && product.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <div className="mt-1 bg-green-100 p-1 rounded-full">
                            <Check className="w-3 h-3 text-green-600" />
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
                    <p className="text-center text-sm text-slate-400 mt-4 flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" /> 100% Online Process
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
