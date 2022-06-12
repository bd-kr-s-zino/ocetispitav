const mysql = require('mysql')
const util = require('util')
const connection = require('../config/database')

const getAllContracts = async (req, res) => {
  const sql =
    'SELECT contract_id, contract_date, expire_date, responsibility, worker.worker_name AS worker FROM work_contract, worker WHERE work_contract.worker_id = worker.worker_id'
  const query = util.promisify(connection.query).bind(connection)
  const workers = JSON.parse(
    JSON.stringify(await query('SELECT worker_id, worker_name FROM worker'))
  )
  const response = [...workers]
  connection.query(sql, async (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const contracts = JSON.parse(JSON.stringify(result))
    response.push(contracts)
    res.json(response)
  })
}

const createNewContract = async (req, res) => {
  const query = util.promisify(connection.query).bind(connection)
  const sql = 'INSERT INTO work_contract VALUES(?, ?, ?, ?, ?)'
  const { contract_date, expire_date, responsibility, worker } = req.body

  let result = async () => {
    let contracts = null
    try {
      const rows = await query('SELECT * FROM work_contract')
      contracts = rows[rows.length - 1].contract_id
    } finally {
      return contracts
    }
  }

  let find_worker = async (worker_name) => {
    let work = null
    const rows = await query('SELECT * FROM worker')
    work = rows.find((w) => w.worker_name === worker_name)
    if (!work?.worker_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return work.worker_id
  }

  const id = (await result()) + 1
  const worker_id = await find_worker(worker)

  const values = [id, contract_date, expire_date, responsibility, worker_id]
  console.log(values)

  if (!contract_date || !expire_date || !worker_id) {
    return res.status(400).json({
      message:
        'Request must contain contract_date, expire_date, responsibility, worker_id fields',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const workerObject = {
      contract_id: id,
      contract_date: contract_date,
      expire_date: expire_date,
      responsibility: responsibility,
      worker: worker,
    }
    res.json(workerObject)
  })
}

const getContract = (req, res) => {
  const sql = 'SELECT * FROM work_contract WHERE contract_id = ?'
  const value = req.params.id
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    if (!result.length) return res.sendStatus(404)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

const updateContract = async (req, res) => {
  const sql =
    'UPDATE work_contract SET contract_id = ?, contract_date = ?, expire_date = ?, responsibility = ?, worker_id = ? WHERE contract_id = ?'
  const query = util.promisify(connection.query).bind(connection)
  const { contract_date, expire_date, responsibility, worker } = req.body

  let find_worker = async (worker_name) => {
    let work = null
    const rows = await query('SELECT * FROM worker')
    work = rows.find((w) => w.worker_name === worker_name)
    if (!work?.worker_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return work.worker_id
  }
  const worker_id = await find_worker(worker)
  const id = req.params.id || req.body.contract_id
  const values = [id, contract_date, expire_date, responsibility, worker_id, id]

  if (!contract_date || !expire_date || !worker_id) {
    res.status(400).json({
      message:
        'Request must contain contract_date, expire_date, responsibility, worker_id fields',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const workerObject = {
      contract_id: Number(id),
      contract_date: contract_date,
      expire_date: expire_date,
      responsibility: responsibility,
      worker: worker,
    }
    res.json(workerObject)
  })
}

const deleteContract = (req, res) => {
  const sql = 'DELETE FROM work_contract WHERE contract_id = ?'
  const value = req.params.id || req.body.worker_id
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    res.sendStatus(200)
  })
}

const searchBy = (req, res) => {
  const { worker, asc } = req.query
  const byWorker = worker ? `AND worker_name LIKE '%${worker}%'` : ''
  const order =
    asc == 'true'
      ? ' worker_name ASC'
      : asc == 'false'
      ? ' worker_name DESC'
      : ' contract_id'
  const sql = `SELECT contract_id, contract_date, expire_date, responsibility, worker.worker_name AS worker 
  FROM work_contract, worker 
  WHERE work_contract.worker_id = worker.worker_id ${byWorker} 
  ORDER BY ${order}`
  connection.query(sql, (err, result) => {
    if (err) res.sendStatus(500)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

module.exports = {
  getAllContracts,
  createNewContract,
  getContract,
  updateContract,
  deleteContract,
  searchBy,
}
