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

function createData(id, action, user, DATE) {
  return { id, action, user: String(user), DATE: DATE.split("T")[0] };
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
export default function Logs({ role }) {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);
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

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/journal")
      const data = response.data;
      console.log(data);
      const rows = data.map(({ id, action, user, DATE }) =>
        createData(id, action, user, DATE))
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
            <TableCell>Дата</TableCell>
            <TableCell>Дія  </TableCell>
            <TableCell>Користувач</TableCell>
            {role !== "guest" && <TableCell onClick={() => setAddedRow({})}>Додати</TableCell>}
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
                <TableCell component="th" scope="row">
                  <input
                    type="date"
                    name="contract_date"
                    value={row.DATE.split("T")[0]}
                    onChange={(e) => onChange(e, row)}
                    disabled={true}
                  />
                </TableCell>
                <CustomTableCell {...{ row, name: "action", onChange }} />
                <CustomTableCell {...{ row, name: "user", onChange }} />
              </TableRow>
            </>
          })}
        </TableBody>
      </Table >
    </TableContainer >
  );
}