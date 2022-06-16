import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import Input from '@mui/material/Input'

function createData(id, name, password, access) {
  return { id, name, password, access }
}

const CustomTableCell = ({ row, name, onChange }) => {
  const { isEditMode } = row
  return (
    <TableCell align="left">
      {isEditMode ? (
        <Input
          style={{ width: '100%' }}
          value={row[name]}
          name={name}
          onChange={(e) => onChange(e, row)}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  )
}

export default function Users() {
  const [rows, setRows] = React.useState()
  const [previous, setPrevious] = React.useState({})
  const [addedRow, setAddedRow] = React.useState(null)

  const onToggleEditMode = (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode }
        }
        return row
      })
    })
  }
  const onSaveRow = async (id) => {
    setRows((state) => {
      return rows.map((row) => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode }
        }
        return row
      })
    })
    const row = rows.find((row) => row.id === id)
    const data = await axios.put(`http://localhost:3001/users/${id}`, {
      user_name: row.name,
      user_password: row.password,
      access: row.access,
    })
    console.log(data)
  }
  const onAddRow = async () => {
    const { data } = await axios.post(`http://localhost:3001/users`, {
      user_name: addedRow.name,
      user_password: addedRow.password,
      access: addedRow.access,
    })
    console.log(data)
    const { user_id, user_name, user_password, access } = data
    const row = createData(user_id, user_name, user_password, access)
    console.log(row)
    setRows([...rows, row])
    setAddedRow(null)
  }

  const onChangeAddedRow = (e) => {
    const value = e.target.value
    const name = e.target.name
    setAddedRow({ ...addedRow, [name]: value })
  }

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({ ...state, [row.id]: row }))
    }
    const value = e.target.value
    const name = e.target.name
    const { id } = row
    const newRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, [name]: value }
      }
      return row
    })
    setRows(newRows)
  }

  const onDelete = async (id) => {
    const data = await axios.delete(`http://localhost:3001/users/${id}`)
    console.log(data)
    const newRows = rows.filter((row) => row.id !== id)
    setRows(newRows)
  }

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get('http://localhost:3001/users')
      console.log(data)
      const rows = data.map(({ usersID, name, password, access }) =>
        createData(usersID, name, password, access)
      )
      setRows(rows)
    }
    fetchData()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Пароль</TableCell>
            <TableCell>Рівень доступу</TableCell>
            <TableCell onClick={() => setAddedRow({})}>Додати</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => {
            return (
              <>
                <TableRow
                  key={row.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.id}
                  </TableCell>
                  <CustomTableCell {...{ row, name: 'name', onChange }} />
                  <CustomTableCell {...{ row, name: 'password', onChange }} />
                  <CustomTableCell {...{ row, name: 'access', onChange }} />
                  {row.isEditMode ? (
                    <TableCell
                      component="th"
                      scope="row"
                      onClick={() => onSaveRow(row.id)}
                    >
                      збер
                    </TableCell>
                  ) : (
                    <>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() => onToggleEditMode(row.id)}
                      >
                        ред
                      </TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        onClick={() => onDelete(row.id)}
                      >
                        вид
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </>
            )
          })}
          {addedRow && (
            <TableRow
              key={0}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                New
              </TableCell>
              <TableCell component="th" scope="row">
                <Input
                  style={{ width: '100%' }}
                  value={addedRow.name}
                  placeholder="Username"
                  name="name"
                  onChange={onChangeAddedRow}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <Input
                  style={{ width: '100%' }}
                  value={addedRow.password}
                  placeholder="Пароль"
                  name="password"
                  onChange={onChangeAddedRow}
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <Input
                  style={{ width: '100%' }}
                  value={addedRow.access}
                  name="access"
                  placeholder="Рівень доступу"
                  onChange={onChangeAddedRow}
                />
              </TableCell>
              <TableCell component="th" scope="row" onClick={onAddRow}>
                збер
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
