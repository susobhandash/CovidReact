import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Paper from '@material-ui/core/Paper';
import { green, blue } from '@material-ui/core/colors';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import Typography from '@material-ui/core/Typography';

import CanvasJSReact from '../assets/canvasjs.react';
import {useService} from '../service/covidService';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const { useCallback } = React;

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    container: {
        // maxHeight: document.documentElement.clientHeight - 500,
        maxHeight: '50vh'
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      // width: 'calc(100vw - 17px)'
      width: (document.documentElement.clientWidth > 800 ? 'calc(800px - 17px)' : document.documentElement.clientWidth - 17)
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
      color: green[500]
    },
    green: {
      color: '#fff',
      backgroundColor: green[500],
      marginRight: 10,
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    stateNames: {
      display: 'flex',
      alignItems: 'center',
      color: blue[600],
      cursor: 'pointer',
      fontSize: '0.7rem'
    },
    sortLabel: {
      fontWeight: 600,
    },
    chartHolder: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      height: '43vh',
      padding: 10,
      overflow: 'hidden'
    },
    tableCellFont: {
      fontSize: '0.7rem'
    }
}));

const headCells = [
    { id: 'state', numeric: false, label: 'State', width: 140 },
    { id: 'active', numeric: true, label: 'Active', width: 80 },
    { id: 'confirmed', numeric: true, label: 'Confirm', width: 80 },
    { id: 'deaths', numeric: true, label: 'Death', width: 80 },
    { id: 'recovered', numeric: true, label: 'Recover', width: 80 },
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
              style={{ width: headCell.width }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
                className={classes.sortLabel}
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

export default function CovidDetails() {
    const classes = useStyles();
    const service = useService();
    const [stateData, setStateData] = useState([]);
    const [dailyCases, setDailyCases] = useState([]);
    const [dailyConfirmOpts, setDailyConfirmOpts] = useState({});
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const page = 0;
    const rowsPerPage = stateData.length;

    const getData = useCallback(() => {
        service.getData().then(async (res) => {
            const result  = await res.json();
            const dailyConfirmed = [], dailyDeceased = [], dailyRecovered = [];
            setStateData(result.statewise);
            setDailyCases(result.cases_time_series.slice(result.cases_time_series.length - 15, result.cases_time_series.length));
            const rawData = result.cases_time_series.slice(result.cases_time_series.length - 15, result.cases_time_series.length);
            rawData.forEach((el) => {
              dailyConfirmed.push({
                x: new Date(el['date'] + ' 2020'),
                y: Number(el['dailyconfirmed'])
              });
              dailyDeceased.push({
                x: new Date(el['date'] + ' 2020'),
                y: Number(el['dailydeceased'])
              });
              dailyRecovered.push({
                x: new Date(el['date'] + ' 2020'),
                y: Number(el['dailyrecovered'])
              });
            });
            
            setDailyConfirmOpts({
              animationEnabled: true,
              exportEnabled: true,
              theme: "light2", // "light1", "dark1", "dark2"
              height: document.documentElement.clientHeight * 0.42,
              axisY: {
                includeZero: false,
                gridThickness: 0,
                interval: 10000
              },
              axisX: {
                interval: 7,
                intervalType: "day",
              },
              data: [{
                type: "spline",
                markerSize: 0,
                lineThickness: 2,
                showInLegend: true,
                name: "Confirm Cases",
                toolTipContent: "Week {x}: # {y}",
                axisYIndex: 0,
                dataPoints: dailyConfirmed
              }, {
                type: "spline",
                markerSize: 0,
                lineThickness: 1,
                showInLegend: true,
                name: "Recovered Cases",
                toolTipContent: "Week {x}: # {y}",
                axisYIndex: 2,
                dataPoints: dailyRecovered
              }, {
                type: "spline",
                markerSize: 0,
                lineThickness: 2,
                showInLegend: true,
                name: "Deceased Cases",
                toolTipContent: "Week {x}: # {y}",
                axisYIndex: 1,
                dataPoints: dailyDeceased
              }]
            });
        });
        
    }, []);

    useEffect(() => {
      getData();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, stateData.length - page * rowsPerPage);

  return (
    <div>
      <div className={classes.chartHolder}>
        <CanvasJSChart options = {dailyConfirmOpts} />
		  </div>
      <TableContainer component={Paper} className={classes.container}>
        <Table stickyHeader className={classes.table} size="small" aria-label="sticky table">
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
                      
                      return (
                      <TableRow
                          hover
                          tabIndex={-1}
                          key={row.state}
                      >
                          {/* <TableCell component="th" id={labelId} scope="row">
                              {row.state}
                          </TableCell> */}
                          <TableCell align="left" className={row.state === 'Total' ? 'bold' : ''}>
                            <Typography className={classes.stateNames} color="textSecondary">
                              <Avatar className={classes.green}>
                                <SearchIcon fontSize="small"/>
                              </Avatar>
                              <span>{row.state}</span>
                            </Typography>
                          </TableCell>
                          <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>{row.active}</TableCell>
                          <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>{row.confirmed}</TableCell>
                          <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>{row.deaths}</TableCell>
                          <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>{row.recovered}</TableCell>
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
    </div>
  );
}