import React from 'react';
import {Bar, defaults} from 'react-chartjs-2';
import PropTypes from 'prop-types';

defaults.global.elements.rectangle.borderRadius = 5;

export default class BarChartComp extends React.Component {
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
        if (this.state.graphData.title.indexOf('new cases') == -1) {
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
                                fontSize:16,
                                fontColor: this.state.titleColor
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    ticks: {
                                        fontColor: this.state.titleColor,
                                        fontSize: 12,
                                        fontStyle: 'bold',
                                        callback: function(value, index, values) {
                                            return new Date(value).toDateString().slice(4, 10);
                                        }
                                    },
                                    gridLines: {
                                        display: false
                                    }
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

BarChartComp.propTypes = {
    graphData: PropTypes.object.isRequired
};