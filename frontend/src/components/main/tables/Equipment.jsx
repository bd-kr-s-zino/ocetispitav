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

function createData(id, equip_name, equip_diff, category, charact) {
  return { id, equip_name, equip_diff, category, charact };
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

export default function Equipment({ role }) {
  const [rows, setRows] = React.useState();
  const [previous, setPrevious] = React.useState({});
  const [addedRow, setAddedRow] = React.useState(null);
  const [categories, setCategories] = React.useState([]);
  const [characts, setCharacts] = React.useState([]);

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
    const data = await axios.put(`http://localhost:3001/equipment/${id}`, {
      equip_name: row.equip_name,
      equip_diff: row.equip_diff,
      category: row.category,
      charact: row.charact,
    })
    console.log(data);
  };
  const onAddRow = async () => {
    const { data } = await axios.post(`http://localhost:3001/equipment`, {
      equip_name: addedRow.equip_name,
      equip_diff: addedRow.equip_diff,
      category: addedRow.category,
      charact: addedRow.charact,
    })
    console.log(data);
    const { equip_id, equip_name, equip_diff, category, charact } = data
    const row = createData(equip_id, equip_name, equip_diff, category, charact)
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
    const data = await axios.delete(`http://localhost:3001/equipment/${id}`)
    console.log(data);
    const newRows = rows.filter(row => row.id !== id);
    setRows(newRows);
  };

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get("http://localhost:3001/equipment")
      const data = response.data[response.data.length - 1];
      setCategories(response.data[0].map(category => category.category_name));
      setCharacts(response.data[1].map(charact => charact.charact));
      console.log(data);
      const rows = data.map(({ equip_id, equip_name, equip_diff, category, charact}) =>
        createData(equip_id, equip_name, equip_diff, category, charact))
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
            <TableCell>Назва </TableCell>
            <TableCell>Різниця</TableCell>
            <TableCell>Категорія</TableCell>
            <TableCell>Характеристика</TableCell>
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
                  <Input
                    style={{ width: "100%" }}
                    value={addedRow.equip_name}
                    placeholder="Назва"
                    name="equip_name"
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <Input
                    style={{ width: "100%" }}
                    value={addedRow.equip_diff}
                    placeholder="Різниця"
                    name="equip_diff"
                    onChange={onChangeAddedRow}
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={addedRow.category}
                      name="category"
                      onChange={onChangeAddedRow}
                    >
                      {
                        categories.map(value => <MenuItem value={value}>{value}</MenuItem>
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
                      value={addedRow.charact}
                      name="charact"
                      onChange={onChangeAddedRow}
                    >
                      {
                        characts.map(value => <MenuItem value={value}>{value}</MenuItem>
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
                <CustomTableCell {...{ row, name: "equip_name", onChange }} />
                <CustomTableCell {...{ row, name: "equip_diff", onChange }} />
                <CustomTableSelect {...{ row, name: "category", onChange, values: categories }} />
                <CustomTableSelect {...{ row, name: "charact", onChange, values: characts }} />
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