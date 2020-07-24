import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';
import PropTypes from 'prop-types';

defaults.global.elements.rectangle.borderRadius = 5;

export default class ChartComp extends React.Component {
    constructor(props) {
        super(props);
        // this.chartReference = React.createRef();
        this.chartReference = {};
        this.state = {
            graphData: this.props.graphData
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.graphData && nextProps.graphData.title && nextProps.graphData.title.length > 0) {
            this.setState({graphData: nextProps.graphData});
            console.log(this.chartReference);
            this.chartReference.chartInstance.update();
        }
    }

  render() {
    const getFontColor = () => {
        let color = '';
        if (this.state.graphData.title === 'confirmed') {
            color = '#ff073a';
        } else if (this.state.graphData.title === 'recovered') {
            color = '#28a745';
        } if (this.state.graphData.title === 'deceased') {
            color = '#6c757d';
        }

        return color;
    }

    return (
    //   <div className={`p-2 ${this.state.graphData.title === 'recovered' ? "recovered-bg" : ""} ${this.state.graphData.title === 'confirmed' ? "confirmed-bg" : ""} ${this.state.graphData.title === 'deceased' ? "death-bg" : ""}`}>
    <div className="p-2">
        <Bar
            ref={ (reference) => this.chartReference = reference}
            data={this.state.graphData}
            redraw={true}
            options={{
                legend:{
                    display:false,
                },
                title:{
                    display:true,
                    text:this.state.graphData.title,
                    fontSize:20,
                    fontColor: getFontColor()
                },
                scales: {
                    xAxes: [{
                        display: false
                    }],
                    yAxes: [{
                        display: false,
                        ticks: {
                            suggestedMin: 0,
                        }
                    }]
                }
            }}
        />
      </div>
    );
  }
}

ChartComp.propTypes = {
    graphData: PropTypes.object.isRequired
};