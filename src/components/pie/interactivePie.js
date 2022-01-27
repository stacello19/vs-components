import React, { useRef, useEffect, useCallback } from 'react';
import { createDomain, createColorPalette } from '../help';
import * as d3 from 'd3';

const InteractivePie = ({ data, width, height, dataKey, value, colorPalette, colorType, margin, style, text, arc }) => {
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

  const createPie = useCallback((_data) => {
    const pie = d3.pie()
                  .value(d => d[value]);
    return pie(_data);
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

  const handleText = useCallback((svg, data, arcGenerator, outerArc, radius) => {
    svg.selectAll('arc')
        .data(data)
        .enter()
        .append('text')
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
        .style("font-size", text.textSize)
        .style('font-family', text.textFamily)
        .style('font-weight', text.textWeight)
        .style('stroke', text.color)
  },[dataKey, text]);

  const handleTextLine = useCallback((svg, data, arcGenerator, outerArc, radius) => {
    svg.selectAll('allPolylines')
        .data(data)
        .enter()
        .append('polyline')
          .attr('stroke', text.strokeColor)
          .style('fill', 'none')
          .attr('stroke-width', text.strokeWidth)
          .attr('opacity', text.strokeOpacity)
          .attr('points', function(d) {
            const posA = arcGenerator.centroid(d) // line insertion in the slice
            const posB = outerArc.centroid(d) // line break: we use the other arc generator that has been built only for that
            const posC = outerArc.centroid(d); // Label position = almost the same as posB
            const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2 // we need the angle to see if the X position will be at the extreme right or extreme left
            posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
            return [posA, posB, posC]
          })
  },[text])

  const createPieGraph = useCallback((div, _data) => {
    const svg = drawSvg(div);
    const pie_data = createPie(_data);
    const color = handleScale();
    const radius = handleRadius();
    const arcGenerator = d3.arc()
                            .innerRadius(0) // range = 0 <= radius
                            .outerRadius(radius)
                            .cornerRadius(handleConerRadius()) 
                            .padAngle(arc.padAngle)
    const outerArc = d3.arc()
                        .innerRadius(radius * 0.9)
                        .outerRadius(radius * 0.9)
                
    const arcs = svg.selectAll('path')
                    .data(pie_data)

    arcs.join('path')
        .attr('class','int-arc')
        .style('fill', (d) => color(d.data[dataKey]))
        .transition().duration(1000)
        .attrTween('d', function(d) {
          const i = d3.interpolate(d.startAngle+0.1, d.endAngle);
          return function(t) {
              d.endAngle = i(t);
            return arcGenerator(d);
        }})

    arcs.exit()
        .remove();

    // text line
    text.showLine && handleTextLine(svg, pie_data, arcGenerator, outerArc, radius);
    // text
    text.show && handleText(svg, pie_data, arcGenerator, outerArc, radius);
    
  },[handleTextLine, dataKey, drawSvg, createPie, handleScale, handleRadius, text, arc, handleConerRadius, handleText])

  useEffect(() => {
    if (svgRef.current) {
      createPieGraph(svgRef.current, data)
    }
  },[svgRef, createPieGraph, data]);

  return(
    <svg 
      ref={svgRef}
      width={width}
      height={height}
    />
  )
};

InteractivePie.defaultProps = {
  data: [],
  width: 400, 
  height:  400, 
  dataKey: '', 
  value: '', 
  colorPalette: [], 
  colorType: 'Color-5', 
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
};

export default InteractivePie;