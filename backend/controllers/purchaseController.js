const util = require('util')
const connection = require('../config/database')
const query = util.promisify(connection.query).bind(connection)

const getAllPurchases = async (req, res) => {
  const sql = `SELECT purchase_id, equip_name AS equip, cost, purchase_date, supplier_name AS supplier FROM purchase, equipment, supplier WHERE purchase.equip_id = equipment.equip_id AND purchase.supplier_id = supplier.supplier_id;`

  const findEquip = async (equip_id) => {}

  const equipment = JSON.parse(
    JSON.stringify(
      await query(`SELECT equip_name FROM equipment ORDER BY equip_id`)
    )
  )
  const supplier = JSON.parse(
    JSON.stringify(
      await query(`SELECT supplier_name FROM supplier ORDER BY supplier_id`)
    )
  )
  connection.query(sql, async (err, result) => {
    if (err) return res.sendStatus(500)
    const purchases = JSON.parse(JSON.stringify(result))
    const response = [[...equipment], [...supplier], [...purchases]]
    res.json(response)
  })
}

const createNewPurchase = async (req, res) => {
  const sql = 'INSERT INTO purchase VALUES(?, ?, ?, ?, ?)'
  const { equip, cost, purchase_date, supplier } = req.body

  const findPurchaseId = async () => {
    const purchases = await query('SELECT * FROM purchase')
    return purchases[purchases.length - 1].purchase_id
  }
  const findEquip = async (equip) => {
    const equipment = await query(
      `SELECT * FROM equipment WHERE equip_name = '${equip}'`
    )
    return equipment[0].equip_id
  }
  const findSupplier = async (sup) => {
    const supplier = await query(
      `SELECT * FROM supplier WHERE supplier_name = '${sup}'`
    )
    return supplier[0].supplier_id
  }

  const equip_id = await findEquip(equip)
  const supplier_id = await findSupplier(supplier)
  const purchase_id = (await findPurchaseId()) + 1

  const values = [purchase_id, equip_id, cost, purchase_date, supplier_id]
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    res.json({
      purchase_id: purchase_id,
      equip: equip,
      cost: cost,
      purchase_date: purchase_date,
      supplier: supplier,
    })
  })
}

const updatePurchase = async (req, res) => {
  const sql =
    'UPDATE purchase SET purchase_id = ?, equip_id = ?, cost = ?, purchase_date = ?, supplier_id = ? WHERE purchase_id = ?'
  const { equip, cost, purchase_date, supplier } = req.body

  const findEquip = async (equip) => {
    const equipment = await query(
      `SELECT * FROM equipment WHERE equip_name = '${equip}'`
    )
    return equipment[0].equip_id
  }
  const findSupplier = async (sup) => {
    const supplier = await query(
      `SELECT * FROM supplier WHERE supplier_name = '${sup}'`
    )
    return supplier[0].supplier_id
  }

  const equip_id = await findEquip(equip)
  const supplier_id = await findSupplier(supplier)
  const purchase_id = req.params.id

  const values = [
    purchase_id,
    equip_id,
    cost,
    purchase_date,
    supplier_id,
    purchase_id,
  ]
  connection.query(sql, values, (err, result) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    res.json({
      purchase_id: Number(purchase_id),
      equip: equip,
      cost: cost,
      purchase_date: purchase_date,
      supplier: supplier,
    })
  })
}

const deletePurchase = (req, res) => {
  const sql = 'DELETE FROM purchase WHERE purchase_id = ?'
  const purchase_id = req.params.id
  connection.query(sql, purchase_id, (err, result) => {
    if (err) return res.sendStatus(500)
    res.sendStatus(200)
  })
}

const searchBy = (req, res) => {
  const { after, before, equip, supplier, asc } = req.query
  const byDate = after
    ? before
      ? `AND purchase_date BETWEEN '${after}' AND '${before}'`
      : `AND purchase_date >= '${after}'`
    : before
    ? `AND purchase_date <= '${before}'`
    : ''
  const byEquip = equip ? `AND equip_name LIKE '%${equip}%'` : ''
  const bySupplier = supplier ? `AND supplier_name LIKE '%${supplier}%'` : ''
  const order =
    asc == 'true' ? ' cost ASC' : asc == 'false' ? ' cost DESC' : ' purchase_id'
  const sql = `SELECT purchase_id, equip_name AS equip, cost, purchase_date, supplier_name AS supplier 
  FROM purchase, equipment, supplier 
  WHERE purchase.equip_id = equipment.equip_id 
  AND purchase.supplier_id = supplier.supplier_id
  ${byDate}
  ${byEquip}
  ${bySupplier}
  ORDER BY ${order};`

  connection.query(sql, (err, result) => {
    if (err) res.sendStatus(500)
    res.json(JSON.parse(JSON.stringify(result)))
  })
}

module.exports = {
  getAllPurchases,
  createNewPurchase,
  updatePurchase,
  deletePurchase,
  searchBy,
}
