const express = require('express')
const router = express.Router()
const purchaseController = require('../../controllers/purchaseController.js')

router
  .route('/')
  .get(purchaseController.getAllPurchases)
  .post(purchaseController.createNewPurchase)

router.route('/search').get(purchaseController.searchBy)

router
  .route('/:id')
  .put(purchaseController.updatePurchase)
  .delete(purchaseController.deletePurchase)

module.exports = router
