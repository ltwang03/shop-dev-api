'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ['Electronics', 'Clothing', 'Furniture'],
    },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collation: COLLECTION_NAME,
    timestamps: true,
  }
);

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collation: 'Clothes',
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
  },
  {
    collation: 'Electronics',
    timestamps: true,
  }
);

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  electronic: model('Electronics', electronicSchema),
  clothing: model('Clothings', clothingSchema),
};
