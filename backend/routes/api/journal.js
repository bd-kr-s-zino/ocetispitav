const express = require('express')
const router = express.Router()
const journalController = require('../../controllers/journalController.js')

router.route('/').get(journalController.getJournal)

module.exports = router
