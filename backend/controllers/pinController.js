const util = require('util')
const connection = require('../config/database')

const getAllPins = async (req, res) => {
  const sql = 'SELECT * FROM pin;'
  const query = util.promisify(connection.query).bind(connection)
  let findEquip = async () => {
    const equip = await query('SELECT equip_id, equip_name FROM equipment')
    return JSON.parse(JSON.stringify(equip)).sort((a, b) =>
      a.equip_id > b.equip_id ? 1 : -1
    )
  }

  let findWorkers = async () => {
    const workers = await query('SELECT worker_id, worker_name FROM worker')
    return JSON.parse(JSON.stringify(workers))
  }

  const equip = await findEquip()
  const workers = await findWorkers()

  connection.query(sql, async (err, result) => {
    if (err) return res.sendStatus(500)
    const pins = JSON.parse(JSON.stringify(result))

    const response = [
      [...equip],
      [...workers],
      pins.map((pin) => {
        return {
          pin_id: pin.pin_id,
          pin_start: pin.pin_start,
          pin_end: pin.pin_end,
          equip: equip.find((e) => e.equip_id === pin.equip_id)?.equip_name,
          worker: workers.find((w) => w.worker_id === pin.worker_id)
            ?.worker_name,
        }
      }),
    ]
    res.json(response)
  })
}

const createNewPin = async (req, res) => {
  const query = util.promisify(connection.query).bind(connection)
  const sql = 'INSERT INTO pin VALUES(?, ?, ?, ?, ?)'
  const { pin_start, pin_end, equip, worker_name } = req.body
  let result = async () => {
    let pins = null
    try {
      const rows = await query('SELECT * FROM pin')
      pins = rows[rows.length - 1].pin_id
    } finally {
      return pins
    }
  }
  let find_worker = async (worker_name) => {
    const rows = await query(
      `SELECT worker_id FROM worker WHERE worker_name = ${worker_name}`
    )

    return rows[0].worker_id
  }
  let find_equip = async (equip) => {
    const rows = await query(
      `SELECT equip_id FROM equipment WHERE equip_name = ${equip}`
    )

    return rows[0].equip_id
  }

  const id = (await result()) + 1
  const worker_id = await find_worker(worker_name)
  const equip_id = await find_equip(equip)
  const values = [id, pin_start, pin_end, equip_id, worker_id]
  console.log(values)

  if (!pin_start || !equip_id || !worker_id) {
    return res.sendStatus(400).json({
      message: 'Request must contain pin_start, pin_end, equip, worker fields',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const pin = {
      pin_id: id,
      pin_start: pin_start,
      pin_end: pin_end,
      equip: equip,
      worker: worker,
    }
    res.json(pin)
  })
}

const getPin = (req, res) => {
  const sql = 'SELECT * FROM pin WHERE pin_id = ?'
  const value = req.params.id
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    if (!result.length) return res.sendStatus(404)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

const updatePin = async (req, res) => {
  const sql =
    'UPDATE pin SET pin_id = ?, pin_start = ?, pin_end = ?, equip_id = ?, worker_id = ? WHERE pin_id = ?'
  const query = util.promisify(connection.query).bind(connection)
  const { pin_start, pin_end, equip, worker } = req.body

  let find_worker = async (worker_name) => {
    let work = null
    const rows = await query('SELECT * FROM worker')
    work = rows.find((w) => w.worker_name === worker_name)
    if (!work?.worker_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return work.worker_id
  }

  let find_equip = async (equip) => {
    let equipment = null
    const rows = await query('SELECT * FROM equipment')
    equipment = rows.find((e) => e.equip_name === equip)
    if (!equipment?.equip_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return equipment.equip_id
  }

  const id = req.body.pin_id || req.params.id
  const worker_id = await find_worker(worker)
  const equip_id = await find_equip(equip)

  const values = [id, pin_start, pin_end, equip_id, worker_id, id]

  if (!pin_start || !equip_id || !worker_id) {
    return res.status(400).json({
      message: 'Request must contain pin_start, pin_end, equip, worker fields',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const pin = {
      pin_id: id,
      pin_start: pin_start,
      pin_end: pin_end,
      equip: equip,
      worker: worker,
    }
    res.json(pin)
  })
}

const deletePin = (req, res) => {
  const sql = 'DELETE FROM pin WHERE pin_id = ?'
  const value = req.params.id || req.body.pin_id
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    res.sendStatus(200)
  })
}

module.exports = {
  getAllPins,
  createNewPin,
  getPin,
  updatePin,
  deletePin,
}
