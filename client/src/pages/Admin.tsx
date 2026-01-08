import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, Package, ArrowLeft, Mail, Phone, MessageSquare, Calendar, RefreshCw, FileText, ChevronDown, ChevronUp, User, MapPin, Target, Pill, Heart, Scale, Ruler, ClipboardList, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";
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

function InfoRow({ icon: Icon, label, value, testId }: { icon: typeof Mail; label: string; value: string | null | undefined; testId?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2 text-sm">
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
      <div>
        <span className="font-medium">{label}:</span>{" "}
        <span className="text-muted-foreground" data-testid={testId}>{value}</span>
      </div>
    </div>
  );
}

function ArrayBadges({ items, testIdPrefix }: { items: string[] | null | undefined; testIdPrefix: string }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, idx) => (
        <Badge 
          key={idx} 
          variant="secondary" 
          className="text-xs no-default-hover-elevate no-default-active-elevate"
          data-testid={`${testIdPrefix}-${idx}`}
        >
          {item}
        </Badge>
      ))}
    </div>
  );
}

function LeadCard({ lead, onStatusChange }: { lead: Lead; onStatusChange: (id: number, status: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const hasExtendedInfo = lead.goals || lead.state || lead.dateOfBirth || lead.weight || 
    lead.medicalConditions || lead.currentMedications || lead.allergies || 
    lead.hasPancreatitis || lead.previousGlp || lead.documentPaths;

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
              {lead.state && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-4 w-4" />
                  <span data-testid={`text-lead-state-${lead.id}`}>{lead.state}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge className={`${statusColors[lead.status]} no-default-hover-elevate no-default-active-elevate`} data-testid={`badge-lead-status-${lead.id}`}>
                {lead.status}
              </Badge>
              {lead.consentGiven && (
                <Badge 
                  variant="outline" 
                  className={`no-default-hover-elevate no-default-active-elevate ${
                    lead.consentGiven === "yes" 
                      ? "text-green-600 border-green-600" 
                      : "text-red-600 border-red-600"
                  }`}
                  data-testid={`badge-consent-${lead.id}`}
                >
                  {lead.consentGiven === "yes" ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Consent Given
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3 w-3 mr-1" />
                      No Consent
                    </>
                  )}
                </Badge>
              )}
            </div>
          </div>

          {lead.medicationInterest && (
            <div className="flex items-center gap-2 text-sm">
              <Pill className="h-4 w-4 text-primary" />
              <span className="font-medium">Interested in:</span>{" "}
              <span className="text-muted-foreground" data-testid={`text-lead-medication-${lead.id}`}>{lead.medicationInterest}</span>
            </div>
          )}

          {lead.goals && lead.goals.length > 0 && (
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Goals:</span>
              </div>
              <ArrayBadges items={lead.goals} testIdPrefix={`badge-goal-${lead.id}`} />
            </div>
          )}

          {lead.documentPaths && lead.documentPaths.length > 0 && (
            <div className="text-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-primary" />
                <span className="font-medium">Documents ({lead.documentPaths.length}):</span>
              </div>
              <div className="space-y-1 ml-6">
                {lead.documentPaths.map((path, idx) => {
                  const fileName = path.split('/').pop() || path;
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 text-xs bg-muted/50 p-2 rounded"
                      data-testid={`doc-${lead.id}-${idx}`}
                    >
                      <FileText className="h-3 w-3" />
                      <span className="truncate flex-1">{fileName}</span>
                      <a 
                        href={`/api/object-storage/download?path=${encodeURIComponent(path)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                        data-testid={`link-download-doc-${lead.id}-${idx}`}
                      >
                        <ExternalLink className="h-3 w-3" />
                        View
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {lead.message && (
            <div className="flex items-start gap-2 text-sm bg-muted/50 p-3 rounded-md">
              <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground" data-testid={`text-lead-message-${lead.id}`}>{lead.message}</p>
            </div>
          )}

          {hasExtendedInfo && (
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full" data-testid={`button-expand-${lead.id}`}>
                  {isOpen ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Hide Details
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      View Full Medical Intake
                    </>
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3 p-3 bg-muted/30 rounded-md">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Personal Information
                    </h4>
                    <InfoRow icon={Calendar} label="Date of Birth" value={lead.dateOfBirth} testId={`text-dob-${lead.id}`} />
                    <InfoRow icon={User} label="Sex" value={lead.sex} testId={`text-sex-${lead.id}`} />
                    {(lead.heightFeet || lead.heightInches) && (
                      <div className="flex items-start gap-2 text-sm">
                        <Ruler className="h-4 w-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
                        <div>
                          <span className="font-medium">Height:</span>{" "}
                          <span className="text-muted-foreground" data-testid={`text-height-${lead.id}`}>
                            {lead.heightFeet}'{lead.heightInches}"
                          </span>
                        </div>
                      </div>
                    )}
                    <InfoRow icon={Scale} label="Weight" value={lead.weight ? `${lead.weight} lbs` : null} testId={`text-weight-${lead.id}`} />
                    <InfoRow icon={User} label="Patient Type" value={lead.patientType} testId={`text-patient-type-${lead.id}`} />
                    <InfoRow icon={ClipboardList} label="Previous Treatments" value={lead.previousTreatments} testId={`text-prev-treatments-${lead.id}`} />
                  </div>

                  <div className="space-y-3 p-3 bg-muted/30 rounded-md">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Medical History
                    </h4>
                    {lead.medicalConditions && lead.medicalConditions.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Conditions:</span>
                        <div className="mt-1">
                          <ArrayBadges items={lead.medicalConditions} testIdPrefix={`badge-condition-${lead.id}`} />
                        </div>
                      </div>
                    )}
                    <InfoRow icon={Pill} label="Current Medications" value={lead.currentMedications} testId={`text-medications-${lead.id}`} />
                    <InfoRow icon={AlertCircle} label="Allergies" value={lead.allergies} testId={`text-allergies-${lead.id}`} />
                  </div>
                </div>

                <div className="p-3 bg-muted/30 rounded-md space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    GLP-1 Screening Questions
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    {lead.hasPancreatitis && (
                      <div data-testid={`text-pancreatitis-${lead.id}`}>
                        <span className="font-medium">Pancreatitis:</span>{" "}
                        <span className={lead.hasPancreatitis === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.hasPancreatitis}
                        </span>
                      </div>
                    )}
                    {lead.hasThyroidCancer && (
                      <div data-testid={`text-thyroid-${lead.id}`}>
                        <span className="font-medium">Thyroid Cancer:</span>{" "}
                        <span className={lead.hasThyroidCancer === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.hasThyroidCancer}
                        </span>
                      </div>
                    )}
                    {lead.hasKidneyIssues && (
                      <div data-testid={`text-kidney-${lead.id}`}>
                        <span className="font-medium">Kidney Issues:</span>{" "}
                        <span className={lead.hasKidneyIssues === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.hasKidneyIssues}
                        </span>
                      </div>
                    )}
                    {lead.hasDiabetes && (
                      <div data-testid={`text-diabetes-${lead.id}`}>
                        <span className="font-medium">Diabetes:</span>{" "}
                        <span className="text-muted-foreground">{lead.hasDiabetes}</span>
                      </div>
                    )}
                    {lead.isPregnant && (
                      <div data-testid={`text-pregnant-${lead.id}`}>
                        <span className="font-medium">Pregnant:</span>{" "}
                        <span className={lead.isPregnant === "yes" ? "text-red-600" : "text-muted-foreground"}>
                          {lead.isPregnant}
                        </span>
                      </div>
                    )}
                    {lead.previousGlp && (
                      <div data-testid={`text-prev-glp-${lead.id}`}>
                        <span className="font-medium">Previous GLP-1:</span>{" "}
                        <span className="text-muted-foreground">{lead.previousGlp}</span>
                      </div>
                    )}
                  </div>
                  {lead.glpDetails && (
                    <div className="text-sm mt-2">
                      <span className="font-medium">GLP-1 Details:</span>{" "}
                      <span className="text-muted-foreground" data-testid={`text-glp-details-${lead.id}`}>{lead.glpDetails}</span>
                    </div>
                  )}
                </div>

                {lead.solutionTypes && lead.solutionTypes.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Preferred Solution Types:</span>
                    <div className="mt-1">
                      <ArrayBadges items={lead.solutionTypes} testIdPrefix={`badge-solution-${lead.id}`} />
                    </div>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
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
