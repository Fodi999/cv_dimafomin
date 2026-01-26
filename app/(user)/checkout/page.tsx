"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";

/**
 * Checkout Page
 * Route: /checkout
 * Purpose: Order placement (placeholder for now)
 */
export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, itemCount, clearCart } = useCart();

  if (itemCount === 0) {
    router.push("/marketplace");
    return null;
  }

  const handlePlaceOrder = () => {
    // Placeholder - в будущем здесь будет интеграция с API
    alert("Заказ оформлен! (Это заглушка)");
    clearCart();
    router.push("/orders");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <CreditCard className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Оформление заказа
            </h1>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Контактная информация</CardTitle>
                <CardDescription>
                  Укажите ваши данные для связи
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Имя</Label>
                  <Input id="name" placeholder="Ваше имя" />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" type="tel" placeholder="+48 123 456 789" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Адрес доставки</CardTitle>
                <CardDescription>
                  Куда доставить заказ?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Адрес</Label>
                  <Input id="address" placeholder="Улица, дом, квартира" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Город</Label>
                    <Input id="city" placeholder="Варшава" />
                  </div>
                  <div>
                    <Label htmlFor="postal">Почтовый индекс</Label>
                    <Input id="postal" placeholder="00-000" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Способ оплаты</CardTitle>
                <CardDescription>
                  Выберите способ оплаты (заглушка)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input type="radio" name="payment" id="cash" defaultChecked />
                    <Label htmlFor="cash" className="cursor-pointer ml-2">
                      Наличными при получении
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                    <input type="radio" name="payment" id="card" disabled />
                    <Label htmlFor="card" className="cursor-pointer ml-2 text-gray-400">
                      Картой онлайн (скоро)
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.title} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        {(item.price * item.quantity).toFixed(2)} PLN
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Товаров ({itemCount})
                    </span>
                    <span className="font-semibold">{total.toFixed(2)} PLN</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Доставка</span>
                    <span className="font-semibold">Бесплатно</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Всего</span>
                      <span className="text-purple-600 dark:text-purple-400">
                        {total.toFixed(2)} PLN
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600"
                  onClick={handlePlaceOrder}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Оформить заказ
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки данных
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
