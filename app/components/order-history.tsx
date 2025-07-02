"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye } from "lucide-react";

import OrderDetailsDialog from "./order-details.-dialog";
import { Order } from "@/types/order";
import { getStatusColor, getStatusIcon } from "@/lib/utils";

interface OrderHistoryProps {
  orders: Order[];
}

export function OrderHistory({ orders }: OrderHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const updateStatus = (orderId: string, newStatus: string) => {
    const storedOrders = localStorage.getItem("orders");
    const orders = storedOrders ? JSON.parse(storedOrders) : [];

    const updatedOrders = orders.map((order: Order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // setOrders(updatedOrders); // Optional - only if you maintain state

    setIsDetailsOpen(false);

    console.log(`Updated order ${orderId} to ${newStatus} in localStorage`);
  };

  const getOrderCounts = () => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "Pending").length,
      processing: orders.filter((o) => o.status === "Processing").length,
      shipped: orders.filter((o) => o.status === "Shipped").length,
      delivered: orders.filter((o) => o.status === "Delivered").length,
      cancelled: orders.filter((o) => o.status === "Cancelled").length,
    };
  };

  const counts = getOrderCounts();

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search orders by ID, or customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">All ({counts.all})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
          <TabsTrigger value="processing">
            Processing ({counts.processing})
          </TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({counts.shipped})</TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({counts.delivered})
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled ({counts.cancelled})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-6">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-sm text-gray-700">
                  <div className="col-span-2">Order ID</div>
                  <div className="col-span-2">Customer</div>
                  <div className="col-span-2">Date</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Route</div>
                  <div className="col-span-1">Total</div>
                  <div className="col-span-1">Actions</div>
                </div>

                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-2">
                      <span className="font-medium text-blue-600">
                        {order.id}
                      </span>
                      <p className="text-sm text-gray-500">
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">{order.customer.name}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-900">{order.date}</span>
                    </div>
                    <div className="col-span-2">
                      <Badge
                        className={`${getStatusColor(
                          order.status
                        )} flex items-center gap-1 w-fit`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-700">
                        {order.route}Indonesia - Singapore
                      </span>
                    </div>
                    <div className="col-span-1">
                      <span className="font-semibold">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setIsDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredOrders.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  No orders found matching your criteria.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-sm text-gray-500 mt-4">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </TabsContent>
      </Tabs>

      {isDetailsOpen && (
        <OrderDetailsDialog
          order={selectedOrder}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onStatusUpdate={updateStatus}
        />
      )}
    </div>
  );
}
