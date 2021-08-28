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

import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from '@material-ui/core/Fab';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import HomeIcon from '@material-ui/icons/Home';

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
});

class DistrictData extends React.Component {
    constructor(props) {
        super(props);
        // this.state = {
        //     open: this.props.open
        // }
    }

    componentDidMount () {
        if (this.props.location && this.props.location.state) {
            // alert(this.props.location.state.stateName);
            // alert(this.props.location.state.statecode);
            console.log(this.props.location.state.statedata);
        }
        // this.loadInitialData(this.props.location.state.stateName, this.props.location.state.statecode, this.props.location.state.statedata);
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.open !== nextProps.open) {
        //     this.setState({ open: nextProps.open });
        // }

        // if (nextProps.district && nextProps.district.districtData) {
        //     this.setState({keys: Object.keys(nextProps.district.districtData)})
        // }
        // if (nextProps.open) {
        //     alert(nextProps.district.statecode);
        // }
        // const classes = useStyles();
    }

    render() {
        const { classes } = this.props;

        return (
            <Paper>
                <div className="state-details">
                    <div className="d-flex align-center details-header MuiPaper-elevation1">
                        {/* <Link to={{
                                pathname: '/StateDetails'
                            }}>
                            <Tooltip title="Back to Last Page" placement="right">
                                <Fab size="small" color="secondary" className="col">
                                    <KeyboardBackspaceIcon fontSize="small"/>
                                </Fab>
                            </Tooltip>
                        </Link> */}
                        <Link to={{
                                pathname: '/'
                            }}>
                            <Tooltip title="Back to Home Page" placement="right">
                                <Fab size="small" color="primary" className="col">
                                    <HomeIcon fontSize="small"/>
                                </Fab>
                            </Tooltip>
                        </Link>
                    </div>
                </div>
            </Paper>
        )
    }
}

// DistrictData.propTypes = {
//     open: PropTypes.bool.isRequired,
//     district: PropTypes.object,
//     closeModal: PropTypes.func,
//     classes: PropTypes.object.isRequired
// };

export default withStyles(useStyles)(DistrictData);