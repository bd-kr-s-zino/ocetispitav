const util = require('util')
const connection = require('../config/database')
const query = util.promisify(connection.query).bind(connection)

const getJournal = async (req, res) => {
  const sql = `SELECT * FROM journal ORDER BY id`
  connection.query(sql, (err, result) => {
    if (err) return res.sendStatus(500)
    const journal = JSON.parse(JSON.stringify(result))
    res.json(journal)
  })
}

module.exports = { getJournal }
