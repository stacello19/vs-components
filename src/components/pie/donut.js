import React from 'react';
import Pie from './index';

const Donut = ({ data, width, height, dataKey, value, colorPalette, colorType, margin, text, arc, tooltip, donut }) => {
  return(
    <Pie 
      dataKey={dataKey}
      data={data}
      donut={donut}
      value={value}
      width={width}
      height={height}
      colorPalette={colorPalette}
      colorType={colorType}
      margin={margin}
      text={text}
      arc={arc}
      tooltip={tooltip}
    />
  )
}

export default Donut;