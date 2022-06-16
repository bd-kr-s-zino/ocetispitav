import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from "axios"
import Input from "@mui/material/Input";

function createData(id, equip, cost, purchase_date, supplier) {
  return { id, equip, cost, purchase_date: purchase_date?.split("T")[0], supplier };
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

const CustomTableSelect = ({ row, name, onChange, values }) => {
  const { isEditMode } = row;
  return (
    <TableCell align="left">
      {isEditMode ? (
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label"></InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={row[name]}
            name={name}
            label="Age"
            onChange={e => onChange(e, row)}
          >
            {
              values.map(value => <MenuItem value={value}>{value}</MenuItem>
              )
            }
          </Select>
        </FormControl>
      ) : (
        row[name]
      )}
    </TableCell>
  );
};


export default function Purchase({ role }) {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);
  const [supplier, setSupliers] = React.useState([]);
  const [equips, setEquips] = React.useState([]);

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
    const data = await axios.put(`http://localhost:3001/purchase/${id}`, {
      purchase_date: row.purchase_date,
      cost: row.cost,
      equip: row.equip,
      supplier: row.supplier,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    console.log({
      purchase_date: addedRow.purchase_date,
      cost: addedRow.cost,
      equip: addedRow.equip,
      supplier: addedRow.supplier,
    })
    console.log(addedRow);

    const { data } = await axios.post(`http://localhost:3001/purchase`, {
      purchase_date: addedRow.purchase_date,
      cost: addedRow.cost,
      equip: addedRow.equip,
      supplier: addedRow.supplier,
    })
    console.log(data);
    const { purchase_id, equip, cost, purchase_date, supplier } = data
    const row = createData(purchase_id, equip, cost, purchase_date, supplier)
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
    const data = await axios.delete(`http://localhost:3001/purchase/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/purchase")
      const data = response.data[response.data.length - 1];
      setEquips(response.data[0].map(category => category.equip_name));
      setSupliers(response.data[1].map(charact => charact.supplier_name));
      console.log(data);
      const rows = data.map(({ purchase_id, equip, cost, purchase_date, supplier }) =>
        createData(purchase_id, equip, cost, purchase_date, supplier))
      setRows(rows)
    }
    fetchData()
  }, [])
  console.log(rows);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>id</TableCell>
            <TableCell>Дата початку </TableCell>
            <TableCell>Дата кінця</TableCell>
            <TableCell>Устаткування</TableCell>
            <TableCell>Працівник</TableCell>
            {role !== "guest" && <TableCell onClick={() => setAddedRow({})}>Додати</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {
            addedRow && (
              <TableRow
                key={0}
                sx={{ '&:last-child td, &:last-child th': { border: 0, marginBottom: "60px" } }}
              >
                <TableCell component="th" scope="row">
                  New
                </TableCell>
                <TableCell>
                  <Input
                    style={{ width: "100%" }}
                    value={addedRow.cost}
                    placeholder="Ціна"
                    name="cost"
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="purchase_date"
                    value={addedRow.purchase_date}
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={addedRow.equip}
                      name="equip"
                      onChange={onChangeAddedRow}
                    >
                      {
                        equips.map(value => <MenuItem value={value}>{value}</MenuItem>
                        )
                      }
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell component="th" scope="row">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={addedRow.supplier}
                      name="supplier"
                      onChange={onChangeAddedRow}
                    >
                      {
                        supplier.map(value => <MenuItem value={value}>{value}</MenuItem>
                        )
                      }
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell component="th" scope="row" onClick={onAddRow}
                >
                  збер
                </TableCell>
              </TableRow>
            )
          }
          {rows?.map((row) => {
            return <>
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <CustomTableCell {...{ row, name: "cost", onChange }} />
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="purchase_date"
                    value={row.purchase_date}
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <CustomTableSelect {...{ row, name: "equip", onChange, values: equips }} />
                <CustomTableSelect {...{ row, name: "supplier", onChange, values: supplier }} />
                {role !== "guest" && (row.isEditMode ?
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
                )}
              </TableRow>
            </>
          })}
        </TableBody>
      </Table >
    </TableContainer >
  );
}