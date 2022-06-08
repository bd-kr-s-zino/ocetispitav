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

function createData(id, contract_date, expire_date, responsibility, worker) {
  return { id, contract_date: contract_date.split("T")[0], expire_date: expire_date.split("T")[0], responsibility, worker };
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

export default function Contracts({ role }) {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);
  const [workers, setWorkers] = React.useState([]);

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
    const data = await axios.put(`http://localhost:3001/contract/${id}`, {
      contract_date: row.contract_date,
      expire_date: row.expire_date,
      worker: row.worker,
      responsibility: row.responsibility,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    const { data } = await axios.post(`http://localhost:3001/contract`, {
      contract_date: addedRow.contract_date,
      expire_date: addedRow.expire_date,
      worker: addedRow.worker,
      responsibility: addedRow.responsibility,
    })
    console.log(data);
    const { contract_id, contract_date, expire_date, responsibility, worker } = data
    const row = createData(contract_id, contract_date, expire_date, responsibility, worker)
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
    const data = await axios.delete(`http://localhost:3001/contract/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/contract")
      const data = response.data[response.data.length - 1];
      setWorkers(response.data.slice(0, -1).map(worker => worker.worker_name));
      console.log(data);
      const rows = data.map(({ contract_id, contract_date, expire_date, responsibility, worker }) =>
        createData(contract_id, contract_date, expire_date, responsibility, worker))
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
            <TableCell>Дата укладання </TableCell>
            <TableCell>Дійсний до</TableCell>
            <TableCell>Характеристика</TableCell>
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
                    name="contract_date"
                    value={addedRow.contract_date}
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="expire_date"
                    value={addedRow.expire_date}
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Input
                    style={{ width: "100%" }}
                    value={addedRow.responsibility}
                    placeholder="Обов'язки"
                    name="responsibility"
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={addedRow.worker}
                      name="worker"
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
                    value={row.contract_date.split("T")[0]}
                    onChange={(e) => onChange(e, row)}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="expire_date"
                    value={row.expire_date.split("T")[0]}
                    onChange={(e) => onChange(e, row)}
                  />
                </TableCell>
                <CustomTableCell {...{ row, name: "responsibility", onChange }} />
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