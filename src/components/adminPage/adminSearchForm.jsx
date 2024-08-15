//adminSearchForm.jsx
import React, {useState} from 'react';
import {TextField,Button,MenuItem,Select,FormControl,InputLabel,Box} from '@mui/material'; 

const SearchForm = ({onSearch}) => {
    const [searchCondition, setSearchCondition]=useState('');
    const [searchTerm,setSearchTerm] = useState('');

    const handleConditionChange = (event) => {
        setSearchCondition(event.target.value);
    };
    const handleTermChange= (event) => {
        setSearchTerm(event.target.value);
    };
    const handleSubmit = (event) => {
        event.preventDefault();
       onSearch(searchCondition,searchTerm);
    }
    return (
        <Box
        component="form"
        sx={{p:2, border: '1px solid grey', borderRadius: '5px',margin: '0 auto', maxWidth: 1000,backgroundColor:'white'}}
        onSubmit={handleSubmit}
        >
            <FormControl fullWidth sx={{mb:2,minWidth:120}}>
                <InputLabel>검색 조건</InputLabel>
                <Select
                    label="검색 조건"
                    value={searchCondition}
                    onChange={handleConditionChange}
                    >
                        <MenuItem value="email">이메일</MenuItem>
                        <MenuItem value="phonelastnumber4">핸드폰번호 마지막 4자리</MenuItem>
                    </Select>
            </FormControl>
            <TextField
            fullWidth
            label="검색어"
            variant="outlined"
            value={searchTerm}
            onChange={handleTermChange}
            sx={{ mb:2}}
            />
            <Box display="flex" justifyContent="right">
            <Button variant="contained" 
                    color="primary" 
                    type="submit"
                    sx={{
                        backgroundColor: '#4A90E2',
                        border: '2px solid #007bff',
                        width: '30%',
                        
                        '&:hover':{
                            backgroundColor: '#0056b3',
                            borderColor: '#0056b3',

                        },
                    }}>
                검색
            </Button>
        </Box>
        </Box>
    );
};

export default SearchForm;