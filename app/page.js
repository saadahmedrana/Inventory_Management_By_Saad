'use client';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Typography, Stack, Button, TextField, IconButton, Select, MenuItem } from '@mui/material';
import { collection, getDocs, query, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import SearchIcon from '@mui/icons-material/Search';
import { SnackbarProvider, useSnackbar } from 'notistack';

function Inventory() {
  const { enqueueSnackbar } = useSnackbar();
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(0);
  const [expandedItemId, setExpandedItemId] = useState(null);
  const [sortOption, setSortOption] = useState('name');
  const [darkMode, setDarkMode] = useState(false);

  const updateInventory = () => {
    const q = query(collection(firestore, 'inventory'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inventoryList = [];
      snapshot.forEach((doc) => {
        inventoryList.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setInventory(inventoryList);
      setFilteredInventory(inventoryList);
    });

    return () => unsubscribe(); // Clean up subscription on unmount
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleAddItem = async () => {
    try {
      await addDoc(collection(firestore, 'inventory'), {
        name: itemName,
        quantity: itemQuantity,
      });
      setItemName('');
      setItemQuantity(0);
      setOpen(false);
      enqueueSnackbar('Item added successfully!', { variant: 'success' });
    } catch (error) {
      console.error("Error adding item: ", error);
      enqueueSnackbar('Error adding item!', { variant: 'error' });
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      await deleteDoc(doc(firestore, 'inventory', id));
      enqueueSnackbar('Item removed successfully!', { variant: 'success' });
    } catch (error) {
      console.error("Error removing item: ", error);
      enqueueSnackbar('Error removing item!', { variant: 'error' });
    }
  };

  const handleUpdateQuantity = async (id, increment) => {
    try {
      const itemDoc = doc(firestore, 'inventory', id);
      const item = inventory.find(item => item.id === id);
      const newQuantity = item.quantity + increment;

      if (newQuantity <= 0) {
        await handleRemoveItem(id);
      } else {
        await updateDoc(itemDoc, {
          quantity: newQuantity,
        });
        enqueueSnackbar('Quantity updated successfully!', { variant: 'success' });
      }
    } catch (error) {
      console.error("Error updating quantity: ", error);
      enqueueSnackbar('Error updating quantity!', { variant: 'error' });
    }
  };

  const handleSearch = () => {
    const filteredItems = inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredInventory(filteredItems);
  };

  const handleToggleDetails = (id) => {
    setExpandedItemId(expandedItemId === id ? null : id);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedInventory = [...filteredInventory].sort((a, b) => {
    if (sortOption === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortOption === 'quantity') {
      return a.quantity - b.quantity;
    }
    return 0;
  });

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const theme = {
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#41015b',
      },
      background: {
        default: darkMode ? '#303030' : '#f0f0f0',
        paper: darkMode ? '#424242' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#000000',
      },
    },
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor={theme.palette.background.default} color={theme.palette.text.primary} position="relative" p={2}>
      <Box display="flex" alignItems="center" mb={2} position="absolute" top={20} left={20}>
        <Button 
          variant="contained" 
          color="secondary" 
          onClick={toggleTheme}
          style={{ marginRight: '20px' }}
        >
          Toggle Theme
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setOpen(!open)} 
        >
          Add New Item
        </Button>
        {open && (
          <Box display="flex" flexDirection="row" alignItems="center" ml={2}>
            <TextField 
              label="Item Name" 
              variant="outlined" 
              value={itemName} 
              onChange={(e) => setItemName(e.target.value)} 
              style={{ marginRight: '10px' }}
            />
            <TextField 
              label="Item Quantity" 
              variant="outlined" 
              type="number"
              value={itemQuantity} 
              onChange={(e) => setItemQuantity(parseInt(e.target.value))} 
              style={{ marginRight: '10px' }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleAddItem}
            >
              Add
            </Button>
          </Box>
        )}
      </Box>
      <Box width="1650px" height="600px" bgcolor={theme.palette.background.paper} color={theme.palette.text.primary} p={4} borderRadius={2} boxShadow={3} overflow="auto">
        <Box display="flex" alignItems="center" mb={2}>
          <TextField 
            label="Search Items" 
            variant="outlined" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={{ marginRight: '10px', backgroundColor: 'white' }}
          />
          <IconButton color="primary" onClick={handleSearch}>
            <SearchIcon />
          </IconButton>
          <Select 
            value={sortOption} 
            onChange={handleSortChange} 
            style={{ marginLeft: '10px' }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="quantity">Quantity</MenuItem>
          </Select>
        </Box>
        <Typography variant="h4" color="primary" gutterBottom>Manage Your Inventory</Typography>
        <Stack spacing={2} width="100%">
          {sortedInventory.map(item => (
            <Box key={item.id} p={2} border={1} borderColor="grey.400" borderRadius={2} display="flex" justifyContent="space-between" alignItems="center" onClick={() => handleToggleDetails(item.id)}>
              <Box>
                <Typography variant="h6" color="textPrimary">{item.name}</Typography>
                <Typography variant="body1" color="textPrimary">Quantity: {item.quantity}</Typography>
                {expandedItemId === item.id && (
                  <Typography variant="body2" color="textSecondary">Additional details here</Typography>
                )}
              </Box>
              <Box display="flex" gap={1}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => handleUpdateQuantity(item.id, 1)}
                >
                  +1
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => handleUpdateQuantity(item.id, -1)}
                  disabled={item.quantity <= 0}
                >
                  -1
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
      <Typography 
        variant="body2" 
        color="textSecondary" 
        align="center" 
        style={{ position: 'absolute', bottom: 20, width: '100%' }}
      >
        Thank you for using my website
      </Typography>
    </Box>
  );
}

export default function Page() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Inventory />
    </SnackbarProvider>
  );
}
