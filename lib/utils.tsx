import { CheckCircle, Clock, Package, Truck, XCircle } from "lucide-react";

import { Product } from "@/types/order";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    category: "Electronics",
    price: 1199,
    stock: 25,
    image: "/images/iphone.png",
  },
  {
    id: "2",
    name: "Samsung Galaxy S24 Ultra",
    category: "Electronics",
    price: 1299,
    stock: 18,
    image: "/images/s24.jpg",
  },
  {
    id: "3",
    name: "MacBook Air M2",
    category: "Computers",
    price: 1099,
    stock: 12,
    image: "/images/mac.webp",
  },
  {
    id: "4",
    name: "Logitech MX Master 3S",
    category: "Accessories",
    price: 99,
    stock: 45,
    image: "/images/mouse.jpeg",
  },
  {
    id: "5",
    name: "Apple Watch Series 9",
    category: "Wearables",
    price: 399,
    stock: 30,
    image: "/images/watch.webp",
  },
  {
    id: "6",
    name: "PlayStation 5",
    category: "Gaming",
    price: 499,
    stock: 8,
    image: "/images/ps5.jpg",
  },
];

export const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    Electronics: "bg-blue-100 text-blue-800",
    Computers: "bg-purple-100 text-purple-800",
    Accessories: "bg-green-100 text-green-800",
    Wearables: "bg-orange-100 text-orange-800",
    Gaming: "bg-red-100 text-red-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "Pending":
      return <Clock className="h-4 w-4" />;
    case "Processing":
      return <Package className="h-4 w-4" />;
    case "Shipped":
      return <Truck className="h-4 w-4" />;
    case "Delivered":
      return <CheckCircle className="h-4 w-4" />;
    case "Cancelled":
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-purple-100 text-purple-800";
    case "Delivered":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
