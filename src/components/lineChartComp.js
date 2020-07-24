import React from 'react';
import {Line, defaults} from 'react-chartjs-2';
import PropTypes from 'prop-types';

defaults.global.elements.rectangle.borderRadius = 5;

// const state = {
//     labels: ['January', 'February', 'March',
//              'April', 'May'],
//     datasets: [
//       {
//         label: 'Rainfall',
//         fill: false,
//         lineTension: 0.5,
//         backgroundColor: 'rgba(75,192,192,1)',
//         borderColor: 'rgba(0,0,0,1)',
//         borderWidth: 2,
//         data: [65, 59, 80, 81, 56]
//       }
//     ]
// }

export default class LineChartComp extends React.Component {
    constructor(props) {
        super(props);
        this.chartReference = {};
        this.state = {
            graphData: this.props.graphData,
            titleColor: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.graphData && nextProps.graphData.title && nextProps.graphData.title.length > 0) {
            this.setState({
                graphData: nextProps.graphData,
            }, function () {
                this.getFontColor();
            }.bind(this));
            if (this.chartReference && this.chartReference.chartInstance) {
                this.chartReference.chartInstance.update();
            }
        }
    }

    getFontColor = () => {
        let color = '';
        if (this.state.graphData.title.indexOf('Delta') == -1) {
            if (this.state.graphData.title === 'confirmed') {
                color = '#ff073a';
            } else if (this.state.graphData.title === 'recovered') {
                color = '#28a745';
            } else if (this.state.graphData.title === 'deceased') {
                color = '#6c757d';
            } else {
                color = '#ff073a';
            }
        } else {
            color = 'rgba(32,26,162,.866667)';
        }

        this.setState({titleColor: color});
    }

    checkAndRender = () => {
        if (this.state.graphData.title && this.state.graphData.title.length > 0) {
            return (
                <div className="p-2">
                    <Line
                        data={this.state.graphData}
                        options={{
                            title:{
                                display:false
                            },
                            legend:{
                                display:false
                            },
                            scales: {
                                xAxes: [{
                                    display: false,
                                    gridLines: {
                                        display: false
                                    }
                                }],
                                yAxes: [{
                                    display: false,
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        suggestedMin: 0,
                                    }
                                }]
                            }
                        }}
                    />
                </div>
            );
        } else {
            return null;
        }
    }

  render() {
        return (
            this.checkAndRender()
        );
  }
}

LineChartComp.propTypes = {
    graphData: PropTypes.object.isRequired
};