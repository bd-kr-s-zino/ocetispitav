const express = require('express')
const router = express.Router()
const workerController = require('../../controllers/workerController.js')

router
  .route('/')
  .get(workerController.getAllWorkers)
  .post(workerController.createNewWorker)

router.route('/search').get(workerController.searchBy)

router
  .route('/:id')
  .get(workerController.getWorker)
  .put(workerController.updateWorker)
  .delete(workerController.deleteWorker)

module.exports = router
