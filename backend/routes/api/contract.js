const express = require('express')
const router = express.Router()
const contractController = require('../../controllers/contractController.js')

router
  .route('/')
  .get(contractController.getAllContracts)
  .post(contractController.createNewContract)

router.route('/search').get(contractController.searchBy)

router
  .route('/:id')
  .get(contractController.getContract)
  .put(contractController.updateContract)
  .delete(contractController.deleteContract)

module.exports = router
