"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Search, Plus, Minus, Trash2 } from "lucide-react";
import { getCategoryColor } from "@/lib/utils";
import { useOrderStore } from "@/lib/stores/orderStore";
import { useOrderForm } from "@/lib/hooks/useOrderForm";

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function OrderDialog({
  open,

  onClose,
}: OrderDialogProps) {
  const { products, addOrder } = useOrderStore();
  const form = useOrderForm();

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(form.searchTerm.toLowerCase())
      ),
    [products, form.searchTerm]
  );
  const removeItem = (productId: string) => {
    form.setSelectedItems(
      form.selectedItems.filter((item) => item.product.id !== productId)
    );
  };

  const handleSubmit = () => {
    if (!form.isValid) return;

    addOrder({
      id: `ORD-${Date.now()}`,
      customer: {
        name: form.customerName.trim(),
        email: form.customerEmail.trim(),
      },
      items: form.selectedItems,
      total: form.total,
      date: new Date().toISOString(),
      status: "Pending",
    });

    form.resetForm();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className=" md:max-w-6xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6">
          <div className="flex-1 flex flex-col p-2">
            <div className="space-y-4">
              <div className="space-y-2 ">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  value={form.customerName}
                  required
                  onChange={(e) => form.setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={form.customerEmail}
                  required
                  onChange={(e) => form.setCustomerEmail(e.target.value)}
                  placeholder="Enter customer email"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex-1 flex flex-col">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={form.searchTerm}
                  onChange={(e) => form.setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => form.addToOrder(product)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge
                                className={getCategoryColor(product.category)}
                              >
                                {product.category}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                Stock: {product.stock}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              ${product.price.toFixed(2)}
                            </div>
                            <Button size="sm" className="mt-1">
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-80 flex flex-col">
            <h3 className="font-semibold mb-4">Order Summary</h3>

            <div className="flex-1 overflow-y-auto">
              {form.selectedItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No items in order
                </div>
              ) : (
                <div className="space-y-3">
                  {form.selectedItems.map((item) => (
                    <Card key={item.product.id}>
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              ${item.product.price.toFixed(2)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.product.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                form.updateQuantity(
                                  item.product.id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                form.updateQuantity(
                                  item.product.id,
                                  item.quantity + 1
                                )
                              }
                              disabled={item.quantity >= item.product.stock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {form.selectedItems.length > 0 && (
              <div className="mt-4 space-y-2">
                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${form.total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={
                  form.selectedItems.length === 0 ||
                  !form.customerName ||
                  !form.customerEmail
                }
              >
                Create Order
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
