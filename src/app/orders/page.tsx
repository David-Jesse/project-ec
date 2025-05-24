"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  Package,
  Calendar,
  DollarSign,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  paymentId?: string;
  trackingNumber?: string;
  items: OrderItem[];
  shipping?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  billing?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yello-800",
  PAID: "bg-green-100 text-green-800",
  PROCCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "DELIVERED":
      return <CheckCircle className="h-4 w-4" />;
    case "SHIPPED":
      return <Truck className="h-4 w-4" />;
    case "PROCESSING":
    case "PAID":
      return <Clock className="h-4 w-4" />;
    case "CANCELLED":
    case "REFUNDED":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <Package className="h-4 w-4" />;
  }
};

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const searchParams = useSearchParams();
  const [cartCleared, setCartCleared] = useState(false);


  useEffect(() => {
    fetchOrders();
    
    const paymentSuccess = searchParams.get("payment_success");

    if (paymentSuccess === "true" && !cartCleared) {
        setCartCleared(true);

        setTimeout(() => {
            const url = new URL(window.location.href);
            url.searchParams.delete('payment_success');
            url.searchParams.delete('order_id');
            window.history.replaceState({}, "", url.pathname + url.search);
        }, 3000)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, cartCleared]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="bg-amber-400 hover:bg-amber-700 px-4 py-2 rounded-lg transiton-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Head  */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and Manage your order history</p>
        </div>

        {/* Order list */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="h-16 s-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Orders Yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet. Start Shopping to see your
              orders here.
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-amber-400 hover:bg-amber-600 px-6 py-3 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      {order.paymentId && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Payment ID: {order.paymentId.slice(-8)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleOrderExpansion(order.id)}
                      className="text-gray-500 hover:text-gray-700 p-1"
                    >
                      {expandedOrders.has(order.id) ? (
                        <ChevronUp className="h-6 w-6" />
                      ) : (
                        <ChevronDown className="h-6 w-6" />
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-gray-900">
                        {order.id.slice(-8)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Ordered:</span>
                      <span className="text-gray-900">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Total:</span>
                      <span className="font-semibold text-gray-700">
                        {formatPrice(order.total / 100)}
                      </span>
                    </div>
                  </div>

                  {order.trackingNumber && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700">
                          Tracking Number:
                        </span>
                        <span className="font-mono text-sm text-blue-900">
                          {order.trackingNumber}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expandable Order details */}
                {expandedOrders.has(order.id) && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    {/* Order items */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Order Items
                      </h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              {item.product.imageUrl && (
                                <Image
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="h-12 w-12 object-cover rounded-lg"
                                  width={24}
                                  height={24}
                                />
                              )}
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.product.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-gray-900">
                              {formatPrice((item.price * item.quantity) / 100)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Detais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {order.shipping && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Shipping Address
                          </h4>
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-gray-900">
                              {order.shipping.address}
                            </p>
                            <p className="text-gray-900">
                              {order.shipping.city}, {order.shipping.postalCode}
                              , {order.shipping.country}
                            </p>
                            <p className="text-gray-900">
                              {order.shipping.country}
                            </p>
                          </div>
                        </div>
                      )}

                      {order.billing && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Billing Address
                          </h4>
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-gray-900">
                              {order.billing.address}
                            </p>
                            <p className="text-gray-900">
                              {order.billing.city}, {order.billing.postalCode}
                            </p>
                            <p className="text-gray-900">
                              {order.billing.country}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
