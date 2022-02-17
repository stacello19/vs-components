import React from 'react';
import Bar from './Bar';

export default {
  title: 'Bar Graph',
  component: Bar,
  argTypes: {
    data: {
      type: {
        required: true
      }
    },
    xAxis: {
      type: {
        required: true
      }
    },
    yAxis: {
      type: {
        required: true
      }
    }
  },
  parameters: {
    layout: 'centered',
  },
}

const Template = (args) => <Bar {...args}/>;

export const BarGraph = Template.bind({});

const barData = [{"risk_class": "MR", "SUM(risk_dist_per)": 39.38167062435006}, {"risk_class": "LR", "SUM(risk_dist_per)": 34.950715245783954}, {"risk_class": "VLR", "SUM(risk_dist_per)": 4.442875126405763}, {"risk_class": "HR", "SUM(risk_dist_per)": 0.937668620369216}];

BarGraph.args = {
  data: barData,
  domain: ['VLR', 'LR', 'MR', 'HR', 'VHR'],
  yAxis: 'risk_class',
  xAxis: 'SUM(risk_dist_per)',
  barType: 'horizontal',
  barColor: '#FF6633',
  label: {show: true, yLabel: 'SUM(Risk Distribution Perc)', xLabel: 'Risk Class'},
  grid: {xLine: true, yLine: false},
  lineShow: true,
  info: {
    show: false, 
    showHover: true, 
    location: 'outside', 
    text: '', 
    hoverText: '%SUM(risk_dist_per)%',
    format: 'percentage'
  },
  title: 'Horizontal Bar Graph'
}