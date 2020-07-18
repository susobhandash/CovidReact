import React from 'react';
// import logo from './logo.svg';
import './App.css';
import CovidDetails from "./components/stateWiseData.js";

import { makeStyles } from '@material-ui/core/styles';
// import Card from '@material-ui/core/Card';
// import CardActions from '@material-ui/core/CardActions';
// import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    maxWidth: 800,
  },
  title: {
    fontSize: 18,
    fontWeight: 700
  },
  pos: {
    marginBottom: 12,
  },
});

function App() {
  const classes = useStyles();

  return (
    <div className="App">
      <Paper className={classes.root}>
        <CovidDetails/>
      </Paper>
    </div>
  );
}

export default App;
