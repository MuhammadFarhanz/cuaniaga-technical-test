import { mockProducts } from "@/lib/utils";
import { Order, Product } from "@/types/order";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OrderState {
  orders: Order[];
  products: Product[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, newStatus: Order["status"]) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      products: mockProducts,

      addOrder: (order) =>
        set((state) => ({ orders: [...state.orders, order] })),

      updateOrderStatus: (orderId, newStatus) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          ),
        })),
    }),
    {
      name: "order-storage",
    }
  )
);
