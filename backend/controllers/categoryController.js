const mysql = require('mysql')
const util = require('util')
const connection = require('../config/database')

const getAllCategories = (req, res) => {
  const sql = 'SELECT * FROM category'
  connection.query(sql, (err, result) => {
    if (err) return res.sendStatus(500)
    const categories = result.sort((a, b) =>
      a.category_id > b.category_id ? 1 : -1
    )
    res.json(JSON.parse(JSON.stringify(categories)))
  })
}

const createNewCategory = async (req, res) => {
  const query = util.promisify(connection.query).bind(connection)
  const sql = 'INSERT INTO category VALUES(?, ?)'
  const { category_name } = req.body

  let result = async () => {
    let id = null
    const rows = await query('SELECT * FROM category')
    categories = rows.sort((a, b) => (a.category_id > b.category_id ? 1 : -1))
    id = categories[categories.length - 1].category_id
    return id
  }

  const id = (await result()) + 1

  const values = [id, category_name]

  if (!id || !category_name) {
    return res.status(400).json({
      message: 'Request must contain category_name field',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err?.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Duplicate entry!' })

    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const category = {
      category_id: id,
      category_name: category_name,
    }
    return res.json(category)
  })
}

const getCategory = (req, res) => {
  const sql = 'SELECT * FROM category WHERE category_id = ?'
  const value = req.params.id
  connection.query(sql, value, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    if (!result.length) return res.sendStatus(404)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

const updateCategory = async (req, res) => {
  const sql =
    'UPDATE category SET category_id = ?, category_name = ? WHERE category_id = ?'
  const { category_name } = req.body
  const category_id = req.body.category_id || req.params.id

  if (!category_id || !category_name) {
    return res.status(400).json({
      message: 'Request must contain category_name field',
    })
  }

  const values = [category_id, category_name, category_id]

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const category = {
      category_id: Number(category_id),
      category_name: category_name,
    }

    res.status(200).json(category)
  })
}

const deleteCategory = (req, res) => {
  const sql = 'DELETE FROM category WHERE category_id = ?'
  const value = req.params.id || req.body.category_id
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    res.sendStatus(200)
  })
}

const searchBy = (req, res) => {
  const name = req.query.name
    ? ` WHERE category_name LIKE '%${req.query.name}%'`
    : ''
  const order =
    req.query.asc == 'true'
      ? ' category_name ASC'
      : req.query.asc == 'false'
      ? ' category_name DESC'
      : ' category_id'

  const sql = `SELECT * FROM category${name} ORDER BY${order}`
  connection.query(sql, (err, result) => {
    if (err) res.sendStatus(500)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

module.exports = {
  getAllCategories,
  createNewCategory,
  getCategory,
  updateCategory,
  deleteCategory,
  searchBy,
}
