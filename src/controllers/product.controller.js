'use strict';

const ProductFactory = require('../services/product.service');
const { SuccessResponse } = require('../core/success.response');

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Create product success',
      metadata: await ProductFactory.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all Draft for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  getAllDraftForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list success',
      metadata: await ProductFactory.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  getAllPublishForShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list success',
      metadata: await ProductFactory.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'Published Product success',
      metadata: await ProductFactory.publishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };
  unPublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: 'UnPublished Product success',
      metadata: await ProductFactory.unPublishProductByShop({
        product_shop: req.user.userId,
        product_id: req.params.id,
      }),
    }).send(res);
  };

  searchProductByUser = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get list Product success',
      metadata: await ProductFactory.searchProducts(req.params),
    }).send(res);
  };

  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get All Product Success',
      metadata: await ProductFactory.findAllProduct(req.query),
    }).send(res);
  };
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: 'Get Product Success',
      metadata: await ProductFactory.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
