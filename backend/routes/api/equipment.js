const express = require('express')
const router = express.Router()
const equipmentController = require('../../controllers/equipmentController.js')

router
  .route('/')
  .get(equipmentController.getAllEquipment)
  .post(equipmentController.createNewEquipment)

router.route('/search').get(equipmentController.searchBy)

router
  .route('/:id')
  .get(equipmentController.getEquipment)
  .put(equipmentController.updateEquipment)
  .delete(equipmentController.deleteEquipment)

module.exports = router
