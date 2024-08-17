//**adminRefundDetails.jsx */
import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button, Select, MenuItem } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function RefundDetails({ data, page, rowsPerPage, totalRows, onPageChange, onRowsPerPageChange }) {
    const [expanded, setExpanded] = useState(false);
    const [notes, setNotes] = useState({});

    const totalPages = Math.ceil(totalRows / rowsPerPage);

    const handleChangePage = (newPage) => {
        onPageChange(null, newPage);
    };

    const handleRowsPerPageChange = (event) => {
        onRowsPerPageChange(event);
        onPageChange(null, 0); // 페이지를 첫 페이지로 초기화
    };

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleNoteChange = (refundId, value) => {
        setNotes(prevNotes => ({
            ...prevNotes,
            [refundId]: value
        }));
    };

    const handleSaveNote = (refundId) => {
        console.log(`Note for ${refundId}:`, notes[refundId]);
        setNotes(prevNotes => ({
            ...prevNotes,
            [refundId]: notes[refundId] || ''
        }));
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Box sx={{ flexGrow: 1, overflow: 'auto', padding: '20px' }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>환불번호</TableCell>
                                <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>이메일</TableCell>
                                <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>환불일</TableCell>
                                <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>금액</TableCell>
                                <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>환불 상태</TableCell>
                                <TableCell sx={{ backgroundColor: '#4A90E2', color: 'white', fontWeight: 'bold' }}>처리 관리자</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                <React.Fragment key={row.refundId}>
                                    <TableRow>
                                        <TableCell>
                                            <Accordion expanded={expanded === row.refundId} onChange={handleChange(row.refundId)}>
                                                <AccordionSummary
                                                    expandIcon={<ExpandMoreIcon />}
                                                    aria-controls={`${row.refundId}-content`}
                                                    id={`${row.refundId}-header`}
                                                >
                                                    <Typography>{row.refundId}</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Typography variant="body2">
                                                        <strong>환불 사유:</strong> {row.reason || '사유 없음'}
                                                    </Typography>
                                                    <TextField
                                                        label="메모"
                                                        multiline
                                                        fullWidth
                                                        rows={3}
                                                        value={notes[row.refundId] || ''}
                                                        onChange={(e) => handleNoteChange(row.refundId, e.target.value)}
                                                        sx={{ mt: 2 }}
                                                    />
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary" 
                                                        onClick={() => handleSaveNote(row.refundId)}
                                                        sx={{ mt: 2 }}
                                                    >
                                                        메모 저장
                                                    </Button>
                                                </AccordionDetails>
                                            </Accordion>
                                        </TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>{row.refundDate}</TableCell>
                                        <TableCell>{row.amount}</TableCell>
                                        <TableCell>{row.status}</TableCell>
                                        <TableCell>{row.admin || 'N/A'}</TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 페이지네이션 컨트롤 */}
                <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(0)}
                        disabled={page === 0}
                        sx={{ marginRight: 2 }}
                    >
                        처음
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(page - 1)}
                        disabled={page === 0}
                        sx={{ marginRight: 2 }}
                    >
                        이전
                    </Button>
                    <span>{page + 1} / {totalPages}</span>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(page + 1)}
                        disabled={page >= totalPages - 1}
                        sx={{ marginLeft: 2 }}
                    >
                        다음
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => handleChangePage(totalPages - 1)}
                        disabled={page >= totalPages - 1}
                        sx={{ marginLeft: 2 }}
                    >
                        마지막
                    </Button>
                    <Select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        sx={{ marginLeft: 2 }}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={25}>25</MenuItem>
                    </Select>
                </Box>
            </Box>
        </Box>
    );
}