import React from 'react';
import Area from './Area';

export default {
  title: 'Area Graph',
  component: Area,
  argTypes: {
    areaData: {
      type: {
        required: true
      }
    },
  },
  parameters: {
    layout: 'centered',
  },
}

const Template = (args) => <Area {...args}/>;

export const AreaGraph = Template.bind({});

const areaGraphData = [
  {value: 277300, dueDate: '5/01/22'},
  {value: 287300, dueDate: '6/01/22'},
  {value: 289800, dueDate: '7/01/22'},
  {value: 289800, dueDate: '8/01/22'},
  {value: 292400, dueDate: '9/01/22'},
  {value: 293500, dueDate: '10/01/22'},
  {value: 294500, dueDate: '11/01/22'},
  {value: 294800, dueDate: '12/01/22'},
  {value: 295800, dueDate: '1/01/23'},
]

AreaGraph.args = {
  areaData: areaGraphData,
  title: 'Projected Portfolio Value (2022)',
  width: 460,
  height: 400,
  xAxis: 'dueDate',
  yAxis: 'value',
  valueTick: { format: 'thousand', tick: 5, valueDomain: [275000, 300000] },
  dateTick: { type: 'month', every: 2, format: '%b', parseFormat: '%m/%d/%y' },
  label: { show: true, xLabel: 'Porfolio Value ($)', yLabel: 'Due Date' },
  tooltip: {show: true, text: '<div>Portfolio Value: $%value%</div>', format: 'thousand' }
}