const util = require('util')
const connection = require('../config/database')
const query = util.promisify(connection.query).bind(connection)

const getAllEquipment = async (req, res) => {
  const sql =
    'SELECT equip_id, equip_name, equip_diff, category_name AS category, charact FROM equipment, category, characteristics WHERE equipment.category_id = category.category_id AND equipment.charact_id = characteristics.charact_id ORDER BY equip_id;'
  const categories = JSON.parse(
    JSON.stringify(await query('SELECT category_name FROM category'))
  )
  const characts = JSON.parse(
    JSON.stringify(await query('SELECT charact FROM characteristics'))
  )
  connection.query(sql, async (err, result) => {
    if (err) return res.sendStatus(500)
    const equipment = JSON.parse(JSON.stringify(result))

    const response = [[...categories], [...characts], [...equipment]]
    res.json(response)
  })
}

const createNewEquipment = async (req, res) => {
  const sql = 'INSERT INTO equipment VALUES(?, ?, ?, ?, ?)'
  const { equip_name, equip_diff, category, charact } = req.body
  let result = async () => {
    let equipments = null
    try {
      const rows = await query('SELECT * FROM equipment')
      equipments = rows[rows.length - 1].equip_id
    } finally {
      return equipments
    }
  }

  let findCategory = async (category_name) => {
    let cat = null
    const rows = await query('SELECT * FROM category')
    cat = rows.find((c) => c.category_name === category_name)
    if (!cat?.category_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return cat.category_id
  }

  let findСharact = async (characts) => {
    if (!characts) return null
    let charact = null
    const rows = await query('SELECT * FROM characteristics')
    charact = rows.find((c) => c.charact === characts)
    if (!charact?.charact_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return charact.charact_id
  }

  const id = (await result()) + 1
  const category_id = await findCategory(category)
  const charact_id = await findСharact(charact)

  const values = [id, equip_name, equip_diff, category_id, charact_id]

  if (!equip_name || !category_id) {
    return res.status(400).JSON({
      message:
        'Request must contain equip_name, equip_diff, category, charact fields',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const equipment = {
      equip_id: id,
      equip_name: equip_name,
      equip_diff: equip_diff,
      category: category,
      charact: charact,
    }
    // console.log(equipment)
    res.json(equipment)
  })
}

const getEquipment = (req, res) => {
  const sql = 'SELECT * FROM equipment WHERE equipment_id = ?'
  const value = req.params.id
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    if (!result.length) return res.sendStatus(404)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

const updateEquipment = async (req, res) => {
  const sql =
    'UPDATE equipment SET equip_id = ?, equip_name = ?, equip_diff = ?, category_id = ?, charact_id = ? WHERE equip_id = ?'
  const { equip_name, equip_diff, category, charact } = req.body

  let findCategory = async (category_name) => {
    let cat = null
    const rows = await query('SELECT * FROM category')
    cat = rows.find((c) => c.category_name === category_name)
    if (!cat?.category_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return cat.category_id
  }

  let findСharact = async (characts) => {
    if (!characts) return null
    const rows = await query('SELECT * FROM characteristics')
    const charact = rows.find((c) => c.charact === characts)
    console.log(charact)
    if (!charact?.charact_id)
      return res.status(400).json({ message: 'Please provide valid data!' })

    return charact.charact_id
  }

  const id = req.params.id
  const category_id = await findCategory(category)
  const charact_id = await findСharact(charact)
  // console.log(charact_id)

  const values = [id, equip_name, equip_diff, category_id, charact_id, id]
  // console.log(values)

  if (!equip_name || !category_id) {
    res.status(400).JSON({
      message:
        'Request must contain equip_name, equip_diff, category_id, charact_id fields',
    })
  }

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    const equipment = {
      equip_id: Number(id),
      equip_name: equip_name,
      equip_diff: equip_diff,
      category: category,
      charact: charact,
    }
    res.status(200).json(equipment)
  })
}

const deleteEquipment = (req, res) => {
  const sql = 'DELETE FROM equipment WHERE equip_id = ?'
  const value = req.params.id || req.body.equip_id
  connection.query(sql, value, (err, result) => {
    if (err) return res.sendStatus(500)
    res.sendStatus(200)
  })
}

const searchBy = (req, res) => {
  const { after, before, name, category, asc } = req.query
  const byName = name ? `AND equip_name LIKE '%${name}%'` : ''
  const byDate = after
    ? before
      ? `JOIN (
    SELECT * FROM purchase WHERE purchase_date BETWEEN '${after}' AND '${before}') AS purchases
    ON purchases.equip_id = equipment.equip_id`
      : `JOIN (
      SELECT * FROM purchase WHERE purchase_date >= '${after}') AS purchases
      ON purchases.equip_id = equipment.equip_id`
    : before
    ? `JOIN (
        SELECT * FROM purchase WHERE purchase_date <= '${before}') AS purchases
        ON purchases.equip_id = equipment.equip_id`
    : ' '

  const byCategory = category ? `AND category_name = '${category}'` : ''
  const order =
    asc == undefined || asc == 'true'
      ? ' equip_name ASC'
      : asc == 'false'
      ? ' equip_name DESC'
      : ' equipment.equip_id'
  const sql = `
  SELECT equipment.equip_id, equip_name, equip_diff, category_name AS category, charact
  FROM category, characteristics, equipment
  ${byDate}
  WHERE equipment.category_id = category.category_id
  AND equipment.charact_id = characteristics.charact_id
  ${byCategory}
  ${byName}
  ORDER BY ${order};
  `

  connection.query(sql, (err, result) => {
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

module.exports = {
  getAllEquipment,
  createNewEquipment,
  getEquipment,
  updateEquipment,
  deleteEquipment,
  searchBy,
}
