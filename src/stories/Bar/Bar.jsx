import React, { useRef, useEffect, useCallback } from 'react';
import { createDomain, parseTooltipText, createTooltip } from '../../components/help2';
import './Bar.css';

import * as d3 from 'd3';
import PropTypes from 'prop-types';

const Bar = ({ data, title, domain, lineShow, width, height, margin, xAxis, yAxis, barType, barColor, textAngle, textAnchor, grid, label, info, tooltip }) => {
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

  const handleLine = useCallback((svg, x, y, d) => {
    if (barType === 'vertical') {
      svg.append('line')
          .attr('class', 'value-line')
          .attr('x1', 0)
          .attr('y1', y(d[yAxis]))
          .attr('x2', width)
          .attr('y2', y(d[yAxis]))
    } else if (barType === 'horizontal') {
      svg.append('line')
          .attr('class', 'value-line')
          .attr('y1', 0)
          .attr('x1', x(d[xAxis]))
          .attr('y2', height)
          .attr('x2', x(d[xAxis]))
    }
  },[barType, height, width, xAxis, yAxis])

  const handleInfo = useCallback((svg, x, y, d, format) => {
    if (barType === 'vertical') {
      svg.append('text')
          .attr('class', 'info')
          .attr('x', x(d[xAxis]) + x.bandwidth() / 2)
          .attr('y', info.location === 'outside' ? y(d[yAxis]) - 10 : y(d[yAxis]) + 30)
          .attr('fill', info.color)
          .attr('text-anchor', 'middle')
          .text(() => {

            return parseTooltipText(info.hoverText, d, format)
          })
    } else if (barType === 'horizontal') {
      svg.append('text')
          .attr('class', 'info')
          .attr('y', y(d[yAxis]) + y.bandwidth() / 2)
          .attr('x', info.location === 'outside' ? x(d[xAxis]) + 30 : x(d[xAxis]) - 10)
          .attr('fill', info.color)
          .attr('text-anchor', 'middle')
          .text(() => {
            return parseTooltipText(info.hoverText, d, format)
          })
    }
  },[barType, info, xAxis, yAxis])

  const createPieGraph = useCallback((div) => {
    const svg = drawSvg(div);
    const [x, y] = handleAxis();
    const Tooltip = createTooltip();

    svg.append('g')
        .attr('class', 'x-grid')
        .attr('transform', `translate(0, ${height})`)
        .call(handleTick('x', x))
        .selectAll('text')
          .attr('class', 'x-label')
          .attr('transform', `translate(${textAngle === 'center' ? '0' : '-10'}, 0)rotate(${textAngle === 'center' ? '0' : '-45'})`)
          .style("text-anchor", textAnchor)
          .text((d) => d)

    svg.append('g')
        .attr('class', 'y-grid')
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

            tooltip.show && Tooltip.html(parseTooltipText(tooltip.text, d))
                                  .transition()
                                  .duration(200)
                                  .style('opacity', 1)
                                  .style('left', (event.pageX + 20) + 'px')
                                  .style('top', (event.pageY - 20) + 'px')

            info.show && d3.selectAll('.info-value')
                            .attr('opacity', 0)

            lineShow && handleLine(svg, x, y, d);
            info.showHover && handleInfo(svg, x, y, d, info.format);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .transition()
            .duration(500)
            .style('opacity', 1)
            .attr(barType === 'vertical' ? 'x' : 'y', (a) => barType === 'vertical' ? x(a[xAxis]) : y(a[yAxis]))
            .attr(barType === 'vertical' ? 'width' : 'height', barType === 'vertical' ? x.bandwidth() : y.bandwidth())

            tooltip.show && Tooltip.transition()
                                  .duration(500)
                                  .style('opacity', 0);
            info.show && d3.selectAll('.info-value')
                            .attr('opacity', 1)

            lineShow && svg.selectAll('.value-line').remove();
            info.showHover && svg.selectAll('.info').remove();
        })

    const barGroups = svg.selectAll('.info-value')
                          .data(data)
                          .enter()
                          .append('g');

    info.show && barGroups.append('text')
                          .attr('class', 'info-value')
                          .attr('y', (d) => {
                            if (barType === 'horizontal') {
                              return y(d[yAxis]) + y.bandwidth() / 2
                            } else {
                              const len = info.text.length * 5;
                              return info.location === 'outside' ? y(d[yAxis]) - len : y(d[yAxis]) + 30;
                            }
                          })
                          .attr('x', (d) => {
                            if (barType === 'horizontal') {
                              const len = info.text.length * 5;
                              return info.location === 'outside' ? x(d[xAxis]) + len : x(d[xAxis]) - 10;
                            } else {
                              return x(d[xAxis]) + x.bandwidth() / 2;
                            }
                          })
                          .attr('text-anchor', 'middle')
                          .text((d) => parseTooltipText(info.text, d))

  },[data, lineShow, handleInfo, handleLine, tooltip, barType, info, label, width, xAxis, yAxis, handleTick, drawBar, handleAxis, height, drawSvg, textAngle, textAnchor, margin])

  useEffect(() => {
    if (svgRef.current) {
      createPieGraph(svgRef.current)
    }
  },[svgRef, createPieGraph]);

  return(
    <div className='chart-box'>
      { title && <h3 className='chart-label'>{title}</h3> }
    <svg 
      ref={svgRef}
    />
    </div>
  )
};

Bar.defaultProps = {
  data: [],
  domain: [],
  width: 400,
  height: 400,
  margin: {top: 50, bottom: 100, right: 50, left: 100},
  xAxis: '',
  yAxis: '',
  barType: 'vertical',
  barColor: 'skyblue',
  textAngle: 'tilted',
  textAnchor: 'end',
  label: {
    show: false,
    xLabel: '',
    yLabel: ''
  },
  grid: {
    xLine: false,
    yLine: false
  },
  lineShow: false,
  info: {
    show: false,
    location: 'inside',
    color: 'black',
    format: ''
  },
  tooltip: { show: false, text: '' }
};

Bar.propTypes = {
  barColor: PropTypes.string,
  barType: PropTypes.string,
  data: PropTypes.array.isRequired,
  domain: PropTypes.array,
  height: PropTypes.number,
  grid: {
    xLine: PropTypes.bool,
    yLine: PropTypes.bool
  },
  margin: {
    top: PropTypes.number,
    bottom: PropTypes.number,
    right: PropTypes.number,
    left: PropTypes.number
  },
  label: {
    show: PropTypes.bool,
    xLabel: PropTypes.string,
    yLabel: PropTypes.string
  },
  lineShow: PropTypes.bool,
  info: {
    show: PropTypes.bool,
    location: PropTypes.oneOf(['inside', 'outside']),
    color: PropTypes.string,
    format: PropTypes.oneOf(['decimal', 'percentage', 'currency', 'thousand']),
  },
  textAnchor: PropTypes.oneOf(['start', 'center', 'end']),
  textAngle: PropTypes.oneOf(['tilted', 'center']),
  title: PropTypes.string,
  tooltip: {
    show: PropTypes.bool,
    text: PropTypes.string
  },
  xAxis: PropTypes.string.isRequired,
  yAxis: PropTypes.string.isRequired,
  width: PropTypes.number
}

export default Bar;

