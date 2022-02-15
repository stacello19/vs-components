import React, { useCallback, useEffect, useRef } from 'react';
import { drawSvg, createColorPalette, createDomain, createTooltip, parseTooltipText } from '../../components/help2';
import './Pie.css';

import * as d3 from 'd3';
import PropTypes from 'prop-types';

const Pie = ({ title, data, width, height, dataKey, value, colorPalette, colorType, margin, showLine, showLabel, labelTextAnchor, labelLocation, cornerRadius, padAngle, tooltipText, innerRadius }) => {
  const svgRef = useRef();

  const createPie = useCallback(() => {
    const pie = d3.pie()
      .value(d => d[value]);
    return pie(data);
  },[data, value]);

  const handleScale = useCallback(() => {
    const len = [...new Set(data.map(el => el[dataKey]))].length;
    const paletteRange = colorPalette.length > 0 ? colorPalette : createColorPalette(colorType, len);
    const ordScale = d3.scaleOrdinal()
      .domain(createDomain(data, dataKey))
      .range(paletteRange);
    return ordScale;
  },[data, dataKey, colorPalette, colorType]);

  const handleRadius = useCallback(() => {
    return margin > 0 ? Math.min(width, height) / 2 - margin : Math.min(width, height) / 2;
  },[width, height, margin]);

  const handleText = useCallback((svg, data, arcGenerator, outerArc, radius) => {
    svg.selectAll('arc')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'arcText')
      .text(d => d.data[dataKey])
      .attr('transform', function(d) {
        if (labelLocation === 'outside') {
          const pos = outerArc.centroid(d);
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
          return 'translate(' + pos + ')';
        }
        return `translate(${arcGenerator.centroid(d)})`;
      })
      .style('text-anchor', function(d) {
        if (labelLocation === 'outside') {
          const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
          return (midangle < Math.PI ? 'start' : 'end')
        } 
        return labelTextAnchor;
      })
  },[dataKey, labelLocation, labelTextAnchor]);

  const handleTextLine = useCallback((svg, data, arcGenerator, outerArc, radius) => {
    svg.selectAll('allPolylines')
      .data(data)
      .enter()
      .append('polyline')
      .attr('class', 'textLine')
      .style('fill', 'none')
      .attr('points', function(d) {
        const posA = arcGenerator.centroid(d) // line insertion in the slice
        const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
        const posC = outerArc.centroid(d); // Label position = almost the same as posB
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC]
      })
  },[])

  const handleInnerRadius = useCallback((radius) => {
    if (innerRadius > 0) {
      return radius < innerRadius ? radius : innerRadius;
    }
    return 0;
  },[innerRadius]);

  const handleConerRadius = useCallback(() => {
    const outerRadius = height/2 - 30;
    const innerRadius = outerRadius/3;
    const limitRange = (outerRadius-innerRadius)/2;

    if (cornerRadius >= limitRange) return limitRange;
    return cornerRadius;
  },[height, cornerRadius]);

  const createGraph = useCallback((div) => {
    const svg = drawSvg(div, width, height, margin, 'pie');
    const pie_data = createPie();
    const color = handleScale();
    const radius = handleRadius();
    const Tooltip = createTooltip('.chart-box');
    const arcGenerator = d3.arc()
      .innerRadius(handleInnerRadius(radius)) // range = 0 <= radius
      .outerRadius(radius)
      .cornerRadius(handleConerRadius()) 
      .padAngle(padAngle)
    const outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9)

    svg.selectAll('.arc')
      .data(pie_data)
      .enter()
      .append('path')
      .attr('class', 'arc')
      .attr('d', arcGenerator)
      .attr('fill', (d) => color(d.data[dataKey]))
      .on('mousemove', function(event, d) {
        tooltipText.length > 0 && Tooltip.style('opacity', 1)
          .style('left', (event.pageX + 20) + 'px')
          .style('top', (event.pageY - 20) + 'px')
          .text(parseTooltipText(tooltipText, d.data))
      })
      .on('mouseout', function() {
        tooltipText.length > 0 && Tooltip.transition()
          .duration(250)
          .style('opacity', 0);
      })
                  
    showLine && handleTextLine(svg, pie_data, arcGenerator, outerArc, radius);
    showLabel && handleText(svg, pie_data, arcGenerator, outerArc, radius);
  },[]);


  useEffect(() => {
    if (svgRef.current) {
      createGraph(svgRef.current);
    }
  },[svgRef, createGraph]);

  return(
    <div className='chart-box'>
      { title && <h3 className='chart-label'>{title}</h3> }
      <svg 
        ref={svgRef} 
        width={width}
        height={height}
      />
    </div>
  )
};

Pie.defaultProps = {
  data: [],
  width: 400, 
  height:  400, 
  dataKey: '', 
  value: '', 
  colorPalette: [], 
  colorType: 'Color-1', 
  margin: 0, 
  showLabel: false,
  showLine: false,
  textAnchor: 'middle',
  labelLocation: 'inside',
  padAngle: 0,
  cornerRadius: 0,
  tooltipText: '',
  innerRadius: 0,
  title: '' 
};

Pie.propTypes = {
  padAngle: PropTypes.number,
  cornerRadius: PropTypes.number,
  colorPalette: PropTypes.array,
  colorType: PropTypes.oneOf(['Color-1', 'Color-2', 'Color-3','Color-4', 'Color-5', 'Color-6','Color-7', 'Color-8', 'Color-9', 'Color-10']),
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  innerRadius: PropTypes.number,
  height: PropTypes.number,
  margin: PropTypes.number,
  showLabel: PropTypes.bool,
  showLine: PropTypes.bool,
  labelTextAnchor: PropTypes.oneOf(['middle', 'end', 'start']),
  labelLocation: PropTypes.oneOf(['inside', 'outside']),
  title: PropTypes.string,
  tooltipText: PropTypes.string,
  value: PropTypes.string.isRequired,
  width: PropTypes.number,
}
export default Pie;