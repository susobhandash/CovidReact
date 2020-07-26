import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
// import StateDetails from './stateDetails.js';
import { Link } from 'react-router-dom';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import LineChartComp from './lineChartComp.js';


import { green, blue, grey } from '@material-ui/core/colors';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import Typography from '@material-ui/core/Typography';

import {useService} from '../service/covidService';

const { useCallback } = React;

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
    },
    container: {
        // maxHeight: '95vh'
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      width: '100%'
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
    },
    sortLabel: {
      fontWeight: 600,
    },
    chartHolder: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      // padding: 10,
      overflow: 'hidden'
    },
    tableCellFont: {
      fontSize: '0.8rem'
    },
    card: {
      height: '23vh',
      // minWidth: '30%',
      // marginRight: '5%'
    },
    gridRoot: {
      flexGrow: 1,
      margin: '0 auto'
    },
    tableHeaderDark: {
      backgroundColor: grey[300],
    },
    altRows: {
      '&:nth-of-type(odd)': {
        backgroundColor: '#f9f9f9',
      },
    },
}));

const headCells = [
    { id: 'state', numeric: false, label: 'State', width: 140 },
    { id: 'active', numeric: true, label: 'Active', width: 80 },
    { id: 'confirmed', numeric: true, label: 'Confirm', width: 80 },
    { id: 'recovered', numeric: true, label: 'Recover', width: 80 },
    { id: 'deaths', numeric: true, label: 'Death', width: 80 },
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
              className={classes.tableHeaderDark}
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
    const [dailyDeceasedOpts, setDailyDeceasedOpts] = useState({});
    const [dailyRecoveredOpts, setDailyRecoveredOpts] = useState({});
    // const [districtData, setDistrictData] = useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('name');
    const page = 0;
    const rowsPerPage = stateData.length;

    // const getDisrictData = useCallback(() => {
    //   service.getStateData().then(async (res) => {
    //     const result  = await res.json();
    //     setDistrictData(result);
    //   })
    // }, []);

    const getData = useCallback(() => {
        service.getData().then(async (res) => {
            const result  = await res.json();
            const dailyConfirmed = [], dailyDeceased = [], dailyRecovered = [];
            setStateData(result.statewise);
            console.log(stateData);
            setDailyCases(result.cases_time_series.slice(result.cases_time_series.length - 15, result.cases_time_series.length));
            const rawData = result.cases_time_series.slice(result.cases_time_series.length - 15, result.cases_time_series.length);
            let recoveredGraphData = {
              title: 'Recovered',
              labels: [],
              datasets: [{
                  data: [],
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(40, 167, 69, 0.565)',
                  hoverBackgroundColor: 'transparent',
                  borderWidth: 3,
                  barPercentage: 0.5,
                  pointBorderWidth: 1,
                  pointRadius: 2
              }]
            };
            let confirmedGraphData = {
              title: 'Confirmed',
              labels: [],
              datasets: [{
                  data: [],
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(255, 7, 58, 0.565)',
                  hoverBackgroundColor: 'transparent',
                  borderWidth: 3,
                  barPercentage: 0.5,
                  pointBorderWidth: 1,
                  pointRadius: 2
              }]
            };
            let deceasedGraphData = {
              title: 'Deceased',
              labels: [],
              datasets: [{
                  data: [],
                  backgroundColor: 'transparent',
                  borderColor: 'rgba(2, 27, 121, 0.565)',
                  hoverBackgroundColor: 'transparent',
                  borderWidth: 3,
                  barPercentage: 0.5,
                  pointBorderWidth: 1,
                  pointRadius: 2
              }]
            };
            rawData.forEach((el) => {
              confirmedGraphData.labels.push(el['date']);
              confirmedGraphData.datasets[0].data.push(el['dailyconfirmed']);
              // dailyConfirmed.push({
              //   x: new Date(el['date'] + ' 2020'),
              //   y: Number(el['dailyconfirmed'])
              // });
              deceasedGraphData.labels.push(el['date']);
              deceasedGraphData.datasets[0].data.push(el['dailydeceased']);
              // dailyDeceased.push({
              //   x: new Date(el['date'] + ' 2020'),
              //   y: Number(el['dailydeceased'])
              // });
              recoveredGraphData.labels.push(el['date']);
              recoveredGraphData.datasets[0].data.push(el['dailyrecovered']);
              // dailyRecovered.push({
              //   x: new Date(el['date'] + ' 2020'),
              //   y: Number(el['dailyrecovered'])
              // });
            });
            setDailyRecoveredOpts(recoveredGraphData);

            setDailyDeceasedOpts(deceasedGraphData);

            setDailyConfirmOpts(confirmedGraphData);
        });
        
    }, []);

    useEffect(() => {
      getData();
      // getDisrictData();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, stateData.length - page * rowsPerPage);

  return (
    <Grid container className={classes.gridRoot} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5" component="h5" className="focus-text-color mb-1">
          Covid India Cases
        </Typography>
        <Grid container justify="center" spacing={2}>
          <Grid xs={12} md={8} item>
            <TableContainer component={Paper} className={classes.container} spacing={2}>
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
                                className={classes.altRows}
                            >
                                {/* <TableCell component="th" id={labelId} scope="row">
                                    {row.state}
                                </TableCell> */}
                                <TableCell align="left" className={row.state === 'Total' ? 'bold' : ''}>
                                  <Typography className={classes.stateNames} color="secondary">
                                    {/* <Avatar className={classes.green}>
                                      <SearchIcon fontSize="small"/>
                                    </Avatar> */}
                                    <Link to={{
                                      pathname: '/StateDetails',
                                      state: {
                                        stateName: row.state,
                                        statecode: row.statecode
                                      }
                                    }}>
                                      {row.state}
                                    </Link>
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>
                                  <Typography className="align-center active-color">
                                    {row.active}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>
                                  <Typography className="align-center confirmed-light-color bold" variant="body2" component="p">
                                    <ArrowUpwardIcon fontSize="small"/>
                                    {row.deltaconfirmed}
                                  </Typography>
                                  <Typography className="confirmed-color">
                                    {row.confirmed}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>
                                  <Typography className="align-center recovered-light-color bold" variant="body2" component="p">
                                    <ArrowUpwardIcon fontSize="small"/>
                                    {row.deltarecovered}
                                  </Typography>
                                  <Typography className="recovered-color">
                                    {row.recovered}
                                  </Typography>
                                </TableCell>
                                <TableCell align="right" className={row.state === 'Total' ? 'bold' : classes.tableCellFont}>
                                  <Typography className="align-center death-light-color bold" variant="body2" component="p">
                                    <ArrowUpwardIcon fontSize="small"/>
                                    {row.deltadeaths}
                                  </Typography>
                                  <Typography className="death-color">
                                    {row.deaths}
                                  </Typography>
                                </TableCell>
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
          </Grid>
          <Grid xs={12} md={4} item>
            <Grid container className={classes.chartHolder} spacing={2}>
              <Grid xs={12} md={12} item>
                <Card className={classes.card}>
                  <CardContent>
                    <LineChartComp graphData={dailyConfirmOpts}/>
                  </CardContent>
                </Card>  
              </Grid>
              <Grid xs={12} md={12} item>
                <Card className={classes.card}>
                  <CardContent>
                    <LineChartComp graphData={dailyRecoveredOpts}/>
                  </CardContent>
                </Card>  
              </Grid>
              <Grid xs={12} md={12} item>
                <Card className={classes.card}>
                  <CardContent>
                    <LineChartComp graphData={dailyDeceasedOpts}/>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid item xs={12}>
        <DistrictData district={district} open={openModal} closeModal={closeModal}/>
      </Grid> */}
    </Grid>
  );
}