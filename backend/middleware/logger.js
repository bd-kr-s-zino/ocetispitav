const fs = require('fs')
const mysql = require('mysql')
const connection = require('../config/database')

const logEvents = async (user, message) => {
  const date = new Date().toISOString().split('T')
  const timestamp = `${date[0]} ${date[1].split('.')[0]}`
  const object = {
    action: message,
    user: user,
    date: timestamp,
  }
  const sql = `INSERT INTO journal(action, user, date) VALUES ('${object.action}', '${object.user}', '${object.date}');`
  connection.query(sql, (err, result) => {
    if (err) {
      console.log(err)
      return err
    }
  })
}

module.exports = logEvents
