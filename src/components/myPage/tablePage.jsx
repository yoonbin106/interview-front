import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
  // 새로운 스타일 추가
  '&.first-column': {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    
  },
  width: '150px',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
//   '&:nth-of-type(odd)': {
//     backgroundColor: theme.palette.action.hover,
//   },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  
}));



export default function Tables() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableBody>
          <StyledTableRow>
            <StyledTableCell align="center" component="th" scope="row" className="first-column">Calories</StyledTableCell>
            <StyledTableCell>test</StyledTableCell>
            <StyledTableCell align="center" component="th" scope="row" className="first-column">Calories</StyledTableCell>
            <StyledTableCell>test</StyledTableCell>
            <StyledTableCell align="center" component="th" scope="row" className="first-column">Calories</StyledTableCell>
            <StyledTableCell>test</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell align="center" component="th" scope="row" className="first-column">Fat (g)</StyledTableCell>
            <StyledTableCell colSpan={5}> AAA</StyledTableCell>
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell align="center" component="th" scope="row" className="first-column">Carbs (g)</StyledTableCell>
            
            <StyledTableCell colSpan={5}> AAA</StyledTableCell>
            
          </StyledTableRow>
          <StyledTableRow>
            <StyledTableCell align="center" component="th" scope="row" className="first-column">Protein (g)</StyledTableCell>
            <StyledTableCell colSpan={5}> AAA</StyledTableCell>
          </StyledTableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}