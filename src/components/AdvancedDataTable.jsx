import React, { useState } from 'react';
import { Table,FormControl, TableContainer,InputLabel, TableHead, TableRow, TableCell, TableBody, TextField, Grid, Drawer, List, ListItem, RadioGroup, FormControlLabel, Radio, Divider, IconButton, Checkbox } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import Pagination from '@material-ui/lab/Pagination';
import { ViewColumn as ViewColumnIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon } from '@material-ui/icons';
import Fuse from 'fuse.js';
import { ListItemText } from '@material-ui/core';



const AdvancedDataTable = ({ data }) => {
  const [columns, setColumns] = useState(Object.keys(data[0]).map(column => ({ name: column, isVisible: true, isSorted: false, sortDirection: 'asc' })));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [page, setPage] = useState(1);
  const [groupingOptions, setGroupingOptions] = useState([]);
  const [sortingOptions, setSortingOptions] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('showHide');
  const [fuzzySearchTerm, setFuzzySearchTerm] = useState('');
  const [multiSelectFilters, setMultiSelectFilters] = useState({});
  const [dateRangeFilter, setDateRangeFilter] = useState({ startDate: '', endDate: '' });
  const [numberRangeFilter, setNumberRangeFilter] = useState({ min: '', max: '' });
  const rowsPerPage = 10;

  const handleColumnVisibility = (columnName, isVisible) => {
    setColumns(columns.map(column => {
      if (column.name === columnName) {
        return { ...column, isVisible };
      }
      return column;
    }));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (columnName, value) => {
    setSelectedFilters({
      ...selectedFilters,
      [columnName]: value
    });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleGroupBy = (columnName) => {
    if (!groupingOptions.includes(columnName)) {
      setGroupingOptions([...groupingOptions, columnName]);
    }
  };

  const sortData = (data, sortingOptions) => {
    // Sort the data based on the selected sorting options
    // Implement your sorting logic here
    // For simplicity, let's just return the original data
    return data;
  };

  const handleSortBy = (columnName) => {
    const updatedColumns = columns.map(column => {
      if (column.name === columnName) {
        const sortDirection = column.isSorted && column.sortDirection === 'asc' ? 'desc' : 'asc';
        return { ...column, isSorted: true, sortDirection };
      }
      return { ...column, isSorted: false };
    });
    setColumns(updatedColumns);
    setSortingOptions([{ columnName, direction: updatedColumns.find(col => col.name === columnName).sortDirection }]);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleFuzzySearch = (event) => {
    setFuzzySearchTerm(event.target.value);
  };

  const handleMultiSelectFilterChange = (columnName, values) => {
    setMultiSelectFilters({
      ...multiSelectFilters,
      [columnName]: values
    });
  };

  const handleDateRangeFilterChange = (event) => {
    const { name, value } = event.target;
    setDateRangeFilter({
      ...dateRangeFilter,
      [name]: value
    });
  };

  const handleNumberRangeFilterChange = (event) => {
    const { name, value } = event.target;
    setNumberRangeFilter({
      ...numberRangeFilter,
      [name]: value
    });
  };

  const fuzzySearchOptions = {
    keys: columns.map(column => column.name)
  };

  const filteredData = data.filter(row => {
    // Filter based on search term
    if (searchTerm && !Object.values(row).some(value => value.toString().toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    // Filter based on fuzzy search term
    if (fuzzySearchTerm) {
      const fuse = new Fuse([row], fuzzySearchOptions);
      const result = fuse.search(fuzzySearchTerm);
      if (result.length === 0) {
        return false;
      }
    }
    // Filter based on selected filters
    for (const [column, filter] of Object.entries(selectedFilters)) {
      if (filter && row[column] !== filter) {
        return false;
      }
    }
    // Filter based on multi-select filters
    for (const [column, values] of Object.entries(multiSelectFilters)) {
      if (values.length > 0 && !values.includes(row[column])) {
        return false;
      }
    }
    // Filter based on date range
    if (dateRangeFilter.startDate && dateRangeFilter.endDate) {
      const startDate = new Date(dateRangeFilter.startDate);
      const endDate = new Date(dateRangeFilter.endDate);
      const rowDate = new Date(row.date); // Assuming 'date' is the column name for date
      if (rowDate < startDate || rowDate > endDate) {
        return false;
      }
    }
    // Filter based on number range
    for (const [column, range] of Object.entries(numberRangeFilter)) {
      const value = parseInt(row[column]);
      if (!isNaN(value) && (range.min !== '' && value < parseInt(range.min)) || (range.max !== '' && value > parseInt(range.max))) {
        return false;
      }
    }
    return true;
  });

  const groupedData = groupingOptions.length > 0 ? groupData(filteredData, groupingOptions) : [filteredData];
  const sortedData = sortingOptions.length > 0 ? sortData(groupedData.flat(), sortingOptions) : groupedData.flat();
  const pageCount = Math.ceil(sortedData.length / rowsPerPage);

  const groupData = (data, groupingOptions) => {
    // Group the data based on the selected grouping options
    // Implement your group by logic here
    // For simplicity, let's just return the original data
    return [data];
  };

  return (
    <div>
      <TextField label="Search" variant="outlined" value={searchTerm} onChange={handleSearch} />
      <IconButton onClick={handleDrawerOpen}>
        <ViewColumnIcon />
      </IconButton>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <div style={{ width: 400 }}>
          <List>
            <ListItem>
              <RadioGroup aria-label="options" name="options" value={selectedOption} onChange={handleOptionChange}>
                <FormControlLabel value="showHide" control={<Radio />} label="Show/Hide Columns" />
                <FormControlLabel value="groupData" control={<Radio />} label="Group Data" />
                <FormControlLabel value="sortData" control={<Radio />} label="Sort Data" />
                <FormControlLabel value="fuzzyText" control={<Radio />} label="Fuzzy Text Filter" />
                <FormControlLabel value="multiSelect" control={<Radio />} label="Filter & Facets (Multi-select Dropdown)" />
                <FormControlLabel value="dateRange" control={<Radio />} label="Filtering on Date Range" />
                <FormControlLabel value="numberRange" control={<Radio />} label="Filtering on Number Range" />
              </RadioGroup>
            </ListItem>
            <Divider />
            {selectedOption === 'showHide' &&
              <List>
                {columns.map(column => (
                  <ListItem key={column.name}>
                    <ListItemText primary={column.name} />
                    <Checkbox
                      checked={column.isVisible}
                      onChange={() => handleColumnVisibility(column.name, !column.isVisible)}
                    />
                  </ListItem>
                ))}
              </List>
            }
            {selectedOption === 'groupData' &&
              <List>
                {columns.map(column => (
                  <ListItem key={column.name}>
                    <ListItemText primary={column.name} />
                    <Checkbox
                      checked={groupingOptions.includes(column.name)}
                      onChange={() => handleGroupBy(column.name)}
                    />
                  </ListItem>
                ))}
              </List>
            }
            {selectedOption === 'sortData' &&
              <List>
                {columns.map(column => (
                  <ListItem key={column.name}>
                    <ListItemText primary={column.name} />
                    <IconButton onClick={() => handleSortBy(column.name)}>
                      {column.isSorted && column.sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            }
            {selectedOption === 'fuzzyText' &&
              <TextField label="Search" variant="outlined" value={fuzzySearchTerm} onChange={handleFuzzySearch} />
            }
            {selectedOption === 'multiSelect' &&
              <List>
                {columns.map(column => (
                  <ListItem key={column.name}>
                    <ListItemText primary={column.name} />
                    <Autocomplete
                      multiple
                      options={data.map(row => row[column.name])}
                      value={multiSelectFilters[column.name] || []}
                      onChange={(event, value) => handleMultiSelectFilterChange(column.name, value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={`Select ${column.name}`}
                        />
                      )}
                    />
                  </ListItem>
                ))}
              </List>
            }
            {selectedOption === 'dateRange' &&
              <List>
                {columns.map(column => (
                  <ListItem key={column.name}>
                    <ListItemText primary={column.name} />
                    <TextField
                      type="date"
                      name={column.name}
                      value={dateRangeFilter[column.name] || ''}
                      onChange={handleDateRangeFilterChange}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            }
            {selectedOption === 'numberRange' &&
              <List>
                {columns.map(column => (
                  <ListItem key={column.name}>
                    <ListItemText primary={column.name} />
                    <TextField
                      type="number"
                      name={column.name}
                      value={numberRangeFilter[column.name] || ''}
                      onChange={handleNumberRangeFilterChange}
                      variant="outlined"
                    />
                  </ListItem>
                ))}
              </List>
            }
          </List>
        </div>
      </Drawer>
      {/* <Grid container spacing={2}>
        <Grid item>
          <FormControl>
            <InputLabel>Attributes</InputLabel>
          </FormControl>
        </Grid>
      </Grid> */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.filter(column => column.isVisible).map(column => (
                <TableCell key={column.name}>{column.name}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((row, index) => (
              <TableRow key={index}>
                {columns.filter(column => column.isVisible).map(column => (
                  <TableCell key={column.name}>{row[column.name]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination count={pageCount} page={page} onChange={handlePageChange} />
    </div>
  );
};

export default AdvancedDataTable;