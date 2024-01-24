'use strict';

const { product, clothing, electronic } = require('../models/product.model');
const { BadRequestError } = require('../core/error.response');
const {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
} = require('../models/repositories/product.repository');

// define Factory class to create product

class ProductFactory {
  static productType = {};

  static registerProductType(type, classRef) {
    this.productType[type] = classRef;
  }

  static async createProduct(type, payload) {
    //  switch (type) {
    //    case 'Electronics':
    //      return new Electronics(payload).createProduct();
    //    case 'Clothing':
    //      return new Clothing(payload).createProduct();
    //    default:
    //      throw new BadRequestError(`Invalid Product Types  ${type}`);
    //  }

    const productClass = this.productType[type];
    if (!productClass) {
      throw new BadRequestError(`Invalid Product Types  ${type}`);
    }
    return new productClass(payload).createProduct();
  }
  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }
  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await unPublishProductByShop({ product_shop, product_id });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllPublishForShop({ query, limit, skip });
  }
  static async searchProducts({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProduct({
    limit = 50,
    sort = 'ctime',
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: ['product_name', 'product_thumb', 'product_price'],
    });
  }
  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ['__v'] });
  }
}

// define base class

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }
  async createProduct(product_id) {
    return product.create({ ...this, _id: product_id });
  }
}

//define sub-class for different product types clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) {
      throw new BadRequestError('create new Clothing errors');
    }
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError('create new Product error');
    }
    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) {
      throw new BadRequestError('create new Clothing errors');
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError('create new Product error');
    }
    return newProduct;
  }
}
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Electronics', Electronics);

module.exports = ProductFactory;
