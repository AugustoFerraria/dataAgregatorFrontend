import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import { Grid, TablePagination } from '@mui/material';
import CustomizedTable from './CustomizedTable';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchClicked, setSearchClicked] = useState(false);

  const endpointMap = useMemo(() => {
    return {
      'Get Comune dose list': 'getComuneDoseList',
      'Get Totale prima dose': 'getTotalePrimaDose',
      'Get Totale seconda dose': 'getTotaleSecondaDose',
      'Get comuni ordinati per prima dose': 'getComuniOrdinatiPerPrimaDose',
      'Get comuni ordinati per seconda dose': 'getComuniOrdinatiPerSecondaDose',
      'Get comune con piu prima dose': 'getComuneConPiuPrimaDose',
      'Get comune con piu seconda dose': 'getComuneConPiuSecondaDose',
      'Get comune con meno prima dose': 'getComuneConMenoPrimaDose',
      'Get comune con meno seconda dose': 'getComuneConMenoSecondaDose',
      'scrivere Dati In Excel': 'scrivereDatiInExcel',
      'Queste pulsante non fare niente': '',
    };
  }, []);

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
  };

  const fetchData = () => {
    if (selectedAction) {
      setLoading(true);
      const endpoint = endpointMap[selectedAction];
  
      fetch(`http://localhost:8081/api/${endpoint}`)
        .then((response) => {
          if (response.headers.get('content-type').includes('application/json')) {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then((jsonData) => {
          // Convertir a un array si es un valor único
          let dataArray;
          if (typeof jsonData === 'object' && !Array.isArray(jsonData)) {
            dataArray = [jsonData];
          } else {
            dataArray = jsonData;
          }
          setData(dataArray);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (searchClicked) {
      fetchData();
      setSearchClicked(false); // Restablecer el estado para futuras búsquedas
    }
  }, [searchClicked, fetchData]);

  return (
    <div>
      <div className="option-box">
        <select value={selectedAction} onChange={handleActionChange}>
          <option value="">Select an action</option>
          {Object.keys(endpointMap).map((action, index) => (
            <option key={index} value={action}>
              {action}
            </option>
          ))}
        </select>
        <button onClick={handleSearchClick}>Search</button>
      </div>
      <Grid container>
        <Grid item xs={12}>
          {loading ? <p>Loading...</p> : null}
          {Array.isArray(data) ? (
            <CustomizedTable data={data.slice(page * rowsPerPage, (page + 1) * rowsPerPage)} />
          ) : (
            <div>
              {typeof data === 'number' || typeof data === 'string' ? (
                <p>Data: {data}</p>
              ) : (
                <p>No data to display.</p>
              )}
            </div>
          )}
        </Grid>
        <Grid item xs={12}>
          <TablePagination
            component="div"
            count={Array.isArray(data) ? data.length : 0}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
