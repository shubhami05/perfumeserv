// pages/payment.tsx
'use client'
import React, { useState } from 'react';
import { useCart } from '@/hooks/CartContext'; // Adjust the import path accordingly
import { Button } from '@/components/ui/button'; // Adjust the import path accordingly
import { useRouter } from 'next/navigation';

const CheckoutPage: React.FC = () => {
    const { cart } = useCart();
    const router = useRouter();

    // State for form fields
    const [name, setName] = useState('');
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [pincode, setPincode] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [email, setEmail] = useState('');

    const handlePayment = (e: any) => {
        e.preventDefault();
        // Here you would typically handle the payment process
        // For example, you could call your backend to create a Stripe session
        console.log('Proceeding to payment with the following details:', {
            name,
            streetAddress,
            city,
            pincode,
            contactNumber,
            email,
        });
        // Redirect to Stripe checkout or handle payment logic
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <p className="text-2xl font-bold mb-4">Your cart is empty!</p>
                <Button className="w-24" onClick={() => router.push('/')}>Shop now</Button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Checkout</h1>
            <form onSubmit={handlePayment}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter your name"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter your street address"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter your city"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Pincode</label>
                    <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter your pincode"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Contact Number</label>
                    <input
                        type="tel"
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter your contact number"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Email (Optional)</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-4">
                    <h2 className="text-xl font-bold">Order Summary</h2>
                    <ul className="divide-y divide-gray-200">
                        {cart.map((product) => (
                            <li key={product._id} className="py-2 flex justify-between">
                                <span>{product.name}</span>
                                <span>${(product.price * product.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <h2 className="text-xl mt-4">
                        Total: ${cart.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2)}
                    </h2>
                </div>
                <Button type="submit" className="text-white font-bold py-2 px-4 rounded w-full mt-4">
                    Proceed to Payment
                </Button>
            </form>
        </div>
    );
};

export default CheckoutPage;