import React from 'react';
import Pie from './Pie';

export default {
  title: 'Pie Graph',
  component: Pie,
  argTypes: {
    data: {
      type: {
        required: true
      }
    },
    colorPalette: {
      description: 'Custom color set of Pie graph'
    },
    dataKey: {
      description: 'Data element you want to display in the graph',
      type: {
        required: true
      }
    },
    value: {
      description: 'value of data element (dataKey)',
      type: {
        required: true
      }
    },
    tooltipText: {
      description: 'It displays the tooltip content and it has to be in html format. Any key from data that you want to display should have % tag around.'
    },
    padAngle: {
      description: 'Range is between 0 and 0.01',
    },
    innerRadius: {
      description: 'Range is bigger than 0. It will make the pie graph into donut graph.',
      control: { type: 'number', min: 0, max: 180, step: 10 }
    },
  },
  parameters: {
    layout: 'centered',
  },
};

const Template = (args) => <Pie {...args}/>;

export const PieGraph = Template.bind({});

PieGraph.args = {
  data: [{type: 'a', value: 200}, {type:'b', value: 300}, {type:'c', value: 100}, {type: 'a', value: 50}],
  width: 460,
  height: 400,
  margin: 20,
  dataKey: 'type', 
  value: 'value',
  title: 'Pie',
};
