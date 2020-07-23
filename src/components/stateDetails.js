import React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

class StateDetails extends React.Component {
    state = {
        stateName: '',
        statecode: '',
        stateData: [],
        distdata: []
    }
    componentDidMount () {
        this.setState({stateName: this.props.location.state.stateName});
        this.setState({statecode: this.props.location.state.statecode});
        fetch(`https://api.covid19india.org/v4/data.json`)
            .then(async (res) => {
                const result =  await res.json();
                this.setState({stateData: result[this.state.statecode]});
                console.log(this.state.stateData);
                const stateData = result[this.state.statecode];
                const d = Object.keys(stateData.districts)
                const data = [];
                d.map((e,i,a) => {
                    const x = {};
                    x.name = e;
                    x.active = ((stateData.districts[e].total.confirmed ? stateData.districts[e].total.confirmed : 0) 
                                - (stateData.districts[e].total.deceased ? stateData.districts[e].total.deceased : 0) 
                                - (stateData.districts[e].total.recovered ? stateData.districts[e].total.recovered : 0));
                    x.confirmed = stateData.districts[e].total.confirmed ? stateData.districts[e].total.confirmed : 0;
                    x.deceased = stateData.districts[e].total.deceased ? stateData.districts[e].total.deceased : 0;
                    x.recovered = stateData.districts[e].total.recovered ? stateData.districts[e].total.recovered : 0;
                    x.deltaConfirmed = stateData.districts[e].delta && stateData.districts[e].delta.confirmed ? stateData.districts[e].delta.confirmed : 0;
                    x.deltaDeceased = stateData.districts[e].delta && stateData.districts[e].delta.deceased ? stateData.districts[e].delta.deceased : 0;
                    x.deltaRecovered = stateData.districts[e].delta && stateData.districts[e].delta.recovered ? stateData.districts[e].delta.recovered : 0;
                    x.population = stateData.districts[e].meta && stateData.districts[e].meta.population ? stateData.districts[e].meta.population : 0;

                    data.push(x);
                });
                this.setState({distdata: data});
            }
        );
    }
    render() {
        return(
            <Paper>
                <div className="state-details">
                    <div className="d-flex align-center">
                        <Link to={{
                            pathname: '/'
                        }}>
                            <IconButton color="secondary" aria-label="Back to Home Page" className="col">
                                <KeyboardBackspaceIcon fontSize="small"/>
                            </IconButton>
                        </Link>
                        <Typography variant="h5" component="h5" className="col focus-text-color">
                        {this.state.stateName} ({this.state.statecode})
                        </Typography>
                    </div>
                    <Grid container className="d-flex text-center" spacing={0}>
                        <Grid xs={12} md={4} item>
                            <Grid container className="no-gutters" spacing={2}>
                                <Grid xs={3} item>
                                    <div className="active-bg-hover br-5 text-center c-p p-2">
                                        <Typography variant="body2" component="p" className="active-color">
                                            Active
                                        </Typography>
                                        <Typography variant="body2" component="small" className="active-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData.delta?.confirmed ? this.state.stateData.delta?.confirmed : 0) 
                                                - (this.state.stateData.delta?.deceased ? this.state.stateData.delta?.deceased : 0) 
                                                - (this.state.stateData.delta?.recovered ? this.state.stateData.delta?.recovered : 0) 
                                                - (this.state.stateData.delta?.migrated ? this.state.stateData.delta?.migrated : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="active-color">
                                            {(this.state.stateData.total?.confirmed ? this.state.stateData.total?.confirmed : 0) 
                                                - (this.state.stateData.total?.deceased ? this.state.stateData.total?.deceased : 0) 
                                                - (this.state.stateData.total?.recovered ? this.state.stateData.total?.recovered : 0) 
                                                - (this.state.stateData.total?.migrated ? this.state.stateData.total?.migrated : 0)}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid xs={3} item>
                                    <div className="confirmed-bg-hover br-5 text-center c-p p-2">
                                        <Typography variant="body2" component="p" className="confirmed-color">
                                            Confirmed
                                        </Typography>
                                        <Typography variant="body2" component="small" className="confirmed-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData.delta?.confirmed ? this.state.stateData.delta?.confirmed : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="confirmed-color">
                                            {this.state.stateData.total?.confirmed}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid xs={3} item>
                                    <div className="recovered-bg-hover br-5 text-center c-p p-2">
                                        <Typography variant="body2" component="p" className="recovered-color">
                                            Recovered
                                        </Typography>
                                        <Typography variant="body2" component="small" className="recovered-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData.delta?.recovered ? this.state.stateData.delta?.recovered : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="recovered-color">
                                            {this.state.stateData.total?.recovered}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid xs={3} item>
                                    <div className="death-bg-hover br-5 text-center c-p p-2">
                                        <Typography variant="body2" component="p" className="death-color">
                                            Deceased
                                        </Typography>
                                        <Typography variant="body2" component="small" className="death-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData.delta?.deceased ? this.state.stateData.delta?.deceased : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="death-color">
                                            {this.state.stateData.total?.deceased}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container className="d-flex text-center align-center dist-data" spacing={0}>
                        <Grid xs={12} md={6} item className="pl-2">
                            <div className="d-flex text-left dist-header">
                                <Typography variant="body" component="h4" className="col-4">
                                    District
                                </Typography>
                                <Typography variant="body" component="h4" className="col active-color">
                                    Active
                                </Typography>
                                <Typography variant="body" component="h4" className="col confirmed-color">
                                    Confirm
                                </Typography>
                                <Typography variant="body" component="h4" className="col death-color">
                                    Deceased
                                </Typography>
                                <Typography variant="body" component="h4" className="col recovered-color">
                                    Recovered
                                </Typography>
                            </div>
                            {this.state.distdata.map((dist) => (
                                <div className="d-flex text-left dist-body">
                                    <div className="align-center col-4 d-inline-flex">
                                        <Typography variant="body" component="h4">
                                            {dist.name}
                                        </Typography>
                                    </div>
                                    <div className="align-center col d-inline-flex active-bg active-bg-hover">
                                        <Typography variant="body" component="h4" className="active-color">
                                            {dist.active}
                                        </Typography>
                                    </div>
                                    <div className="col confirmed-bg confirmed-bg-hover">
                                        <Typography variant="body2" component="small" className="confirmed-light-color d-flex align-center">
                                            <ArrowUpwardIcon fontSize="small"/> {dist.deltaConfirmed}
                                        </Typography>
                                        <Typography variant="body" component="h4" className="confirmed-color">
                                            {dist.confirmed}
                                        </Typography>
                                    </div>
                                    <div className="col death-bg death-bg-hover">
                                        <Typography variant="body2" component="small" className="death-light-color d-flex align-center">
                                            <ArrowUpwardIcon fontSize="small"/> {dist.deltaDeceased}
                                        </Typography>
                                        <Typography variant="body" component="h4" className="death-color">
                                            {dist.deceased}
                                        </Typography>
                                    </div>
                                    <div className="col recovered-bg recovered-bg-hover">
                                        <Typography variant="body2" component="small" className="recovered-light-color d-flex align-center">
                                            <ArrowUpwardIcon fontSize="small"/> {dist.deltaRecovered}
                                        </Typography>
                                        <Typography variant="body" component="h4" className="recovered-color">
                                            {dist.recovered}
                                        </Typography>
                                    </div>
                                    {/* <Typography className="col">
                                        {dist.population}
                                    </Typography> */}
                                </div>
                            ))}
                        </Grid>
                    </Grid>
                </div>
            </Paper>
        );
    }
}

export default StateDetails;