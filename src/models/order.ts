import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  paymentId: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

const OrderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default OrderModel;