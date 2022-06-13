import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios"
import Input from "@mui/material/Input";

function createData(id, name, pn, email) {
  return { id, name, pn, email };
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

export default function Supliers() {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);

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
    const data = await axios.put(`http://localhost:3001/supplier/${id}`, {
      supplier_name: row.name,
      supplier_pn: row.pn,
      email: row.email,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    const {data} = await axios.post(`http://localhost:3001/supplier`, {
      supplier_name: addedRow.name,
      supplier_pn: addedRow.pn,
      email: addedRow.email,
    })
    console.log(data);
    const { supplier_id, supplier_name, supplier_pn, email } = data
    const row = createData(supplier_id, supplier_name, supplier_pn, email)
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
    const data = await axios.delete(`http://localhost:3001/supplier/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("http://localhost:3001/supplier")
      console.log(data);
      const rows = data.map(({ supplier_id, supplier_name, supplier_pn, email }) =>
        createData(supplier_id, supplier_name, supplier_pn, email))
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
            <TableCell>Ім'я</TableCell>
            <TableCell>Номер телефону </TableCell>
            <TableCell>Email</TableCell>
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
                <CustomTableCell {...{ row, name: "email", onChange }} />
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
                    name="email"
                    placeholder="Email"
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