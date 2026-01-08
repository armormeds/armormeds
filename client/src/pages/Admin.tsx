import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Users, Package, ArrowLeft, Mail, Phone, MessageSquare, Calendar, RefreshCw } from "lucide-react";
import { Link } from "wouter";
import type { Lead, Product } from "@shared/schema";
import { buildUrl } from "@shared/routes";
import { format } from "date-fns";
import { useState } from "react";

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  archived: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
};

function LeadCard({ lead, onStatusChange }: { lead: Lead; onStatusChange: (id: number, status: string) => void }) {
  return (
    <Card data-testid={`card-lead-${lead.id}`}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-lg" data-testid={`text-lead-name-${lead.id}`}>{lead.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Mail className="h-4 w-4" />
                <span data-testid={`text-lead-email-${lead.id}`}>{lead.email}</span>
              </div>
              {lead.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Phone className="h-4 w-4" />
                  <span data-testid={`text-lead-phone-${lead.id}`}>{lead.phone}</span>
                </div>
              )}
            </div>
            <Badge className={`${statusColors[lead.status]} no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-lead-status-${lead.id}`}>
              {lead.status}
            </Badge>
          </div>

          {lead.medicationInterest && (
            <div className="text-sm">
              <span className="font-medium">Interested in:</span>{" "}
              <span className="text-muted-foreground" data-testid={`text-lead-medication-${lead.id}`}>{lead.medicationInterest}</span>
            </div>
          )}

          {lead.message && (
            <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded-md">
              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground" data-testid={`text-lead-message-${lead.id}`}>{lead.message}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 pt-2 border-t flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span data-testid={`text-lead-date-${lead.id}`}>{format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
            </div>
            <Select
              value={lead.status}
              onValueChange={(value) => onStatusChange(lead.id, value)}
            >
              <SelectTrigger className="w-[140px]" data-testid={`select-lead-status-${lead.id}`}>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"leads" | "products">("leads");

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const url = buildUrl("/api/leads/:id", { id });
      return apiRequest("PATCH", url, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Status updated",
        description: "Lead status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update lead status.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateLeadMutation.mutate({ id, status });
  };

  const newLeadsCount = leads?.filter((l) => l.status === "new").length ?? 0;

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" data-testid="button-back-home">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage leads and products</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => refetchLeads()} data-testid="button-refresh-leads">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === "leads" ? "default" : "outline"}
            onClick={() => setActiveTab("leads")}
            data-testid="button-tab-leads"
          >
            <Users className="h-4 w-4 mr-2" />
            Leads
            {newLeadsCount > 0 && (
              <Badge variant="secondary" className="ml-2">{newLeadsCount}</Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "products" ? "default" : "outline"}
            onClick={() => setActiveTab("products")}
            data-testid="button-tab-products"
          >
            <Package className="h-4 w-4 mr-2" />
            Products
          </Button>
        </div>

        {activeTab === "leads" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Customer Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leadsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-32 w-full" />
                    ))}
                  </div>
                ) : leads && leads.length > 0 ? (
                  <div className="grid gap-4">
                    {leads
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((lead) => (
                        <LeadCard
                          key={lead.id}
                          lead={lead}
                          onStatusChange={handleStatusChange}
                        />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No leads yet. When customers submit inquiries, they will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : products && products.length > 0 ? (
                  <div className="grid gap-4">
                    {products.map((product) => (
                      <Card key={product.id} data-testid={`card-product-${product.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                              <p className="text-sm font-medium text-primary mt-1" data-testid={`text-product-price-${product.id}`}>{product.price}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No products found.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
