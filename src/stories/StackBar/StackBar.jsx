import React, { useRef, useEffect, useCallback } from 'react';
import './StackBar.css';
import { createColorPalette, createLabels, showLegend, drawSvg } from '../../components/help2';

import * as d3 from 'd3';
import PropTypes from 'prop-types';

const StackBar = ({ title, xTick, legend, hover, domain, data, width, height, margin, groupKey, label, subgroups, colorPalette, colorType}) => {
  const svgRef = useRef(null);

  const handleAxis = useCallback((groups) => {
    const datanum = data.map(obj => Object.keys(obj).reduce((acc, key) => subgroups.includes(key) ? acc + parseInt(obj[key]) : acc+0, 0)) ?? [];
    const yDomain = domain.yDomain ||[0, Math.max(...datanum)];

    const x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
    const  y = d3.scaleLinear()
      .domain(yDomain)
      .range([ height, 0 ]);
    return [x, y];
  },[data, width, height, subgroups, domain])

  const handleScale = useCallback(() => {
    const len = subgroups.length;
    const paletteRange = colorPalette.length > 0 ? colorPalette : createColorPalette(colorType, len);
    const color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(paletteRange)
    return color;
  },[subgroups, colorPalette, colorType])

  const handleInfo = (svg) => {
    const div = svg
      .append('text')
      .attr('class', 'info')
      .style('position', 'absolute')
      .style('opacity', 0)
    return div
  }

  const createStackBar = useCallback((div) => {
    const svg = drawSvg(div, width, height, margin, 'bar');
    const groups = domain.xDomain || data?.map(d => (d[groupKey]));
    const stackedData = d3.stack().keys(subgroups)(data) ?? [];
    const [x, y] = handleAxis(groups);
    const color = handleScale();
    const infoDiv = handleInfo(svg);

    // x axis
    svg.append('g')
      .attr('class', 'xGrid')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll('text')
      .attr('class', 'xLabel')
      .attr('transform', `translate(${xTick.angle === 'center' ? '0' : '-10'}, 0)rotate(${xTick.angle === 'center' ? '0' : '-45'})`)
      .style('text-anchor', xTick.anchor)
      .text((d) => d)
    // y axis
    svg.append('g')
      .attr('class', 'yGrid')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .attr('class', 'yLabel')
      .text((d) => d)     

    svg.append('g')
      .selectAll('g')
      .data(stackedData)
      .join('g')
      .attr('fill', d => color(d.key))
      .attr('class', d => `singleRect ${d.key}` ) 
      .selectAll('rect')
      .data(d => d)
      .join('rect')
      .attr('x', d => x(d.data[groupKey]))
      .attr('y', d => domain.yDomain ? y(d[1] + domain.yDomain[0]) : y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]) < 0 ? 0 : y(d[0]) - y(d[1]))
      .attr('width',x.bandwidth())
      // eslint-disable-next-line no-unused-vars
      .on('mousemove', function (event, d) {
        if (!hover.show) return;
        const subGroupName = d3.select(this.parentNode).datum().key 
        const singleRect = d3.selectAll('.singleRect').style('opacity', 0.2)  
        const subGroupRect = d3.selectAll('.'+subGroupName).style('opacity',1) 

        singleRect.exit().remove();
        subGroupRect.exit().remove();

        infoDiv
          .attr('x', x(d.data[groupKey]) + x.bandwidth() / 2)
          .attr('y', (domain.yDomain ? y(d[1] + domain.yDomain[0]) : y(d[1])) - 10)
          .style('opacity', 1)
          .attr('text-anchor', 'middle')
          .text(() => {
            const { valueSign } = hover;
            const value = (d[1] - d[0]);
            if (valueSign === 'decimal') {
              return d3.format('.2f')(value);
            } else if (valueSign === 'percentage') {
              return d3.format('.2%')(value < 0 ? value : value/100)
            } else if (valueSign === 'currency') {
              return d3.format('($.2f')(value)
            } else if (valueSign === 'thousand') {
              return d3.format(',.0f')(value)
            }
          })
      })
      .on('mouseout', function() {
        if (!hover.show) return;
        d3.selectAll('.singleRect').transition().duration(250).style('opacity',1); 
        d3.selectAll('.info').transition().duration(250).style('opacity', 0);
      })

    label.show && createLabels(svg, height, width, margin, label);
    legend.show && showLegend(svg, color, legend, subgroups, width, margin);

  },[data, hover, domain, drawSvg, handleAxis, handleScale, height, subgroups, groupKey, label, margin, width])

  useEffect(() => {
    if (svgRef.current && data) {
      createStackBar(svgRef.current)
    }
  },[svgRef, createStackBar, data]);


  return(
    <div className='chart-box'>
      { title && <h3 className='chart-label'>{title}</h3> }
      <svg ref={svgRef} />
    </div>
  )
};

StackBar.defaultProps = {
  colorPalette: [],
  colorType: 'Color-1',
  data: [],
  height: 400,
  width: 400,
  margin: { top: 50, bottom: 100, left: 100, right: 50 },
  label: { show: false },
  hover: { show: false },
  legend: { show: false },
  xTick: { angle: 'center', anchor: 'center' }
};

StackBar.propTypes = {
  colorPalette: PropTypes.array,
  colorType: PropTypes.string,
  data: PropTypes.array.isRequired,
  domain: PropTypes.object,
  groupKey: PropTypes.string.isRequired,
  height: PropTypes.number,
  hover: PropTypes.object,
  label: PropTypes.object,
  legend: PropTypes.object,
  margin: PropTypes.object, 
  subgroups: PropTypes.array.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  xTick: {
    angle: PropTypes.oneOf(['center', 'tilted']),
    anchor: PropTypes.oneOf(['start', 'center', 'end'])
  }
}

export default React.memo(StackBar);

