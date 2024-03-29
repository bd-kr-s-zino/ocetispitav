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

function createData(category_id, category_name) {
  return {category_id, category_name};
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
        if (row.category_id === id) {
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
        if (row.category_id === id) {
          return { ...row, isEditMode: !row.isEditMode };
        }
        return row;
      });
    });
    const row = rows.find((row) => row.category_id === id)
    const data = await axios.put(`http://localhost:3001/category/${id}`, {
      category_name: row.category_name,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    console.log(addedRow);
    const {data} = await axios.post(`http://localhost:3001/category`, {
      category_name: addedRow.category_name,
    })
    console.log(data);
    const { category_id, category_name} = data
    const row = createData( category_id, category_name)
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
    const { category_id } = row;
    const newRows = rows.map(row => {
      if (row.category_id === category_id) {
        return { ...row, [name]: value };
      }
      return row;
    });
    setRows(newRows);
  };

  const onDelete = async id => {
    const data = await axios.delete(`http://localhost:3001/category/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.category_id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get("http://localhost:3001/category")
      console.log(data);
      const rows = data.map(({category_id, category_name}) =>
        createData(category_id, category_name))
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
                key={row.category_id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.category_id}
                </TableCell>
                <CustomTableCell {...{ row, name: "category_name", onChange }} />
                {row.isEditMode ?
                  <TableCell component="th" scope="row" onClick={() => onSaveRow(row.category_id)}
                  >
                    збер
                  </TableCell> :
                  <>
                    <TableCell component="th" scope="row" onClick={() => onToggleEditMode(row.category_id)}
                    >
                      ред
                    </TableCell>
                    <TableCell component="th" scope="row" onClick={() => onDelete(row.category_id)}>
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
                    value={addedRow.category_name}
                    placeholder="Характеристика"
                    name="category_name"
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