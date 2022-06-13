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

function createData(charact_id, charact) {
  return {charact_id, charact};
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

export default function Charact() {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);

  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.charact_id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
    console.log(rows);
  };

  const onSaveRow = async id => {
    setRows(state => {
      return rows.map(row => {
        if (row.charact_id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
    const row = rows.find((row) => row.charact_id === id)
    const data = await axios.put(`http://localhost:3001/characteristics/${id}`, {
      charact: row.charact,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    console.log(addedRow);
    const {data} = await axios.post(`http://localhost:3001/characteristics`, {
      charact: addedRow.charact,
    })
    console.log(data);
    const { charact_id, charact} = data
    const row = createData( charact_id, charact)
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
    const { charact_id } = row;
    const newRows = rows.map(row => {
      if (row.charact_id === charact_id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onDelete = async id => {
    const data = await axios.delete(`http://localhost:3001/characteristics/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.charact_id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("http://localhost:3001/characteristics")
      console.log(data);
      const rows = data.map(({charact_id, charact}) =>
        createData(charact_id, charact))
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
            <TableCell>Характеристика</TableCell>
            <TableCell onClick={() => setAddedRow({})}>Додати</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows?.map((row) => {
            return <>
              <TableRow
                key={row.charact_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.charact_id}
                </TableCell>
                <CustomTableCell {...{ row, name: "charact", onChange }} />
                {row.isEditMode ?
                  <TableCell component="th" scope="row" onClick={() => onSaveRow(row.charact_id)}
                  >
                    збер
                  </TableCell> :
                  <>
                    <TableCell component="th" scope="row" onClick={() => onToggleEditMode(row.charact_id)}
                    >
                      ред
                    </TableCell>
                    <TableCell component="th" scope="row" onClick={() => onDelete(row.charact_id)}>
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
                    value={addedRow.charact}
                    placeholder="Характеристика"
                    name="charact"
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