"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, LogOut, Package2, ShoppingCart } from "lucide-react";
import ProductList from "./product-list";
import OrderDialog from "./order-dialog";
import { OrderHistory } from "./order-history";
import { mockProducts } from "@/lib/utils";
import { Order } from "@/types/order";

interface DashboardProps {
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("products");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);

  useEffect(() => {
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  const handleCreateOrder = (order: Order) => {
    const updatedOrders = [...orders, order];
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
    setIsOrderDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Package2 className="h-8 w-8" />
              <h1 className="text-xl font-semibold">Order Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {user?.name}
              </span>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="px-6 py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="rounded-sm">
              <TabsTrigger
                value="products"
                className="flex items-center rounded-sm space-x-2"
              >
                <Package2 className="h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center rounded-sm space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>Orders</span>
              </TabsTrigger>
            </TabsList>

            {activeTab === "products" && (
              <Button onClick={() => setIsOrderDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            )}
          </div>

          <TabsContent value="products">
            <ProductList />
          </TabsContent>

          <TabsContent value="orders">
            <OrderHistory orders={orders} />
          </TabsContent>
        </Tabs>
      </div>

      <OrderDialog
        open={isOrderDialogOpen}
        onClose={() => setIsOrderDialogOpen(false)}
        products={mockProducts}
        onCreateOrder={handleCreateOrder}
      />
    </div>
  );
}
