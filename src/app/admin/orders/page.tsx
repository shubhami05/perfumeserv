'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { authFetch } from "@/utils/authFetch"
import axios from "axios"

interface Order {
  id: number;
  customer: string;
  total: number;
  status: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders')
      // if (!response.data.success) throw new Error('Failed to fetch orders')
      const data = await response.data.orders;
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await authFetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update order status')
      fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-3xl font-bold">Manage Orders</div>
      {
        orders ? (  <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(order.id, "Pending")}
                      variant={order.status === "Pending" ? "default" : "outline"}
                    >
                      Pending
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(order.id, "Shipped")}
                      variant={order.status === "Shipped" ? "default" : "outline"}
                    >
                      Shipped
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateStatus(order.id, "Delivered")}
                      variant={order.status === "Delivered" ? "default" : "outline"}
                    >
                      Delivered
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>) : (
          <div className="flex- justify-center items-center">
            No any orders there!
          </div>
        )
      }
    
    </div>
  )
}