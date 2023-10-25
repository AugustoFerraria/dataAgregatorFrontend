import React, { useState } from 'react';
import './App.css';
import CustomizedTable from './CustomizedTable';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');

  const endpointMap = {
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

  const handleActionChange = (e) => {
    setSelectedAction(e.target.value);
  };

  const fetchData = () => {
    if (selectedAction) {
      setLoading(true);

      const endpoint = endpointMap[selectedAction];

      fetch(`http://localhost:8081/api/${endpoint}`)
        .then((response) => response.text())
        .then((jsonData) => {
          try {
            const parsedData = JSON.parse(jsonData);
            setData(parsedData);
          } catch (error) {
            setData(jsonData); // Set as a string if not JSON
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <div className='option-box'>
        <select value={selectedAction} onChange={handleActionChange}>
          <option value="">Select an action</option>
          {Object.keys(endpointMap).map((action, index) => (
            <option key={index} value={action}>
              {action}
            </option>
          ))}
        </select>
        <button onClick={fetchData}>Search</button>
      </div>
      <div>
        {loading ? <p>Loading...</p> : null}
        {typeof data === 'object' ? (
          <CustomizedTable data={data} />
        ) : (
          <div>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
