'use client'
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/CartContext';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Define the Product interface
interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
    imgUrl: string;
    quantity: number; // Add quantity to the Product interface
}

const ProductDetail: React.FC = () => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [quantity, setQuantity] = useState<number>(1); // State to manage quantity
    const navigate = useRouter();
    const { toast } = useToast();
    const { addToCart } = useCart();
    const params = useParams();
    const productId = params.id;

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/products/${productId}`);
                if (!response.data.success) {
                    throw new Error('Failed to fetch product details');
                }
                const data: Product = response.data.product;
                setProduct(data);
            } catch (err: any) {
                console.log(err.message);
                toast({
                    title: 'Error',
                    description: err.message
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    const handleAddToCart = (product: Product) => {
        if (quantity > 0) {
            // Logic to add the product to the cart
            addToCart(product)
            toast({
                title: 'Success',
                description: ` ${product?.name} added to cart!`
            });
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-lg">No product found.</p>
                <Button onClick={() => navigate.push("/products")} className="mt-4">Back to Home</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex justify-center">
                    <img src={product.imgUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                    <p className="text-xl text-green-600 mb-4">${product.price.toFixed(2)}</p>
                    <p className='text-xl text-red-600 mb-4'>{product.quantity < 0 ? "Out of Stock":""}</p>
                    <p className="text-gray-700 mb-6">{product.description}</p>

                    {/* Add to Cart Button */}
                    <Button
                        onClick={() => handleAddToCart(product)}
                        className={`mt-auto bg-zinc-800 hover:bg-zinc-700 text-white ${quantity <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={quantity <= 0} // Disable button if quantity is 0
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;