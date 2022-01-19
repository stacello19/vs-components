import React, { useRef, useEffect, useCallback } from 'react';
import { createDomain, createColorPalette } from '../help';
import * as d3 from 'd3';

const data = [{type: 'a', value: 200}, {type:'b', value: 300}, {type:'c', value: 100}, {type: 'a', value: 50}];

const Pie = ({ 
  width=400, 
  height= 400, 
  key='type', 
  value='value', 
  colorPalette=[], 
  colorType='Color-1', 
  margin=0, 
  style={
    stroke: false,
    strokeWidth: 'none',
    strokeColor: 'none',
    opacity: null
  },
  text={
    show: false,
    textSize: 12,
    textAnchor: 'middle',
    textFamily: 'serif',
    textWegiht: 400
  },
  arc={
    padAngle: 0,
    cornerRadius: 0
  },
  tooltip={
    show: false,
    background: '#FFF',
    border: 'none',
    borderRadius: '0px',
    padding: '0px',
    color: 'black',
    fontFamily: 'serif',
    fontWeight: 400,
    text: ''
  },
  hoverStyle={
    style: false,
    opacity: 'none',
    strokeWidth: 'none',
    strokeColor: 'none',
    cursorPointer: null
  } 
}) => {
  const svgRef = useRef(null);

  const drawSvg = useCallback((div) => {
    const svg = d3.select(div)
                    .append("g")
                    .attr("transform", `translate(${width/2},${height/2})`);
    return svg;
  },[height, width]);

  const handleUniqDataLen = useCallback(() => {
    const uniqueArr = [...new Set(data.map(el => el[key]))];
    return uniqueArr.length;
  },[key])

  const handleScale = useCallback(() => {
    const len = handleUniqDataLen();
    const paletteRange = colorPalette.length > 0 ? colorPalette : createColorPalette(colorType, len);
    const ordScale = d3.scaleOrdinal()
                      .domain(createDomain(data, key))
                      .range(paletteRange);
    return ordScale;
  },[key, handleUniqDataLen, colorPalette, colorType]);

  const createPie = useCallback(() => {
    const pie = d3.pie()
                  .value(d => d[value]);
    return pie(data);
  },[value]);

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

  const handleText = useCallback((svg, data, arcGenerator) => {
    svg.selectAll('arc')
        .data(data)
        .enter()
        .append('text')
        .text(d => d.data[key])
        .attr("transform", (d) => `translate(${arcGenerator.centroid(d)})`)
        .style("text-anchor", text.textAnchor)
        .style("font-size", text.textSize)
        .style('font-family', text.textFamily)
        .style('font-weight', text.textWegiht)
  },[key, text]);

  const handleStrokeStyle = useCallback((svg) => {
    svg.attr("stroke", style.strokeColor)
        .style("stroke-width", style.strokeWidth)
  },[style]);

  const createTooltip = useCallback(() => {
    const tooltipDiv = d3.select('.App')
                          .append('div')
                          .attr('class', 'tooltip')
                          .style('position', 'absolute')
                          .style('opacity', 0)
                          .style('border', tooltip.border)
                          .style('background', tooltip.background)
                          .style('padding', tooltip.padding)
                          .style('border-radius', tooltip.borderRadius)
                          .style('color', tooltip.color)
                          .style('font-family', tooltip.fontFamily)
                          .style('font-weight', tooltip.fontWeight)
    return tooltipDiv
  },[tooltip]);

  const parseTooltipText = useCallback((text, dataObj) => {    
    const newText = text.replace(/\(%.*?%\)/g, (match) => {
      const str = match.replace(/[^a-zA-Z0-9_-]+/g, '');
      return dataObj[str];
    });
    return newText
  },[])

  const createPieGraph = useCallback((div) => {
    const svg = drawSvg(div);
    const pie_data = createPie();
    const color = handleScale();
    const radius = handleRadius();
    const arcGenerator = d3.arc()
                            .innerRadius(0) // range = 0 <= radius
                            .outerRadius(radius)
                            .cornerRadius(handleConerRadius()) 
                            .padAngle(arc.padAngle)

    const Tooltip = createTooltip();

    // create arc and fill in the color by value
    svg.selectAll('.arc')
        .data(pie_data)
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', arcGenerator)
        .attr('fill', (d) => color(d.data[key]))
        .style("opacity", style.opacity)
        .on('mouseover', function(event, d) {
          if (!tooltip.show) return;
          Tooltip.transition()
                  .duration(200)
                  .style('opacity', 1);
          
          hoverStyle.style && d3.select(this)
                                .transition()
                                .duration(200)
                                .style('cursor', hoverStyle.cursorPointer)
                                .style('stroke-width', hoverStyle.strokeWidth)
                                .style('stroke', hoverStyle.strokeColor)
                                .style('opacity', hoverStyle.opacity)
        })
        .on('mousemove', function(event, d) {
          if (!tooltip.show) return;
          Tooltip.style('left', (event.pageX + 20) + 'px')
                  .style('top', (event.pageY - 20) + 'px')
                  .html(parseTooltipText(tooltip.text, d.data))
        })
        .on('mouseout', function(event, d) {
          if (!tooltip.show) return;
          Tooltip.transition()
                  .duration(500)
                  .style('opacity', 0);
          
        hoverStyle.style && d3.select(this)
                              .transition()
                              .duration(500)
                              .style('stroke', 'none')
                              .style('opacity', null)
        })
    
    // stroke style
    style.stroke && handleStrokeStyle(svg);
    // text
    text.show && handleText(svg, pie_data, arcGenerator);
    
  },[key, hoverStyle, parseTooltipText, tooltip, createTooltip, drawSvg, createPie, handleScale, handleRadius, style, text, arc, handleConerRadius, handleText, handleStrokeStyle])

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

export default Pie;