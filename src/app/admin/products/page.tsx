'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Edit, Eye } from "lucide-react"

interface Product {
  _id: number;
  name: string;
  price: number;
  quantity: number;
  description: string;
  imgUrl: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantity: "",
    description: "",
    image: null as File | null,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [viewingDescription, setViewingDescription] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/products')
      console.log(response)
      if (!response.data.success) throw new Error('Failed to fetch products')
      const data = await response.data.products;
      setProducts(data)
    } catch (error: any) {
      console.error('Error fetching products:', error)
      toast({
        title: "Something went wrong!",
        description: error.message || ""
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (newProduct.name && newProduct.price && newProduct.quantity) {
      try {
        const formData = new FormData()
        formData.append('name', newProduct.name)
        formData.append('price', newProduct.price)
        formData.append('quantity', newProduct.quantity)
        formData.append('description', newProduct.description)
        if (newProduct.image) {
          formData.append('image', newProduct.image)
        }

        const response = await axios.post('/api/admin/products', formData)

        if (!response.data.success) throw new Error('Failed to add product')
        setNewProduct({ name: "", price: "", quantity: "", description: "", image: null })
        setIsModalOpen(false)
        fetchProducts()
      } catch (error: any) {
        console.error('Error adding product:', error)
        toast({
          title: "Something went wrong!",
          description: error.message || ""
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      setLoading(true)
      const response = await axios.delete(`/api/admin/products/${id}`)
      if (!response.data.success) throw new Error('Failed to delete product')
      fetchProducts()
    } catch (error: any) {
      console.error('Error deleting product:', error)
      toast({
        title: "Something went wrong!",
        description: error.message || ""
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    setLoading(true)
    try {
      const response = await axios.put(`/api/admin/products/${editingProduct._id}`, editingProduct)
      if (!response.data.success) throw new Error('Failed to update product')
      setEditingProduct(null)
      fetchProducts()
    } catch (error: any) {
      console.error('Error updating product:', error)
      toast({
        title: "Something went wrong!",
        description: error.message || ""
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Products</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>Add New Product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files?.[0] || null })}
                  className="col-span-3"
                />
              </div>
              <Button type="submit" disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Add Product'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      {
        products ? (<Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sr.no.</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products && products.map((product,i) => (
              <TableRow key={product._id}>
                <TableCell>{i+1}</TableCell>
                <TableCell>
                  {product.imgUrl && (
                    <Image
                      src={product.imgUrl}
                      alt={product.name}
                      width={50}
                      height={50}
                      className="object-cover rounded"
                    />
                  )}
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => setViewingDescription(product.description)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={() => setEditingProduct(product)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>) : (
          <div className="flex justify-center items-center">
          No any Products Found!
          </div>
        )
      }

      {/* Edit Product Modal */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <form onSubmit={handleEditProduct} className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input
                  id="edit-name"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-price" className="text-right">Price</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">Quantity</Label>
                <Input
                  id="edit-quantity"
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <Button type="submit">Update Product</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Description Modal */}
      <Dialog open={!!viewingDescription} onOpenChange={() => setViewingDescription(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Product Description</DialogTitle>
          </DialogHeader>
          <div className="mt-2 max-h-[60vh] overflow-y-auto">
            <p className="text-sm text-gray-500">{viewingDescription}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}