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

function createData(id, pin_start, pin_end, equip, worker) {
  console.log({id, pin_start, pin_end, equip, worker})
  return { id, pin_start: pin_start.split("T")[0], pin_end: pin_end?.split("T")[0], equip, worker };
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

export default function Pin({ role }) {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);
  const [workers, setWorkers] = React.useState([]);
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
    const data = await axios.put(`http://localhost:3001/pin/${id}`, {
      pin_start: row.pin_start,
      pin_end: row.pin_end,
      equip: row.equip,
      worker: row.worker,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    const { data } = await axios.post(`http://localhost:3001/pin`, {
      pin_start: addedRow.pin_start,
      pin_end: addedRow.pin_end,
      equip: addedRow.equip,
      worker: addedRow.worker,
    })
    console.log(data);
    const { pin_id, pin_start, pin_end, equip, worker } = data
    const row = createData(pin_id, pin_start, pin_end, equip, worker)
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
    const data = await axios.delete(`http://localhost:3001/pin/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/pin")
      const data = response.data[response.data.length - 1];
      setEquips(response.data[0].map(category => category.equip_name));
      setWorkers(response.data[1].map(charact => charact.worker_name));
      console.log(data);
      const rows = data.map(({ pin_id, pin_start, pin_end, equip, worker }) =>
        createData(pin_id, pin_start, pin_end, equip, worker))
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
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="pin_start"
                    value={addedRow.pin_start}
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="pin_end"
                    value={addedRow.pin_end}
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
                      name="category"
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
                      value={addedRow.worker}
                      name="charact"
                      onChange={onChangeAddedRow}
                    >
                      {
                        workers.map(value => <MenuItem value={value}>{value}</MenuItem>
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
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="contract_date"
                    value={row.pin_start}
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="contract_date"
                    value={row.pin_end}
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <CustomTableSelect {...{ row, name: "equip", onChange, values: equips }} />
                <CustomTableSelect {...{ row, name: "worker", onChange, values: workers }} />
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