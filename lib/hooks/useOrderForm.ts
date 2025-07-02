// hooks/useOrderForm.ts
import { OrderItem, Product } from "@/types/order";
import { useState } from "react";

interface UseOrderFormResult {
  customerName: string;
  customerEmail: string;
  selectedItems: OrderItem[];
  searchTerm: string;
  total: number;
  setCustomerName: (name: string) => void;
  setCustomerEmail: (email: string) => void;
  setSearchTerm: (term: string) => void;
  setSelectedItems: (items: OrderItem[]) => void;
  addToOrder: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  resetForm: () => void;
  isValid: boolean;
}

export function useOrderForm(): UseOrderFormResult {
  // State
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Derived state
  const total = selectedItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Handlers
  const addToOrder = (product: Product) => {
    setSelectedItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setSelectedItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );
    } else {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const resetForm = () => {
    setCustomerName("");
    setCustomerEmail("");
    setSelectedItems([]);
    setSearchTerm("");
  };

  return {
    // Form state
    customerName,
    customerEmail,
    selectedItems,
    searchTerm,
    total,

    // Setters
    setCustomerName,
    setCustomerEmail,
    setSearchTerm,
    setSelectedItems,

    // Handlers
    addToOrder,
    updateQuantity,
    resetForm,

    // Validation
    isValid:
      customerName.trim() !== "" &&
      customerEmail.includes("@") &&
      selectedItems.length > 0,
  };
}
