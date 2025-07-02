"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, MapPin, Calendar, Package2, Edit } from "lucide-react";
import Image from "next/image";
import { Order } from "@/types/order";
import { getCategoryColor, getStatusColor, getStatusIcon } from "@/lib/utils";

interface OrderDetailsDialogProps {
  order: Order | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate: (orderId: string, newStatus: string) => void;
}

export default function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
  onStatusUpdate,
}: OrderDetailsDialogProps) {
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  console.log(order, "nganu");
  if (!order) return null;

  const handleStatusUpdate = () => {
    if (newStatus && newStatus !== order.status) {
      onStatusUpdate(order.id, newStatus);
      setIsEditingStatus(false);
      setNewStatus("");
    }
  };

  const canUpdateStatus = (currentStatus: string) => {
    return !["Delivered", "Cancelled"].includes(currentStatus);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-6xl max-h-[90vh] overflow-hidden ">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details - {order.id}</span>
            <div className="flex items-center gap-2">
              {!isEditingStatus ? (
                <>
                  <Badge
                    className={`${getStatusColor(
                      order.status
                    )} flex items-center gap-1`}
                  >
                    {getStatusIcon(order.status)}
                    {order.status}
                  </Badge>
                  {canUpdateStatus(order.status) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditingStatus(true);
                        setNewStatus(order.status);
                      }}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Update Status
                    </Button>
                  )}
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" onClick={handleStatusUpdate}>
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditingStatus(false);
                      setNewStatus("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Column - Customer & Shipping Info */}
            <div className="space-y-4 h-full">
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="font-medium">{order.customer.name}</p>
                    <p className="text-sm text-gray-600">
                      {order?.customer.email || "email@gmai.com"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {/* {order.customerPhone} */}
                      +1 (555) 123-4567
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5" />
                    Shipping Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Shipping Address:</p>
                    <p className="text-sm text-gray-600">
                      {order.route}123 Football Street, Madrid, Spain 28001
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Route:</p>
                    <p className="text-sm text-gray-600">
                      {order.route}Indonesia - Singapore
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Tracking Number:</p>
                    <p className="text-sm text-blue-600 font-mono">
                      TRK-789456123
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Estimated Delivery:</p>
                    <p className="text-sm text-gray-600">2025-02-16</p>
                  </div>
                </CardContent>
              </Card>

              <Card className=" rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5" />
                    Order Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Order Date:</p>
                    <p className="text-sm text-gray-600">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order ID:</p>
                    <p className="text-sm text-blue-600 font-mono">
                      {order.id}
                    </p>
                  </div>
                  {/* {order?.notes && ( */}
                  <div>
                    <p className="text-sm font-medium">Notes:</p>
                    <p className="text-sm text-gray-600">
                      Handle with care - fragile electronics
                    </p>
                  </div>
                  {/* )} */}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Items & Summary */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package2 className="h-5 w-5" />
                    Order Items ({order.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center gap-4 p-4 border rounded-lg"
                      >
                        <Image
                          src={item.product.image || "/images/placeholder.webp"}
                          alt={item.product.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item?.product?.name}</h4>
                          <Badge
                            className={getCategoryColor(item.product.category)}
                          >
                            {item.product.category}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">
                            ${item.product.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="rounded-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {/* <DollarSign className="h-5 w-5" /> */}
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${order.total.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span></span>
                    </div>
                    {/* {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount:</span>
                        <span>-${order.discount.toFixed(2)}</span>
                      </div>
                    )} */}
                    <Separator />
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
