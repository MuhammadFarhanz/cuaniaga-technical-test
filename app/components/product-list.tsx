"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import Image from "next/image";
import { getCategoryColor, mockProducts } from "@/lib/utils";

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = useMemo(() => {
    return mockProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const getStockStatus = (stock: number) => {
    if (stock > 20)
      return { label: "In Stock", color: "bg-green-100 text-green-800" };
    if (stock > 5)
      return { label: "Low Stock", color: "bg-yellow-100 text-yellow-800" };
    return { label: "Out of Stock", color: "bg-red-100 text-red-800" };
  };

  console.log();

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200">
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 font-medium text-sm text-gray-700">
              <div className="col-span-1">Image</div>
              <div className="col-span-4">Product Name</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Stock</div>
              <div className="col-span-1">Status</div>
            </div>

            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock);
              return (
                <div
                  key={product.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="col-span-1">
                    <Image
                      src={product.image || "/images/placeholder.webp"}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                  <div className="col-span-4">
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">ID: {product.id}</p>
                  </div>
                  <div className="col-span-2">
                    <Badge className={getCategoryColor(product.category)}>
                      {product.category}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <span className="font-semibold">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-900">{product.stock}</span>
                  </div>
                  <div className="col-span-1">
                    <Badge className={stockStatus.color}>
                      {stockStatus.label}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              No products found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {mockProducts.length} products
      </div>
    </div>
  );
}
