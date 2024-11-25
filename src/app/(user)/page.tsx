'use client'

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast"; // Assuming you have a toast hook for notifications
import Image from "next/image"; // Import Image from Next.js
import { useCart } from "@/hooks/CartContext"; // Adjust the import path accordingly
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Product {
  _id: string;
  name: string;
  price: number;
  imgUrl: string;
  quantity: number;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // Assuming you have a toast hook for notifications
  const { addToCart } = useCart(); // Use the Cart Context
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data?.products);
      } catch (err: any) {
        setError(err.message);
        toast({
          title: "Error",
          description: "Failed to load products. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product); // Add product to cart using context
    toast({
      title: "Product Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (

      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )

  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div >
      <div className="container  mb-20">
        <div className="flex flex-col gap-2 items-center justify-center min-h-72 ">

        <h1 className="text-4xl font-bold">Welcome to Perfume-NL</h1>
        <p className="text-xl font-medium">We provide best perfumes directly deliever to your doorstep!</p>
        </div>
      </div>
      <div className="container mb-10">
        <div className="text-3xl font-bold mb-6">Our Products</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 px-5 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: Product) => (
            <Card key={product._id}>
              <CardContent>
                {product.imgUrl && (
                  <Image
                    src={product.imgUrl}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="object-cover rounded"
                  />
                )}
              </CardContent>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <div className="mt-2">${product.price.toFixed(2)}</div>
              </CardHeader>
              <CardFooter>
                <Button onClick={() => router.push(`/products/${product._id}`)}>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Home;