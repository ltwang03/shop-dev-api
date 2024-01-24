const express = require('express');
const ProductController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');
const router = express.Router();

router.get(
  '/search/:keySearch',
  asyncHandler(ProductController.searchProductByUser)
);
router.get('', asyncHandler(ProductController.findAllProducts));
router.get('/:product_id', asyncHandler(ProductController.findProduct));

router.use(authentication);
router.post('', asyncHandler(ProductController.createProduct));
router.patch(
  '/publish/:id',
  asyncHandler(ProductController.publishProductByShop)
);
router.patch(
  '/unpublish/:id',
  asyncHandler(ProductController.unPublishProductByShop)
);
// query
router.get(
  '/published/all',
  asyncHandler(ProductController.getAllPublishForShop)
);
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftForShop));
module.exports = router;
