import React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function CustomizedTable({ data }) {
  if (Array.isArray(data)) {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Comune</TableCell>
              <TableCell align="right">Prima Dose</TableCell>
              <TableCell align="right">Seconda Dose</TableCell>
              <TableCell align="right">Booster</TableCell>
              <TableCell align="right">Richiamo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {row.comune}
                </TableCell>
                <TableCell align="right">{row.dose1}</TableCell>
                <TableCell align="right">{row.dose2}</TableCell>
                <TableCell align="right">{row.booster}</TableCell>
                <TableCell align="right">{row.richiamo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else if (typeof data === 'object') {
    return (
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
          </TableHead>
          <TableBody>
            {Object.entries(data).map(([key, value], index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {key}
                </TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    return null;
  }
}

export default CustomizedTable;

