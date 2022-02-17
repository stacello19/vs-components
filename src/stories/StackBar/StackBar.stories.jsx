import React from 'react';
import StackBar from './StackBar';

export default {
  title: 'StackBar Graph',
  component: StackBar,
  argTypes: {
    data: {
      type: {
        required: true
      }
    },
    subgroups: {
      type: {
        required: true
      }
    },
    groupKey: {
      type: {
        required: true
      }
    }
  },
  parameters: {
    layout: 'centered',
  },
}

const Template = (args) => <StackBar {...args}/>;

export const StackBarGraph = Template.bind({});

const data = [
  { risk_class: 'VLR', value: 4.442875126405763, diff: 96, max: 100 },
  { risk_class: 'LR', value: 34.950715245783954, diff: 5, max: 39 },
  { risk_class: 'MR', value: 39.38167062435006, diff: 5, max: 44 },
  { risk_class: 'HR', value: 0.937668620369216, diff: 5, max: 5 },
  { risk_class: 'VHR', value: 0, diff: 0, max: 0 },
]

StackBarGraph.args = {
  data: data,
  title: 'Risk Class Eligibility',
  width: 460,
  height: 400,
  groupKey: 'risk_class',
  subgroups: ['value', 'diff'],
  colorType: 'Color-4',
  domain: { xDomain: ['VLR', 'LR', 'MR', 'HR', 'VHR'], yDomain: [0, 100] },
  label: { show: true, xLabel: 'Sum Percentage (%)', yLabel: 'Risk Class' },
  xTick: { angle: 'tilted', anchor: 'end' },
  hover: { show: true, valueSign: 'percentage' },
  legend: { show: true, type: 'square', size: 20, text: { value: 'Sum % by class', diff: 'Risk class max'} }
}