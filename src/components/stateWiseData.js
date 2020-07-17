import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import PropTypes from 'prop-types';

import {useService} from '../service/covidService';


const { useCallback } = React;

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    container: {
        maxHeight: 600,
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
}));

const headCells = [
    { id: 'state', numeric: false, label: 'State Name' },
    { id: 'active', numeric: true, label: 'Active' },
    { id: 'confirmed', numeric: true, label: 'Confirmed' },
    { id: 'deaths', numeric: true, label: 'Deaths' },
    { id: 'recovered', numeric: true, label: 'Recovered' },
];

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function descendingComparator(a, b, orderBy) {
    if (orderBy !== 'state') {
        if (Number(b[orderBy]) < Number(a[orderBy])) {
            return -1;
        }
        if (Number(b[orderBy]) > Number(a[orderBy])) {
            return 1;
        }
        return 0;
    } else {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    }
}
  
function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding='default'
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
  
  EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
  };

export default function SimpleTable() {
    const classes = useStyles();
    const service = useService();
    const [stateData, setStateData] = useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const page = 0;
    const rowsPerPage = 40;

    const getData = useCallback(() => {
        // e.preventDefault();s
        service.getData().then(async (res) => {
            const result  = await res.json();
            setStateData(result.statewise);
        });
        
    }, [service]);

    // eslint-disable-next-line
    const data = getData();

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, stateData.length - page * rowsPerPage);

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader className={classes.table} size="small" aria-label="simple table">
        <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
        />
        <TableBody>
            {stableSort(stateData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                    <TableRow
                        hover
                        tabIndex={-1}
                        key={row.state}
                    >
                        <TableCell component="th" id={labelId} scope="row">
                            {row.state}
                        </TableCell>
                        <TableCell align="right">{row.active}</TableCell>
                        <TableCell align="right">{row.confirmed}</TableCell>
                        <TableCell align="right">{row.deaths}</TableCell>
                        <TableCell align="right">{row.recovered}</TableCell>
                    </TableRow>
                    );
                })}
                {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                    <TableCell colSpan={6} />
                </TableRow>
            )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}