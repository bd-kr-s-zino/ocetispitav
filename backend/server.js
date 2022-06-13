require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')

const auth = require('./routes/auth')
const repair = require('./routes/api/repair')
const category = require('./routes/api/category')
const worker = require('./routes/api/worker')
const contract = require('./routes/api/contract')
const characteristics = require('./routes/api/characteristics')
const purchase = require('./routes/api/purchase')
const supplier = require('./routes/api/supplier')
const equipment = require('./routes/api/equipment')
const pin = require('./routes/api/pin')
const users = require('./routes/api/users')
const logEvents = require('./middleware/logger')
const journal = require('./routes/api/journal')

const PORT = process.env.PORT || 3001

app.use((req, res, next) => {
  if (req.url == '/auth') logEvents(`${req.headers.user}`, `Вхід в систему`)
  const methods = ['POST', 'PUT', 'DELETE']
  if (methods.includes(req.method) && req.url != '/auth')
    logEvents(`${req.headers.user}`, `${req.method} ${req.url.slice(1)}`)
  next()
})

app.use(cors())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/auth', auth)
app.use('/repair', repair)
app.use('/category', category)
app.use('/worker', worker)
app.use('/contract', contract)
app.use('/characteristics', characteristics)
app.use('/purchase', purchase)
app.use('/supplier', supplier)
app.use('/equipment', equipment)
app.use('/pin', pin)
app.use('/users', users)
app.use('/journal', journal)

app.get('*', (req, res) => {
  res.status(404)
  if (req.accepts('json')) {
    res.json({ error: '404 Not Found' })
  } else {
    res.type('txt').send('404 Not Found')
  }
})

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}...`)
})
