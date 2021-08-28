import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CovidDetails from "./components/stateWiseData.js";
import StateDetails from './components/stateDetails.js';
import districtData from './components/districtData.js';

// import { makeStyles } from '@material-ui/core/styles';
// import Paper from '@material-ui/core/Paper';

// const useStyles = makeStyles({
//   root: {
//     minWidth: 275,
//     width: '100%',
//     '> *': {
//       margin: '0 auto',
//     }
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 700
//   },
//   pos: {
//     marginBottom: 12,
//   },
// });

function App() {
  // const classes = useStyles();

  return (
    <Router> 
      <div className="App"> 
        {/* <ul> 
          <li> 
            <Link to="/">Home</Link> 
          </li> 
          <li> 
            <Link to="/about">About Us</Link> 
          </li>
        </ul>  */}
          <Switch> 
            <Route exact path='/' component={CovidDetails}></Route>
            <Route exact path='/StateDetails' component={StateDetails} />
            <Route exact paths='/Stats' component={districtData} /> 
          </Switch>
      </div> 
    </Router>
    // <div className="App">
    //   <Paper className={classes.root}>
    //     <CovidDetails/>
    //   </Paper>
    // </div>
  );
}

export default App;
