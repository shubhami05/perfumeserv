import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this product.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description for this product.'],
    maxlength: [200, 'Description cannot be more than 200 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price for this product.'],
    min: [0, 'Price must be a positive number'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide the quantity of this product.'],
    min: [0, 'Quantity must be a non-negative number'],
    default: 0,
  },
  imgUrl:{
    type:String
  }
}, {
  timestamps: true,
});

const ProductModel = mongoose.models.Product || mongoose.model('Product', productSchema);

export default ProductModel;