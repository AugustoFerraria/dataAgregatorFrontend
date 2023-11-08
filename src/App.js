import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function App() {
  const [rowData, setRowData] = useState([]);
  const [selectedAction, setSelectedAction] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [error, setError] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(100);

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

  const columnDefs = useMemo(() => [
    { headerName: 'Comune', field: 'comune' },
    { headerName: 'Prima dose', field: 'dose1' },
    { headerName: 'Seconda dose', field: 'dose2' },
    { headerName: 'Booster', field: 'booster' },
    { headerName: 'Richiamo', field: 'richiamo' },
  ], []);

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
  };

  const handleSearchClick = () => {
    setSearchClicked(true);
  };

  useEffect(() => {
    if (searchClicked) {
      setError(null);

      const endpoint = endpointMap[selectedAction];

      fetch(`http://localhost:8081/api/${endpoint}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(`HTTP Error: ${response.status}`);
          }
        })
        .then((jsonData) => {
          let data = [];

          if (selectedAction === 'Get Totale prima dose') {
            data = [
              {
                comune: 'All',
                dose1: jsonData,
                dose2: null,
                booster: null,
                richiamo: null,
              },
            ];
          } else if (selectedAction === 'Get Totale seconda dose') {
            data = [
              {
                comune: 'All',
                dose1: null,
                dose2: jsonData,
                booster: null,
                richiamo: null,
              },
            ];
          } else {
            // Ensure jsonData is an array
            data = Array.isArray(jsonData) ? jsonData : [jsonData];
          }

          setRowData(data);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setError('Error fetching data. Please try again.');
        });

      setSearchClicked(false);
    }
  }, [searchClicked, selectedAction, endpointMap]);

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };

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
      <div
        className="ag-theme-alpine-dark"
        style={{ height: '650px', width: '100%' }}
      >
        <AgGridReact
          defaultColDef={{
            flex: 1,
            sortable: true,
            filter: true,
          }}
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={rowsPerPage}
          animateRows={true}
        />
      </div>
      <div className="rows-per-page-select">
        <label>Show rows per page:</label>
        <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;

