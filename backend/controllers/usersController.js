const mysql = require('mysql')
const util = require('util')
const connection = require('../config/database')

const getAllUsers = (req, res) => {
  const sql = 'SELECT * FROM users'
  connection.query(sql, (err, result) => {
    if (err) return res.sendStatus(500)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

const createNewUser = async (req, res) => {
  const query = util.promisify(connection.query).bind(connection)
  const sql = 'INSERT INTO users VALUES(?, ?, ?, ?)'
  const { name, password, access } = req.body

  let result = async () => {
    let id = null
    const users = await query('SELECT * FROM users')
    id = users[users.length - 1].usersID
    return id
  }

  const id = (await result()) + 1

  const values = [id, name, password, access]

  if (!id || !name || !password || !access) {
    console.log(values)
    return res.status(400).json({
      message: 'Request must contain name, password, access fields',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err?.code === 'ER_DUP_ENTRY')
      return res.status(400).json({ message: 'Duplicate entry!' })

    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const user = {
      usersID: id,
      name: name,
      password: password,
      access: access,
    }
    return res.json(user)
  })
}

const getUser = (req, res) => {
  const sql = 'SELECT * FROM users WHERE usersID = ?'
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

const updateUser = async (req, res) => {
  const sql =
    'UPDATE users SET usersID = ?, name = ?, password = ?, access = ? WHERE usersID = ?'
  const { name, password, access } = req.body
  const usersID = req.body.usersID || req.params.id

  if (!usersID || !name || !password || !access) {
    return res.status(400).json({
      message: 'Request must contain name, password, access fields',
    })
  }

  const values = [usersID, name, password, access, usersID]

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }

    const user = {
      usersID: usersID,
      name: name,
      password: password,
      access: access,
    }
    return res.json(user)
  })
}

const deleteUser = (req, res) => {
  const sql = 'DELETE FROM users WHERE usersID = ?'
  const value = req.params.id || req.body.usersID
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    res.sendStatus(200)
  })
}

module.exports = {
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
  deleteUser,
}
