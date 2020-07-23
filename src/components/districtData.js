import React from "react";
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent'

// import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';


import CloseIcon from '@material-ui/icons/Close';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { red, green, blue } from '@material-ui/core/colors';

const useStyles = (theme) => ({
    root: {
      width: '100%',
    },
    heading: {
        fontSize: '15px',
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: '15px',
        color: '#aaa',
    },
    distDetails: {
        minWidth: '300px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    confirmed: {
        color: blue[500],
        fontSize: '13px'
    },
    deceased: {
        color: red[500],
        fontSize: '13px'
    },
    recovered: {
        color: green[500],
        fontSize: '13px'
    }
});

class DistrictData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: this.props.open
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.open !== nextProps.open) {
            this.setState({ open: nextProps.open });
        }

        if (nextProps.district && nextProps.district.districtData) {
            this.setState({keys: Object.keys(nextProps.district.districtData)})
        }
        // if (nextProps.open) {
        //     alert(nextProps.district.statecode);
        // }
        // const classes = useStyles();
    }

    render() {
        const { classes } = this.props;

        return (
            <Dialog
                modal={[]}
                open={this.state.open}
            >
                <DialogTitle id="simple-dialog-title">
                    <Typography variant="h5" color="textSecondary" component="div">
                        <p className="align-center-justify-between">
                            {this.props.district.statecode}
                            <IconButton aria-label="Close Modal" onClick={() => {this.setState({open: false}); this.props.closeModal()}}>
                                <CloseIcon />
                            </IconButton>
                        </p>
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <div className="card-list">
                        <div className={classes.root}>
                        {this.state.keys ? this.state.keys.map((dist, index, a) => {
                            return (
                                <Accordion key={index}>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel{index}a-content"
                                    id="panel{index}a-header"
                                    >
                                        <Typography className={classes.heading}>{dist}</Typography>
                                        <Typography className={classes.secondaryHeading}>Active Cases: {this.props.district.districtData[dist].active}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className={classes.distDetails}>
                                        <div>
                                            <Typography variant="h6" component="p" className={classes.confirmed}>
                                                Confirmed
                                            </Typography>
                                            <Typography variant="body2" component="p" color="textSecondary" className={classes.heading} align="right">
                                                {this.props.district.districtData[dist].confirmed}
                                            </Typography>
                                            <Typography variant="h5" component="p" className={classes.confirmed} align="right">
                                                <ArrowUpwardIcon fontSize="small"/>
                                                {this.props.district.districtData[dist].delta.confirmed}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h6" component="p" className={classes.deceased}>
                                                Deceased
                                            </Typography>
                                            <Typography variant="body2" component="p" color="textSecondary" className={classes.heading} align="right">
                                                {this.props.district.districtData[dist].deceased}
                                            </Typography>
                                            <Typography variant="h5" component="p" className={classes.deceased} align="right">
                                                <ArrowUpwardIcon fontSize="small"/>
                                                {this.props.district.districtData[dist].delta.deceased}
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography variant="h6" component="p" className={classes.recovered}>
                                                Recovered
                                            </Typography>
                                            <Typography variant="body2" component="p" color="textSecondary" className={classes.heading} align="right">
                                                {this.props.district.districtData[dist].recovered}
                                            </Typography>
                                            <Typography variant="h5" component="p" className={classes.recovered} align="right">
                                                <ArrowUpwardIcon fontSize="small"/>
                                                {this.props.district.districtData[dist].delta.recovered}
                                            </Typography>
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        }): ''}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }
}

DistrictData.propTypes = {
    open: PropTypes.bool.isRequired,
    district: PropTypes.object,
    closeModal: PropTypes.func,
    classes: PropTypes.object.isRequired
};

export default withStyles(useStyles)(DistrictData);