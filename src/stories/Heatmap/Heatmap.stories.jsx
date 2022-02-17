import React from 'react';
import Heatmap from './HeatMap';

export default {
  title: 'Heatmap Graph',
  component: Heatmap,
  argTypes: {
  
  },
  parameters: {
    layout: 'centered',
  },
}

const Template = (args) => <Heatmap {...args}/>;

export const HeatmapGraph = Template.bind({});
