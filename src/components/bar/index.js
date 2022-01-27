import React, { useRef, useEffect, useCallback } from 'react';
import { createDomain, parseTooltipText } from '../help';
import * as d3 from 'd3';

const Bar = ({ data, domain, width, height, margin, xAxis, yAxis, barType, barColor, text, grid, label, line, info }) => {
  const svgRef = useRef(null);

  const drawSvg = useCallback((div) => {
    const svg = d3.select(div)
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.right})`);
    return svg;
  },[height, width, margin]);

  const handleAxis = useCallback(() => {
    let x, y;
    const domainMax = (axis) => Math.max.apply(Math, data.map(function(o) { return o[axis]; }))
    if (barType === 'vertical') {
      const scaleDomain = domain.length > 0 ? domain : createDomain(data, xAxis);
      x = d3.scaleBand()
            .range([0, width])
            .domain(scaleDomain)
            .padding(0.2)
      y = d3.scaleLinear()
            .domain([0, Math.ceil(domainMax(yAxis))])
            .range([height, 0])
    } else if (barType === 'horizontal') {
      const scaleDomain = domain.length > 0 ? domain : createDomain(data, yAxis);
      x = d3.scaleLinear()
            .domain([0, Math.ceil(domainMax(xAxis))])
            .range([0, width])
      y = d3.scaleBand()
            .range([0, height])
            .domain(scaleDomain)
            .padding(0.2)
    }
    return [x, y];
  },[domain, data, barType, yAxis, xAxis, width, height]);

  const drawBar = useCallback((svg, x, y) => {
    if (barType === 'vertical') {
      svg.selectAll('rect')
        .data(data)
        .join('rect')
          .attr('x', (d) => x(d[xAxis]))
          .attr('y', (d) => y(d[yAxis]))
          .attr("width", x.bandwidth())
          .attr('height', (d) => height - y(d[yAxis]))
          .style('fill', barColor)
    } else if (barType === 'horizontal') {
      svg.selectAll('rect')
        .data(data)
        .join('rect')
          .attr('x', x(0))
          .attr('y', (d) => y(d[yAxis]))
          .attr("width", (d) => x(d[xAxis]))
          .attr('height', y.bandwidth())
          .style('fill', barColor)
    }
  },[data, height, barType, barColor, xAxis, yAxis])

  const handleTick = useCallback((type, axis) => {
    if (type === 'x') {
      return grid.xLine ? d3.axisBottom(axis).scale(axis).tickSize(-height, 0, 0).tickFormat('') : d3.axisBottom(axis);
    } else if (type === 'y') {
      return grid.yLine ? d3.axisLeft(axis).scale(axis).tickSize(-width, 0, 0).tickFormat('') : d3.axisLeft(axis);
    }
  },[grid, height, width]);

  const createTooltip = useCallback(() => {
    const tooltipDiv = d3.select('.App')
                          .append('div')
                          .attr('class', 'tooltip2')
                          .style('position', 'absolute')
                          .style('opacity', 0)
    return tooltipDiv
  },[]);

  const createPieGraph = useCallback((div) => {
    const svg = drawSvg(div);
    const [x, y] = handleAxis();
    const Tooltip = createTooltip();

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(handleTick('x', x))
        .attr('class', 'grid')
        .selectAll('text')
          .attr('class', 'x-label')
          .attr('transform', `translate(${text.angle === 'center' ? '0' : '-10'}, 0)rotate(${text.angle === 'center' ? '0' : '-45'})`)
          .style("text-anchor", text.anchor)
          .text((d) => d)

    svg.append('g')
        .call(handleTick('y', y))
        .selectAll('text')
          .attr('class', 'y-label')
          .text((d) => d)

    label.show && svg.append('text')
                      .attr('class', 'label')
                      .attr('x', -(height)/2)
                      .attr('y', -margin.left/2)
                      .attr('transform', 'rotate(-90)')
                      .attr('text-anchor', 'middle')
                      .text(label.xLabel)

    label.show && svg.append('text')
                      .attr('class', 'label')
                      .attr('x', width / 2)
                      .attr('y', height + (margin.bottom+margin.top)/2.5)
                      .attr('text-anchor', 'middle')
                      .text(label.yLabel)
    
    drawBar(svg, x, y);

    svg.selectAll('rect')
        .on('mouseover', function(event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .style('opacity', 0.5)
            .attr(barType === 'vertical' ? 'x' : 'y', barType === 'vertical' ? x(d[xAxis]) - 5 : y(d[yAxis]) - 5)
            .attr(barType === 'vertical' ? 'width' : 'height', barType === 'vertical' ? x.bandwidth() + 10 : y.bandwidth() + 10)

          Tooltip.transition()
                  .duration(200)
                  .style('opacity', 1)
                  .style('left', (event.pageX + 20) + 'px')
                  .style('top', (event.pageY - 20) + 'px')
                  .text(parseTooltipText('%SUM(risk_dist_per)% %', d));

          line.show && svg.append('line')
                          .attr('class', 'value-line')
                          .attr(barType === 'vertical' ? 'x1' : 'y1', 0)
                          .attr(barType === 'vertical' ? 'y1' : 'x1', barType === 'vertical' ? y(d[yAxis]) : x(d[xAxis]))
                          .attr(barType === 'vertical' ? 'x2' : 'y2', barType === 'vertical' ? width : height)
                          .attr(barType === 'vertical' ? 'y2' : 'x2', barType === 'vertical' ? y(d[yAxis]) : x(d[xAxis]))
                          .attr('stroke', line.color)

          info.show && svg.append('text')
                          .attr('class', 'info')
                          .attr(barType === 'vertical' ? 'x' : 'y', barType === 'vertical' ? x(d[xAxis]) + x.bandwidth() / 2 : y(d[yAxis]) + y.bandwidth() / 2)
                          .attr(barType === 'vertical' ? 'y' : 'x', barType === 'vertical' ? (info.location === 'outside' ? y(d[yAxis]) - 10 : y(d[yAxis]) + 30) : (info.location === 'outside' ? x(d[xAxis]) + 30 : x(d[xAxis]) - 10))
                          .attr('fill', info.color)
                          .attr('text-anchor', 'middle')
                          .text(() => {
                            if (barType === 'vertical') {
                              const value = d[yAxis].toFixed(2);
                              return `${value}%`
                            } else {
                              const value = d[xAxis].toFixed(2);
                              return `${value}%`
                            }
                          })
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .transition()
            .duration(500)
            .style('opacity', 1)
            .attr(barType === 'vertical' ? 'x' : 'y', (a) => barType === 'vertical' ? x(a[xAxis]) : y(a[yAxis]))
            .attr(barType === 'vertical' ? 'width' : 'height', barType === 'vertical' ? x.bandwidth() : y.bandwidth())

          Tooltip.transition()
                  .duration(500)
                  .style('opacity', 0);

          line.show && svg.selectAll('.value-line').remove();
          info.show && svg.selectAll('.info').remove();
        })

  },[createTooltip, barType, info, line, label, width, xAxis, yAxis, handleTick, drawBar, handleAxis, height, drawSvg, text, margin])

  useEffect(() => {
    if (svgRef.current) {
      createPieGraph(svgRef.current)
    }
  },[svgRef, createPieGraph]);

  return(
    <svg 
      ref={svgRef}
    />
  )
};

Bar.defaultProps = {
  data: [],
  domain: [],
  width: 400,
  height: 400,
  margin: {},
  xAxis: '',
  yAxis: '',
  barType: 'vertical',
  barColor: 'skyblue',
  text: {
    angle: 'titled',
    anchor: 'end'
  },
  label: {
    show: false,
    xLabel: '',
    yLabel: ''
  },
  grid: {
    xLine: false,
    yLine: false
  },
  line: {
    show: false,
    color: 'white'
  },
  info: {
    show: false,
    location: 'inside',
    color: 'black'
  }
};

export default Bar;

