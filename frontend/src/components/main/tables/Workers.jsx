import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import axios from "axios"
import Input from "@mui/material/Input";

function createData(id, name, pn, address) {
  return { id, name, pn, address };
}

const CustomTableCell = ({ row, name, onChange }) => {
  const { isEditMode } = row;
  return (
    <TableCell align="left">
      {isEditMode ? (
        <Input
          style={{ width: "100%" }}
          value={row[name]}
          name={name}
          onChange={e => onChange(e, row)}
        />
      ) : (
        row[name]
      )}
    </TableCell>
  );
};

export default function Workers() {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);
  const [name, setName] = React.useState(null);
  const [equips, setEquips] = React.useState(null);
  const [equip, setEquip] = React.useState(null);
  const [asc, setAsc] = React.useState(null);
  console.log(rows)
  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
  };
  const onSaveRow = async id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
    const row = rows.find((row) => row.id === id)
    const data = await axios.put(`http://localhost:3001/worker/${id}`, {
      worker_name: row.name,
      worker_pn: row.pn,
      worker_address: row.address,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    const { data } = await axios.post(`http://localhost:3001/worker`, {
      worker_name: addedRow.name,
      worker_pn: addedRow.pn,
      worker_address: addedRow.address,
    })
    console.log(equips);
    const { worker_id, worker_name, worker_pn, worker_address } = data
    const row = createData(worker_id, worker_name, worker_pn, worker_address)
    console.log(row);
    setRows([...rows, row])
    setAddedRow(null);
  };

  const onChangeAddedRow = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setAddedRow({ ...addedRow, [name]: value });
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }));
    }
    const value = e.target.value;
    const name = e.target.name;
    const { id } = row;
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onDelete = async id => {
    const data = await axios.delete(`http://localhost:3001/worker/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("http://localhost:3001/worker")
      setEquips(data[0].map(e => e.equip_name))
      console.log(data);
      const rows = data[1].map(({ worker_id, worker_name, worker_pn, worker_address }) =>
        createData(worker_id, worker_name, worker_pn, worker_address))
      setRows(rows)
    }
    fetchData()
  }, [])

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Input
                style={{ width: "100%" }}
                value={name}
                placeholder="Імя"
                onChange={(e) => setName(e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={equip}
                label="Обладнання"
                onChange={e => setEquip(e.target.value)}
              >
                {
                  equips?.map(value => <MenuItem value={value}>{value}</MenuItem>
                  )
                }
              </Select> </TableCell>
              <TableCell>
              За зростанням<Checkbox checked={asc} onChange={e => setAsc(e.target.checked)}>За зростанням</Checkbox>
            </TableCell>
            <TableCell>
              <Button onClick={async () => {
                const namequery = name ? `name=${name}&` : ``
                const equipQuery = equip ? `equip=${equip}&` : ``
                const { data } = await axios.get(`http://localhost:3001/worker/search/?${namequery}${equipQuery}asc=${asc}`)
                const rows = data.map(({ worker_id, worker_name, worker_pn, worker_address }) =>
                  createData(worker_id, worker_name, worker_pn, worker_address))
                setRows(rows)
              }}>Знайти</Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell>Ім'я</TableCell>
            <TableCell>Номер телефону </TableCell>
            <TableCell>Адреса</TableCell>
            <TableCell onClick={() => setAddedRow({})}>Додати</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => {
            return <>
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <CustomTableCell {...{ row, name: "name", onChange }} />
                <CustomTableCell {...{ row, name: "pn", onChange }} />
                <CustomTableCell {...{ row, name: "address", onChange }} />
                {row.isEditMode ?
                  <TableCell component="th" scope="row" onClick={() => onSaveRow(row.id)}
                  >
                    збер
                  </TableCell> :
                  <>
                    <TableCell component="th" scope="row" onClick={() => onToggleEditMode(row.id)}
                    >
                      ред
                    </TableCell>
                    <TableCell component="th" scope="row" onClick={() => onDelete(row.id)}>
                      вид
                    </TableCell>
                  </>
                }
              </TableRow>
            </>
          })}
          {
            addedRow && (
              <TableRow
                key={0}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  New
                </TableCell>
                <TableCell component="th" scope="row">
                  <Input
                    style={{ width: "100%" }}
                    value={addedRow.name}
                    placeholder="Ім'я"
                    name="name"
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Input
                    style={{ width: "100%" }}
                    value={addedRow.pn}
                    placeholder="Номер телефону"
                    name="pn"
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Input
                    style={{ width: "100%" }}
                    value={addedRow.address}
                    name="address"
                    placeholder="Адреса"
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row" onClick={onAddRow}
                >
                  збер
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table >
    </TableContainer >
  );
}