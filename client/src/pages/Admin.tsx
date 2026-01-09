import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, Package, ArrowLeft, Mail, Phone, MessageSquare, Calendar, RefreshCw, FileText, ChevronDown, ChevronUp, User, MapPin, Target, Pill, Heart, Scale, Ruler, ClipboardList, CheckCircle, AlertCircle, ExternalLink, Plus, Pencil, Trash2, X } from "lucide-react";
import { Link } from "wouter";
import type { Lead, Product } from "@shared/schema";
import { buildUrl } from "@shared/routes";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";

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

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  image: string;
  benefits: string;
}

function ProductForm({ 
  product, 
  onSubmit, 
  onCancel,
  isSubmitting 
}: { 
  product?: Product; 
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      benefits: Array.isArray(product.benefits) ? product.benefits.join('\n') : '',
    } : {
      name: '',
      description: '',
      price: '',
      image: '',
      benefits: '',
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product Name</Label>
        <Input 
          id="name" 
          {...register("name", { required: "Name is required" })} 
          placeholder="e.g., Semaglutide"
          data-testid="input-product-name"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          {...register("description", { required: "Description is required" })} 
          placeholder="Describe the medication..."
          rows={3}
          data-testid="input-product-description"
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input 
          id="price" 
          {...register("price", { required: "Price is required" })} 
          placeholder="e.g., Starts at $299/mo"
          data-testid="input-product-price"
        />
        {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Image URL</Label>
        <Input 
          id="image" 
          {...register("image", { required: "Image URL is required" })} 
          placeholder="https://..."
          data-testid="input-product-image"
        />
        {errors.image && <p className="text-sm text-destructive">{errors.image.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="benefits">Benefits (one per line)</Label>
        <Textarea 
          id="benefits" 
          {...register("benefits", { required: "At least one benefit is required" })} 
          placeholder="Reduces appetite&#10;Supports weight loss&#10;Weekly injection"
          rows={4}
          data-testid="input-product-benefits"
        />
        {errors.benefits && <p className="text-sm text-destructive">{errors.benefits.message}</p>}
      </div>

      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-product">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} data-testid="button-save-product">
          {isSubmitting ? "Saving..." : (product ? "Update Product" : "Add Product")}
        </Button>
      </DialogFooter>
    </form>
  );
}

function ProductCard({ 
  product, 
  onEdit, 
  onDelete 
}: { 
  product: Product; 
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <Card data-testid={`card-product-${product.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                <p className="text-primary font-medium" data-testid={`text-product-price-${product.id}`}>{product.price}</p>
              </div>
              <div className="flex gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(product)}
                  data-testid={`button-edit-product-${product.id}`}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      data-testid={`button-delete-product-${product.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Product</DialogTitle>
                    </DialogHeader>
                    <p className="text-muted-foreground">
                      Are you sure you want to delete "{product.name}"? This action cannot be undone.
                    </p>
                    <DialogFooter className="gap-2">
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button 
                        variant="destructive" 
                        onClick={() => {
                          onDelete(product.id);
                          setShowDeleteConfirm(false);
                        }}
                        data-testid={`button-confirm-delete-${product.id}`}
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{product.description}</p>
            {Array.isArray(product.benefits) && product.benefits.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {product.benefits.slice(0, 3).map((benefit, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs no-default-hover-elevate no-default-active-elevate">
                    {benefit}
                  </Badge>
                ))}
                {product.benefits.length > 3 && (
                  <Badge variant="outline" className="text-xs no-default-hover-elevate no-default-active-elevate">
                    +{product.benefits.length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"leads" | "products">("leads");
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: leads, isLoading: leadsLoading, refetch: refetchLeads } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: products, isLoading: productsLoading, refetch: refetchProducts } = useQuery<Product[]>({
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

  const createProductMutation = useMutation({
    mutationFn: async (data: { name: string; description: string; price: string; image: string; benefits: string[] }) => {
      return apiRequest("POST", "/api/products", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductDialog(false);
      toast({
        title: "Product created",
        description: "New product has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: number; name: string; description: string; price: string; image: string; benefits: string[] }) => {
      const url = buildUrl("/api/products/:id", { id });
      return apiRequest("PATCH", url, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setShowProductDialog(false);
      setEditingProduct(null);
      toast({
        title: "Product updated",
        description: "Product has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl("/api/products/:id", { id });
      return apiRequest("DELETE", url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "Product has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (id: number, status: string) => {
    updateLeadMutation.mutate({ id, status });
  };

  const handleProductSubmit = (data: ProductFormData) => {
    const benefits = data.benefits.split('\n').map(b => b.trim()).filter(b => b.length > 0);
    const productData = {
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      benefits,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, ...productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductDialog(true);
  };

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  const handleCloseDialog = () => {
    setShowProductDialog(false);
    setEditingProduct(null);
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
          <Button variant="outline" onClick={() => activeTab === "leads" ? refetchLeads() : refetchProducts()} data-testid="button-refresh">
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
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Products
                  </CardTitle>
                  <Dialog open={showProductDialog} onOpenChange={(open) => {
                    if (!open) handleCloseDialog();
                    else setShowProductDialog(true);
                  }}>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-product">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                      </DialogHeader>
                      <ProductForm 
                        product={editingProduct || undefined}
                        onSubmit={handleProductSubmit}
                        onCancel={handleCloseDialog}
                        isSubmitting={createProductMutation.isPending || updateProductMutation.isPending}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
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
                      <ProductCard 
                        key={product.id} 
                        product={product}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No products found. Click "Add Product" to create one.</p>
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
