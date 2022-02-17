import React, { useRef, useEffect, useCallback } from 'react';
import './Area.css';
import { parseTooltipText, createTooltip, createLabels, drawSvg } from '../../components/help2';

import * as d3 from 'd3';
import PropTypes from 'prop-types';

const Area = ({ title, tooltip, style, xTick, label, dateTick, areaData, width, height, margin, xAxis, yAxis, valueTick }) => {
  const svgRef = useRef(null);

  const handleDataReformat = useCallback((data) => {
    const parseTime = d3.timeParse(dateTick.parseFormat);
    const newFormattedData = data.map(obj => {
      return { ...obj, [xAxis]: parseTime(obj[xAxis]) }
    }).sort((a,b) => a[xAxis] - b[xAxis]);

    return [...newFormattedData];
  },[areaData])

  const handleAxis = useCallback((data) => {
    const reformatDates = data.map(obj => obj[xAxis]);
    const yDomain = valueTick.valueDomain || [0, d3.max(data, d => +d[yAxis])];
    const x = d3.scaleTime()
      .domain(d3.extent(reformatDates))
      .range([ 0, width ])
      .nice()
    const y = d3.scaleLinear()
      .domain(yDomain)
      .range([ height, 0 ]);
    return [x, y];
  },[width, height, xAxis, yAxis]);

  const handleDateTick = useCallback((x) => {
    const { type, every, format } = dateTick;
    if (type === 'year') {
      return d3.axisBottom(x).tickFormat(d3.timeFormat(format)).ticks(d3.timeYear.every(every))
    } else if (type === 'month') {
      return d3.axisBottom(x).tickFormat(d3.timeFormat(format)).ticks(d3.timeMonth.every(every))
    } else if (type === 'day') {
      return d3.axisBottom(x).tickFormat(d3.timeFormat(format)).ticks(d3.timeDay.every(every))
    } else if (type === 'week') {
      return d3.axisBottom(x).tickFormat(d3.timeFormat(format)).ticks(d3.timeWeek.every(every))
    }
  },[dateTick]);

  const handleValueTick = useCallback((y) => {
    const { format, tick } = valueTick;
    let yTick = d3.axisLeft(y)
    if (format) {
      if (format === 'decimal') {
        yTick.tickFormat(d3.format('.2f'));
      } else if (format === 'percentage') {
        yTick.tickFormat(d3.format('.2%'));
      } else if (format === 'currency') {
        yTick.tickFormat(d3.format('($.2f'));
      } else if (format === 'thousand') {
        yTick.tickFormat(d3.format(',.0f'));
      }
    }
    if (tick) yTick.ticks(tick)
    return yTick;
  },[valueTick])

  const createAreaGraph = useCallback((div) => {
    const data = handleDataReformat(areaData);
    const svg = drawSvg(div, width, height, margin, 'bar');
    const [x, y] = handleAxis(data);
    const Tooltip = createTooltip('.chart-box');

    // x-axis
    svg.append('g')
      .attr('class', 'xArea')
      .attr('transform', `translate(0,${height})`)
      .call(handleDateTick(x))
      .selectAll('text')
      .attr('class', 'xLabel')
      .attr('transform', `translate(${xTick.angle === 'center' ? '0' : '-10'}, 0)rotate(${xTick.angle === 'center' ? '0' : '-45'})`)
      .style('text-anchor', xTick.anchor)
    // y-axis
    svg.append('g')
      .attr('class', 'yArea')
      .call(handleValueTick(y))
      .selectAll('text')
      .attr('class', 'yLabel')
    
    // Add the area
    svg.append('path')
      .datum(data)
      .attr('fill', style.fill)
      .attr('stroke', style.stroke)
      .attr('stroke-width', 1.5)
      .attr('d', d3.area()
        .x(d => x(d[xAxis]))
        .y0(y(valueTick.valueDomain[0] || 0))
        .y1(d => y(d[yAxis]))
      )
    
    // add stroke
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', style.stroke)
      .attr('stroke-width', 2)
      .attr('d', d3.line()
        .x(d => x(d[xAxis]))
        .y(d => y(d[yAxis]))
      )
    
    // add circle
    svg.selectAll('myCircles')
      .data(data)
      .join('circle')
      .attr('fill', style.circleColor)
      .attr('stroke', 'none')
      .attr('cx', d => x(d[xAxis]))
      .attr('cy', d => y(d[yAxis]))
      .attr('r', 5)
      .on('mousemove', function(event,d) {
        tooltip.show && Tooltip.html(parseTooltipText(tooltip.text, d, tooltip.format))
          .style('opacity', 1)
          .style('display', 'block')
          .style('left', (event.pageX - 100) + 'px')
          .style('top', (event.pageY - 100) + 'px')
      })
      .on('mouseout', function() {
        tooltip.show && Tooltip.transition()
          .duration(250)
          .style('display', 'none');
      })

    label.show && createLabels(svg, height, width, margin, label);

  },[handleAxis, height, drawSvg, xAxis, yAxis, tooltip, handleDataReformat])

  useEffect(() => {
    if (svgRef.current && areaData.length) {
      createAreaGraph(svgRef.current)
    }
  },[svgRef, createAreaGraph, areaData]);


  return(
    <div className='chart-box'>
      { title && <h3 className='chart-label'>{title}</h3> }
      <svg ref={svgRef} />
    </div>
  )
};

Area.defaultProps = {
  areaData: [],
  height: 400,
  width: 400,
  margin: { top: 50, bottom: 100, left: 100, right: 50 },
  style: { fill: '#85BBFB', stroke: '#3084E7', circleColor: '#3084E7'},
  xTick: { angle: 'center', anchor: 'center' },
  label: { show: false },
  tooltip: { show: false }
}

Area.propTypes = {
  areaData: PropTypes.array.isRequired,
  dateTick: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  label: PropTypes.object,
  margin: PropTypes.object,
  style: PropTypes.object,
  title: PropTypes.string,
  tooltip: PropTypes.object,
  valueTick: PropTypes.object.isRequired,
  width: PropTypes.number.isRequired,
  xAxis: PropTypes.string.isRequired,
  xTick: PropTypes.object,
  yAxis: PropTypes.string.isRequired
}

export default Area;

