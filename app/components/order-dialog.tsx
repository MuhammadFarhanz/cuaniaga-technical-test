"use client";

import { useState } from "react";
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
import { Order, OrderItem, Product } from "@/types/order";
import { getCategoryColor } from "@/lib/utils";

interface OrderDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateOrder: (order: Order) => void;
  products: Product[];
}

export default function OrderDialog({
  open,
  products,
  onClose,
  onCreateOrder,
}: OrderDialogProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToOrder = (product: Product) => {
    const existingItem = selectedItems.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      );
    } else {
      setSelectedItems([...selectedItems, { product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedItems(
        selectedItems.filter((item) => item.product.id !== productId)
      );
    } else {
      setSelectedItems(
        selectedItems.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const removeItem = (productId: string) => {
    setSelectedItems(
      selectedItems.filter((item) => item.product.id !== productId)
    );
  };

  const total = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = () => {
    if (selectedItems.length > 0) {
      const order = {
        id: `ORD-${Date.now()}`,
        customer: { name: customerName, email: customerEmail },
        items: selectedItems,
        total,
        date: new Date().toISOString(),
        status: "Pending" as const,
        route: "",
      };

      onCreateOrder(order);

      setSelectedItems([]);
      setSearchTerm("");
      setCustomerName("");
      setCustomerEmail("");
      setSearchTerm("");
    }
  };

  const handleClose = () => {
    setSelectedItems([]);
    setSearchTerm("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className=" md:max-w-6xl overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-6">
          {/* Left side - Product selection */}
          <div className="flex-1 flex flex-col p-2">
            <div className="space-y-4">
              <div className="space-y-2 ">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input
                  id="customer-name"
                  value={customerName}
                  required
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  value={customerEmail}
                  required
                  onChange={(e) => setCustomerEmail(e.target.value)}
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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => addToOrder(product)}
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

          {/* Right side - Order summary */}
          <div className="w-80 flex flex-col">
            <h3 className="font-semibold mb-4">Order Summary</h3>

            <div className="flex-1 overflow-y-auto">
              {selectedItems.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No items in order
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item) => (
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
                                updateQuantity(
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
                                updateQuantity(
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

            {selectedItems.length > 0 && (
              <div className="mt-4 space-y-2">
                <Separator />
                {/* <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div> */}
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={
                  selectedItems.length === 0 || !customerName || !customerEmail
                }
              >
                Create Order
              </Button>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={handleClose}
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
