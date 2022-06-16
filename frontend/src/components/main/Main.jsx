import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import CssBaseline from '@mui/material/CssBaseline'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import CategoryTable from './tables/tables'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Workers from './tables/Workers'
import Contracts from './tables/Contracts'
import Equipment from './tables/Equipment'
import Supliers from './tables/Supliers'
import Pin from './tables/Pin'
import Charact from './tables/Charact'
import Purchase from './tables/Purchasea'
import Logs from './tables/Logs'
import Users from './tables/Users'

const drawerWidth = 240

export default function Main({ role }) {
  const [currentTable, setCurrentTable] = React.useState('')
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
          }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              {currentTable}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            'width': drawerWidth,
            'flexShrink': 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <Toolbar />
          <Divider />
          <List>
            {[
              ['category', 'Категорії'],
              ['workers', 'Працівники'],
              ['contracts', 'Контракти'],
              ['equipment', 'Устаткування'],
              ['pin', 'Закріплення'],
              ['supliers', 'Поставники'],
              ['characteristics', 'Характеристики'],
              ['logs', 'Логи'],
              ['purchase', 'Закупки'],
              ['users', 'Користувачі'],
            ].filter(arr => arr[0] !== 'users' || role === 'admin')
              .map((items) => {
                return (
                  <ListItem
                    key={items[1]}
                    disablePadding
                    onClick={() => setCurrentTable(items[1])}
                  >
                    <Link to={items[0]}>
                      <ListItemButton>
                        <ListItemText primary={items[1]} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                )
              })}
          </List>
          <Divider />
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3, mt: '60px' }}
        >
          <Routes>
            <Route path="/category" element={<CategoryTable role={role} />} />
            <Route path="/workers" element={<Workers role={role} />} />
            <Route path="/contracts" element={<Contracts role={role} />} />
            <Route path="/equipment" element={<Equipment role={role} />} />
            <Route path="/supliers" element={<Supliers role={role} />} />
            <Route path="/pin" element={<Pin role={role} />} />
            <Route path="/purchase" element={<Purchase role={role} />} />
            <Route path="/characteristics" element={<Charact role={role} />} />
            <Route path="/logs" element={<Logs role={role} />} />
            <Route path="/users" element={<Users role={role} />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  )
}
