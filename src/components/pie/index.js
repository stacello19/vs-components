import React, { useRef, useEffect, useCallback } from 'react';
import { createDomain, createColorPalette, parseTooltipText } from '../help';
import * as d3 from 'd3';

const Pie = ({ data, width, height, dataKey, value, colorPalette, colorType, margin, text, arc, tooltip, donut }) => {
  const svgRef = useRef(null);

  const drawSvg = useCallback((div) => {
    const svg = d3.select(div)
                    .append("g")
                    .attr("transform", `translate(${width/2},${height/2})`);
    return svg;
  },[height, width]);

  const handleUniqDataLen = useCallback(() => {
    const uniqueArr = [...new Set(data.map(el => el[dataKey]))];
    return uniqueArr.length;
  },[data, dataKey])

  const handleScale = useCallback(() => {
    const len = handleUniqDataLen();
    const paletteRange = colorPalette.length > 0 ? colorPalette : createColorPalette(colorType, len);
    const ordScale = d3.scaleOrdinal()
                      .domain(createDomain(data, dataKey))
                      .range(paletteRange);
    return ordScale;
  },[data, dataKey, handleUniqDataLen, colorPalette, colorType]);

  const createPie = useCallback(() => {
    const pie = d3.pie()
                  .value(d => d[value]);
    return pie(data);
  },[data, value]);

  const handleRadius = useCallback(() => {
    if (margin) {
      return Math.min(width, height) / 2 - margin;
    }
    return Math.min(width, height) / 2
  },[width, height, margin]);

  const handleConerRadius = useCallback(() => {
    const outerRadius = height/2 - 30;
    const innerRadius = outerRadius/3;
    const limitRange = (outerRadius-innerRadius)/2;

    if (arc.cornerRadius >= limitRange) return limitRange;
    return arc.cornerRadius;
  },[height, arc]);

  const handleText = useCallback((svg, data, arcGenerator, outerArc, radius) => {
    svg.selectAll('arc')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'arc-text')
        .text(d => d.data[dataKey])
        .attr('transform', function(d) {
          if (text.location === 'outside') {
            const pos = outerArc.centroid(d);
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
            return 'translate(' + pos + ')';
          }
          return `translate(${arcGenerator.centroid(d)})`;
        })
        .style('text-anchor', function(d) {
          if (text.location === 'outside') {
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2
            return (midangle < Math.PI ? 'start' : 'end')
          } 
          return text.textAnchor;
        })
  },[dataKey, text]);

  const createTooltip = useCallback(() => {
    const tooltipDiv = d3.select('.App')
                          .append('div')
                          .attr('class', 'tooltip2')
                          .style('position', 'absolute')
                          .style('opacity', 0)
    return tooltipDiv
  },[]);

  const handleInnerRadius = useCallback((radius) => {
    if (donut.show) {
      return radius < donut.innerRadius ? radius : donut.innerRadius;
    }
    return 0;
  },[donut]);

  const handleTextLine = useCallback((svg, data, arcGenerator, outerArc, radius) => {
    svg.selectAll('allPolylines')
        .data(data)
        .enter()
        .append('polyline')
        .attr('class', 'text-line')
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

  const createPieGraph = useCallback((div) => {
    const svg = drawSvg(div);
    const pie_data = createPie();
    const color = handleScale();
    const radius = handleRadius();
    const arcGenerator = d3.arc()
                            .innerRadius(handleInnerRadius(radius)) // range = 0 <= radius
                            .outerRadius(radius)
                            .cornerRadius(handleConerRadius()) 
                            .padAngle(arc.padAngle)
    const outerArc = d3.arc()
                      .innerRadius(radius * 0.9)
                      .outerRadius(radius * 0.9)

    const Tooltip = createTooltip();

    // create arc and fill in the color by value
    svg.selectAll('.arc')
        .data(pie_data)
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', arcGenerator)
        .attr('fill', (d) => color(d.data[dataKey]))
        .on('mouseover', function(event, d) {
          tooltip.show && Tooltip.transition()
                                  .duration(200)
                                  .style('opacity', 1)
                                  .style('left', (event.pageX + 20) + 'px')
                                  .style('top', (event.pageY - 20) + 'px')
                                  .text(parseTooltipText(tooltip.text, d.data))
        })
        .on('mouseout', function(event, d) {
          tooltip.show && Tooltip.transition()
                                  .duration(500)
                                  .style('opacity', 0);
        })
    
    // text line
    text.showLine && handleTextLine(svg, pie_data, arcGenerator, outerArc, radius);
    // text
    text.show && handleText(svg, pie_data, arcGenerator, outerArc, radius);
    
  },[handleTextLine, handleInnerRadius, dataKey, tooltip, createTooltip, drawSvg, createPie, handleScale, handleRadius, text, arc, handleConerRadius, handleText])

  useEffect(() => {
    if (svgRef.current) {
      createPieGraph(svgRef.current)
    }
  },[svgRef, createPieGraph]);

  return(
    <svg 
      ref={svgRef}
      width={width}
      height={height}
    />
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
  text: {
    show: false,
    textAnchor: 'middle',
    location: 'inside',
    showLine: false,
  },
  arc: {
    padAngle: 0,
    cornerRadius: 0
  },
  tooltip: {
    show: false,
    text: ''
  },
  donut: {
    show: false,
    innerRadius: 0
  } 
};

export default Pie;