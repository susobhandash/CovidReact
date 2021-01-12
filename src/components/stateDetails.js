import React from 'react';
import { Link } from 'react-router-dom';
import BarChartComp from './chartComp.js';
import LineChartComp from './lineChartComp.js';

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import InfoIcon from '@material-ui/icons/Info';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';

class StateDetails extends React.Component {
    state = {
        stateName: '',
        statecode: '',
        stateData: [],
        distdata: [],
        historyData: {},
        selectedFilter: 'confirmed',
        graphData: {},
        deltaGraphData: {}
    }
    componentDidMount () {
        if (this.props.location && this.props.location.state)
            this.loadInitialData(this.props.location.state.stateName, this.props.location.state.statecode, this.props.location.state.statedata);
    }

    loadInitialData = (stateName, stateCode, stateData) => {
        this.setState({stateName: stateName});
        this.setState({statecode: stateCode});
        this.setState({statesdata: stateData});

        this.getPrevState(stateCode, true);
        this.getPrevState(stateCode, false);
        
        fetch(`https://api.covid19india.org/v4/data.json`)
            .then(async (res) => {
                const result =  await res.json();
                this.setState({stateData: result[this.state.statecode]});
                console.log(this.state);
                const stateData = result[this.state.statecode];
                const d = stateData && stateData.districts ? Object.keys(stateData.districts) : null;
                const data = [];
                if (d) {
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
    
                        return data.push(x);
                    });
                }
                this.setState({distdata: data});
            }
        );
        fetch('https://api.covid19india.org/v4/timeseries.json')
            .then(async (res) => {
                const result = await res.json();
                if (result[this.state.statecode]) {
                    const data = result[this.state.statecode].dates;
                    // this.setState({historyData: result[this.state.statecode]});
                    const date = new Date();
                    const dates = [];
                    for (let i=0; i<7; i++) {
                        const dataItem = {
                            date: '',
                            total: {},
                            delta: {}
                        };
                        const dateToSet = new Date(date.setDate(date.getDate() - 1));
                        const desiredYear = dateToSet.getFullYear();
                        const desiredMonth = (dateToSet.getMonth()+1).toString().length === 1 ? '0' + (dateToSet.getMonth()+1) : dateToSet.getMonth()+1;
                        const desiredDate = (dateToSet.getDate()).toString().length === 1 ? '0' + (dateToSet.getDate()) : dateToSet.getDate();
                        const desiredFullDate = desiredYear + '-' + desiredMonth + '-' + desiredDate;
                        dataItem.date = desiredFullDate;
                        if (data[desiredFullDate]) {
                            dataItem.total = data[desiredFullDate].total;
                            dataItem.delta = data[desiredFullDate].delta;
                            dates.push(dataItem);
                        }
                    }
                    // dates.sort();
                    dates.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0)); 
                    this.setState({historyData: dates});
                    this.populateGraphData();
                    this.populateDeltaGraphData();
                }
            }
        );
    }

    populateDeltaGraphData = () => {
        let graphDataItem = {
            title: 'new cases: ' + this.state.selectedFilter,
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: '',
                borderColor: '',
                hoverBackgroundColor: '',
                borderWidth: 0,
                barPercentage: 0.5,
            }]
        };
        
        this.state.historyData.forEach((el) => {
            if (el.delta) {
                graphDataItem.labels.push(el.date);
                graphDataItem.datasets[0].data.push(el.delta[this.state.selectedFilter]);
            }
        });
        
        graphDataItem.datasets[0].borderWidth = 0;
        graphDataItem.datasets[0].barPercentage = 0.5;
        if (this.state.selectedFilter === 'confirmed') {
            graphDataItem.datasets[0].backgroundColor = 'rgba(255, 7, 58, 0.25)';
            graphDataItem.datasets[0].borderColor = '#ff073a';
            graphDataItem.datasets[0].hoverBackgroundColor = 'rgba(255, 7, 58, 1)';
        } else if (this.state.selectedFilter === 'deceased') {
            graphDataItem.datasets[0].backgroundColor = 'rgba(108, 117, 125, 0.25)';
            graphDataItem.datasets[0].borderColor = '#6c757d';
            graphDataItem.datasets[0].hoverBackgroundColor = 'rgba(108, 117, 125, 1)';
        } else {
            graphDataItem.datasets[0].backgroundColor = 'rgba(40, 167, 69, 0.25)';
            graphDataItem.datasets[0].borderColor = '#28a745';
            graphDataItem.datasets[0].hoverBackgroundColor = 'rgba(40, 167, 69, 1)';
        }
        
        this.setState({deltaGraphData: graphDataItem});
    }

    populateGraphData = () => {
        let graphDataItem = {
            title: 'total cases: ' + this.state.selectedFilter,
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: 'transparent',
                borderColor: '',
                hoverBackgroundColor: 'transparent',
                borderWidth: 3,
                barPercentage: 0.5,
                pointBorderWidth: 4,
                pointRadius: 3
            }]
        };

        let borderColor = '';
        this.state.historyData.forEach((el) => {
            graphDataItem.labels.push(el.date);
            if (this.state.selectedFilter === 'confirmed') {
                graphDataItem.datasets[0].data.push(el.total[this.state.selectedFilter]);
            } else {
                let data = parseFloat((el.total[this.state.selectedFilter]/el.total['confirmed'])*100).toFixed(2);
                graphDataItem.datasets[0].data.push(data);
            }
            
        });
        if (this.state.selectedFilter === 'confirmed') {
            borderColor = '#ff073a';
        } else if (this.state.selectedFilter === 'deceased') {
            borderColor = '#6c757d';
        } else {
            borderColor = '#28a745';
        }
        graphDataItem.datasets[0].borderColor = borderColor;
        this.setState({graphData: graphDataItem});
    }

    getPrevState = (code, prev) => {
        let idx = 10;
        let length = 38;
        if(this.state.statesdata) {
            length = this.state.statesdata.length;
            this.state.statesdata.filter((el, i, a) => {
                if(el.statecode == code) {
                    if (prev) {
                        idx = i !== 0 ? (i-1) : length - 1;
                    } else {
                        idx = i+1 < length ? (i+1 == 36 ? 37 : i+1) : 1;
                    }
                }
            });
        }

        return idx;
    }

    getFormattedDate(date) {
        if (date) {
            const dateString = date.toString();

            const ISO_8601_re = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|[\+-]\d{2}(?::\d{2})?)$/,
                m = dateString.match(ISO_8601_re);

                let year = +m[1],
                month = +m[2],
                dayOfMonth = +m[3],
                hour = +m[4],
                minute = +m[5],
                second = +m[6],
                timezone = m[8];

            let timesZones = [''];
            timesZones = timezone.split(':');
            timesZones =  +(timesZones[0][0]+'1') * (60*(+timesZones[0].slice(1)) + (+timesZones[1] || 0));

            // your prefered way to construct
            const myDate = new Date();
            myDate.setUTCFullYear(year);
            myDate.setUTCMonth(month - 1);
            myDate.setUTCDate(dayOfMonth);
            myDate.setUTCHours(hour);
            myDate.setUTCMinutes(minute + timesZones); // timezone offset set here, after hours
            myDate.setUTCSeconds(second);

            let currentDate = new Date(myDate);
            let formattedDate = currentDate.getDate();
            let formattedMonth = currentDate.getMonth() + 1;
            let formattedYear = currentDate.getYear() + 1900;
            let formattedHour = currentDate.getHours();
            let formattedMinute = currentDate.getMinutes().toString();
            let formattedDay = currentDate.toString().slice(0, 3);

            return formattedDay +', '+ formattedDate +'/'+ formattedMonth +'/'+ formattedYear+', '+formattedHour+':'+ (formattedMinute.length === 1 ? '0'+formattedMinute : formattedMinute);
        } else {
            return '';
        }
    }

    render() {
        return(
            <Paper>
                <div className="state-details">
                    <div className="d-flex align-center details-header MuiPaper-elevation1">
                        <Link to={{
                            pathname: '/'
                        }}>
                            <Tooltip title="Back to Home Page" placement="right">
                                <Fab size="small" color="primary" className="col">
                                    <KeyboardBackspaceIcon fontSize="small"/>
                                </Fab>
                            </Tooltip>
                        </Link>
                        <Typography variant="h5" component="h5" className="col focus-text-color states-holder">
                        <Link
                                onClick={() => {
                                    const state = {
                                        stateName: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, true)]['state'] : 'NA',
                                        statecode: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, true)]['statecode'] : 'NA',
                                        statedata: this.state.statesdata
                                    }
                                    this.loadInitialData(state.stateName, state.statecode, state.statedata)
                                }}
                                to={{
                                    pathname: '/StateDetails',
                                    state: {
                                        stateName: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, true)]['state'] : 'NA',
                                        statecode: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, true)]['statecode'] : 'NA',
                                        statedata: this.state.statesdata
                                    }
                                }}>
                                {this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, true)]['state'] : 'NA'}
                            </Link>
                            <span>{this.state.stateName} ({this.state.statecode})</span>
                            <Link
                                onClick={() => {
                                    const state = {
                                        stateName: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, false)]['state'] : 'NA',
                                        statecode: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, false)]['statecode'] : 'NA',
                                        statedata: this.state.statesdata
                                    }
                                    this.loadInitialData(state.stateName, state.statecode, state.statedata)
                                }}
                                to={{
                                    pathname: '/StateDetails',
                                    state: {
                                        stateName: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, false)]['state'] : 'NA',
                                        statecode: this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, false)]['statecode'] : 'NA',
                                        statedata: this.state.statesdata
                                    }
                                }}>
                                {this.state && this.state.statesdata && this.state.statesdata.length > 0 ? this.state.statesdata[this.getPrevState(this.state.statecode, false)]['state'] : 'NA'}
                            </Link>
                        </Typography>
                    </div>
                    <Grid container className="d-flex text-center" spacing={0}>
                        <Grid xs={12} md={6} item>
                            <Grid container className="no-gutters" spacing={2}>
                                <Grid xs={3} item>
                                    <div className="active-bg-hover br-5 text-center c-p p-2">
                                        <Typography variant="body2" component="h6" className="active-color">
                                            Active
                                        </Typography>
                                        <Typography variant="body2" component="small" className="active-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData?.delta?.confirmed ? this.state.stateData.delta?.confirmed : 0) 
                                                - (this.state.stateData?.delta?.deceased ? this.state.stateData.delta?.deceased : 0) 
                                                - (this.state.stateData?.delta?.recovered ? this.state.stateData.delta?.recovered : 0) 
                                                - (this.state.stateData?.delta?.migrated ? this.state.stateData.delta?.migrated : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="active-color">
                                            {(this.state.stateData?.total?.confirmed ? this.state.stateData.total?.confirmed : 0) 
                                                - (this.state.stateData?.total?.deceased ? this.state.stateData.total?.deceased : 0) 
                                                - (this.state.stateData?.total?.recovered ? this.state.stateData.total?.recovered : 0) 
                                                - (this.state.stateData?.total?.migrated ? this.state.stateData.total?.migrated : 0)}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid xs={3} item>
                                    <div className={`confirmed-bg-hover br-5 text-center c-p p-2 ${this.state.selectedFilter === 'confirmed' ? "confirmed-bg" : ""}`}
                                        onClick={() => {
                                            this.setState({
                                                selectedFilter: 'confirmed',
                                            }, function () {
                                                this.populateGraphData();
                                                this.populateDeltaGraphData();
                                            }.bind(this));
                                        }} >
                                        <Typography variant="body2" component="h6" className="confirmed-color">
                                            Confirmed
                                        </Typography>
                                        <Typography variant="body2" component="small" className="confirmed-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData?.delta?.confirmed ? this.state.stateData.delta?.confirmed : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="confirmed-color">
                                            {this.state.stateData?.total?.confirmed}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid xs={3} item>
                                    <div className={`recovered-bg-hover br-5 text-center c-p p-2 ${this.state.selectedFilter === 'recovered' ? "recovered-bg" : ""}`}
                                        onClick={() => {
                                            this.setState({
                                                selectedFilter: 'recovered',
                                            }, function () {
                                                this.populateGraphData();
                                                this.populateDeltaGraphData();
                                            }.bind(this));
                                        }} >
                                        <Typography variant="body2" component="h6" className="recovered-color">
                                            Recovered
                                        </Typography>
                                        <Typography variant="body2" component="small" className="recovered-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData?.delta?.recovered ? this.state.stateData.delta?.recovered : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="recovered-color">
                                            {this.state.stateData?.total?.recovered}
                                        </Typography>
                                    </div>
                                </Grid>
                                <Grid xs={3} item>
                                    <div className={`death-bg-hover br-5 text-center c-p p-2 ${this.state.selectedFilter === 'deceased' ? "death-bg" : ""}`}
                                        onClick={() => {
                                            this.setState({
                                                selectedFilter: 'deceased',
                                            }, function () {
                                                this.populateGraphData();
                                                this.populateDeltaGraphData();
                                            }.bind(this));
                                        }} >
                                        <Typography variant="body2" component="h6" className="death-color">
                                            Deceased
                                        </Typography>
                                        <Typography variant="body2" component="small" className="death-light-color align-center">
                                            <ArrowUpwardIcon fontSize="small"/>
                                            {(this.state.stateData?.delta?.deceased ? this.state.stateData.delta?.deceased : 0)}
                                        </Typography>
                                        <Typography variant="h6" component="h1" className="death-color">
                                            {this.state.stateData?.total?.deceased}
                                        </Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container className="d-flex text-center dist-data" spacing={0}>
                        <Grid xs={12} md={4} item className="mt--2">
                            <div className="p-2 mt--2">
                                <Grid container className="d-flex text-center dist-data" spacing={0}>
                                    <Grid xs={12} md={12} item>
                                        <Typography className="focus-text-color" variant="h6" component="strong">
                                            case percentages
                                        </Typography>
                                    </Grid>
                                    <Grid xs={4} md={4} item className="p-2">
                                        <div className="active-bg pt-1 pb-1 br-5">
                                            <Typography className="active-color" variant="body2" component="small">
                                                Active
                                            </Typography>
                                            <Tooltip title="(Total Active / Total Confirmed) * 100" placement="top">
                                                <Typography className="active-color" variant="body2" component="h6">
                                                    {
                                                        Math.round((((this.state.stateData?.total?.confirmed ? this.state.stateData.total?.confirmed : 0) 
                                                        - (this.state.stateData?.total?.deceased ? this.state.stateData.total?.deceased : 0) 
                                                        - (this.state.stateData?.total?.recovered ? this.state.stateData.total?.recovered : 0) 
                                                        - (this.state.stateData?.total?.migrated ? this.state.stateData.total?.migrated : 0)) / this.state.stateData?.total?.confirmed) * 100)
                                                    } %
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    </Grid>
                                    <Grid xs={4} md={4} item className="p-2">
                                        <div className="recovered-bg pt-1 pb-1 br-5">
                                            <Typography className="recovered-color" variant="body2" component="small">
                                                Recovered
                                            </Typography>
                                            <Tooltip title="(Total Recovered / Total Confirmed) * 100" placement="top">
                                                <Typography className="recovered-color" variant="body2" component="h6">
                                                    {
                                                        Math.round(((this.state.stateData?.total?.recovered ? this.state.stateData.total?.recovered : 0) / this.state.stateData?.total?.confirmed) * 100)
                                                    } % 
                                                    {/* {this.state.stateData.meta?.population} */}
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    </Grid>
                                    <Grid xs={4} md={4} item className="p-2">
                                        <div className="death-bg pt-1 pb-1 br-5">
                                            <Typography className="death-color" variant="body2" component="small">
                                                Deceased
                                            </Typography>
                                            <Tooltip title="(Total Deceased / Total Confirmed) * 100" placement="top">
                                                <Typography className="death-color" variant="body2" component="h6">
                                                    {
                                                        Math.round(((this.state.stateData?.total?.deceased ? this.state.stateData.total?.deceased : 0)  / this.state.stateData?.total?.confirmed) * 100)
                                                    } %
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    </Grid>
                                </Grid>
                                <Grid container className="d-flex text-center dist-data" spacing={0}>
                                    <Grid xs={12} md={12} item>
                                        <Typography className="focus-text-color" variant="h6" component="strong">
                                            per 10,00,000 population
                                        </Typography>
                                    </Grid>
                                    <Grid xs={6} md={3} item className="p-2 pb-0">
                                        <div className="active-bg pt-1 pb-1 br-5">
                                            <Typography className="active-color" variant="body2" component="small">
                                                Active
                                            </Typography>
                                            <Tooltip title="(Total Confirmed / State Population) * 100000" placement="top">
                                                <Typography className="active-color" variant="body2" component="h6">
                                                {
                                                    Math.round((((this.state.stateData?.total?.confirmed ? this.state.stateData.total?.confirmed : 0) 
                                                    - (this.state.stateData?.total?.deceased ? this.state.stateData.total?.deceased : 0) 
                                                    - (this.state.stateData?.total?.recovered ? this.state.stateData.total?.recovered : 0) 
                                                    - (this.state.stateData?.total?.migrated ? this.state.stateData.total?.migrated : 0)) / this.state.stateData?.meta?.population) * 1000000)
                                                }
                                                {/* {this.state.stateData.meta?.population} */}
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    </Grid>
                                    <Grid xs={6} md={3} item className="p-2 pb-0">
                                        <div className="confirmed-bg pt-1 pb-1 br-5">
                                            <Typography className="confirmed-color" variant="body2" component="small">
                                                Confirmed
                                            </Typography>
                                            <Tooltip title="(Total Confirmed / State Population) * 100000" placement="top">
                                                <Typography className="confirmed-color" variant="body2" component="h6">
                                                    {Math.round(( this.state.stateData?.total?.confirmed / this.state.stateData?.meta?.population) * 1000000)}
                                                    {/* {this.state.stateData.total?.confirmed} */}
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    </Grid>
                                    <Grid xs={6} md={3} item className="p-2 pb-0">
                                        <div className="recovered-bg pt-1 pb-1 br-5">
                                            <Typography className="recovered-color" variant="body2" component="small">
                                                Recovered
                                            </Typography>
                                            <Tooltip title="(Total Recovered / State Population) * 100000" placement="top">
                                                <Typography className="recovered-color" variant="body2" component="h6">
                                                    {Math.round((this.state.stateData?.total?.recovered / this.state.stateData?.meta?.population) * 1000000)} 
                                                    {/* {this.state.stateData.total?.recovered} */}
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    </Grid>
                                    <Grid xs={6} md={3} item className="p-2 pb-0">
                                        <div className="death-bg pt-1 pb-1 br-5">
                                            <Typography className="death-color" variant="body2" component="small">
                                                Deceased
                                            </Typography>
                                            <Tooltip title="(Total Deceased / State Population) * 100000" placement="top">
                                                <Typography className="death-color" variant="body2" component="h6">
                                                    {Math.round((this.state.stateData?.total?.deceased / this.state.stateData?.meta?.population) * 1000000)} 
                                                    {/* {this.state.stateData.total?.deceased} */}
                                                </Typography>
                                            </Tooltip>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                            <div className="mt--2">
                                <BarChartComp graphData={this.state.deltaGraphData}/>
                            </div>
                            <div className="mt--2">
                                <LineChartComp graphData={this.state.graphData} showLabels="true"/>
                                {/* <BarChartComp graphData={this.state.graphData}/> */}
                            </div>
                            <div className="p-2">
                                <div className="br-5 focus-text-bg p-2">
                                    <Typography className="focus-text-color text-left" variant="h6" component="strong">
                                        Notes
                                    </Typography>
                                    <Typography className="focus-text-color break-spaces text-left" variant="body2" component="p">
                                        {this.state.stateData?.meta?.notes}
                                    </Typography>
                                </div>
                            </div>
                            <div className="mt--1 text-left pl-2 pb-2">
                                <Typography className="active-color d-flex align-center" variant="body2" component="p">
                                    <InfoIcon className="pr-1"/>
                                    Updated as on <b>&nbsp;&nbsp;{this.getFormattedDate(this.state.stateData?.meta?.last_updated)}</b>
                                </Typography>
                            </div>
                        </Grid>
                        <Grid xs={12} md={8} item className="pl-2 district-grids">
                            <div className="d-flex text-left dist-header">
                                <Typography variant="body1" component="h4" className="col-4">
                                    District
                                </Typography>
                                <Typography variant="body1" component="h4" className="col active-color">
                                    Active
                                </Typography>
                                <Typography variant="body1" component="h4" className="col confirmed-color">
                                    Confirm
                                </Typography>
                                <Typography variant="body1" component="h4" className="col recovered-color">
                                    Recovered
                                </Typography>
                                <Typography variant="body1" component="h4" className="col death-color">
                                    Deceased
                                </Typography>
                            </div>
                            {this.state.distdata.map((dist) => (
                                <div className="d-flex text-left dist-body" key={dist.name}>
                                    <div className="align-center col-4 d-inline-flex">
                                        <Tooltip title={dist.name} placement="right">
                                            <Typography variant="body1" component="h4">
                                                {dist.name}
                                            </Typography>
                                        </Tooltip>
                                    </div>
                                    <div className="align-center col d-inline-flex active-bg active-bg-hover">
                                        <Typography variant="body1" component="h4" className="active-color">
                                            {dist.active}
                                        </Typography>
                                    </div>
                                    <div className="col confirmed-bg confirmed-bg-hover">
                                        <Typography variant="body2" component="small" className="confirmed-light-color d-flex align-center bold">
                                            <ArrowUpwardIcon fontSize="small"/> {dist.deltaConfirmed}
                                        </Typography>
                                        <Typography variant="body1" component="h4" className="confirmed-color">
                                            {dist.confirmed}
                                        </Typography>
                                    </div>
                                    <div className="col recovered-bg recovered-bg-hover">
                                        <Typography variant="body2" component="small" className="recovered-light-color d-flex align-center bold">
                                            <ArrowUpwardIcon fontSize="small"/> {dist.deltaRecovered}
                                        </Typography>
                                        <Typography variant="body1" component="h4" className="recovered-color">
                                            {dist.recovered}
                                        </Typography>
                                    </div>
                                    <div className="col death-bg death-bg-hover">
                                        <Typography variant="body2" component="small" className="death-light-color d-flex align-center bold">
                                            <ArrowUpwardIcon fontSize="small"/> {dist.deltaDeceased}
                                        </Typography>
                                        <Typography variant="body1" component="h4" className="death-color">
                                            {dist.deceased}
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