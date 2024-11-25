// CartPage.tsx
'use client'
import React from 'react';
import { useCart } from '@/hooks/CartContext'; // Adjust the import path accordingly
import { Button } from '@/components/ui/button'; // Adjust the import path accordingly
import { useToast } from '@/hooks/use-toast'; // Assuming you have a toast hook for notifications
import Image from 'next/image'; // Import Image from Next.js
import { useRouter } from 'next/navigation';

const CartPage: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useCart(); // Access cart state and functions
  const { toast } = useToast(); // Assuming you have a toast hook for notifications
  const router = useRouter();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast({
      title: "Product Added to Cart",
      description: `${product.name} quantity increased.`,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-2xl font-bold mb-4">Your cart is empty!</p>
        <Button className="w-24" onClick={()=>router.push('/')}>Shop now</Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <ul className="divide-y divide-gray-200">
        {cart.map((product) => (
          <li key={product._id} className="py-4 flex justify-between items-center">
            <div className="flex items-center">
              {product.imgUrl && (
                <Image
                  src={product.imgUrl}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="object-cover rounded mr-4"
                />
              )}
              <div>
                <h2 className="text-xl">{product.name}</h2>
                <p>${product.price.toFixed(2)} x {product.quantity}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Button onClick={() => handleAddToCart(product)} className="text-white font-bold py-2 px-4 rounded">
                Add More
              </Button>
              <Button variant={'destructive'} onClick={() => removeFromCart(product._id)} className="ml-2 text-white font-bold py-2 px-4 rounded">
                Remove
              </Button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h2 className="text-xl">
          Total: ${cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}
        </h2>
      </div>
      <Button onClick={()=>router.push("/checkout")} className=" text-white font-bold py-2 px-4 rounded w-full mt-4">
        Checkout
      </Button>
    </div>
  );
};

export default CartPage;