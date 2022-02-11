import React, { useRef, useEffect, useCallback, useState } from 'react';
// import { createDomain, parseTooltipText } from '../help';
import * as d3 from 'd3';

const datas = [{data: '2001', value: 100}, {data: '2002', value: 150}, {data: '2003', value: 100},
{data: '2004', value: 400}, {data: '2005', value: 1070}, {data: '2006', value: 700}]

const AreaLine = ({ width=400, height=400, margin={left: 100, bottom: 100, top: 50, right: 50}, xAxis='date', yAxis='value' }) => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const parseTime = d3.timeParse('%Y');
    const newFormattedData = datas.map(obj => {
      return { date: parseTime(obj.data), value: obj.value }
    })
    setData([...newFormattedData])
  },[])

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
    // const domainMax = (axis) => Math.max.apply(Math, data.map(function(o) { return o[axis]; }))
    // const scaleDomain = domain.length > 0 ? domain : createDomain(data, xAxis);
    const reformatDates = data.map(obj => obj[xAxis]);
    x = d3.scaleTime()
            .domain(d3.extent(reformatDates))
            .range([ 0, width ])
            .nice()
            
    y = d3.scaleLinear()
            .domain([0, d3.max(data, d => +d[yAxis])])
            .range([ height, 0 ]);
    return [x, y];
  },[width, height, data, xAxis, yAxis]);

  const createAreaGraph = useCallback((div) => {
    const svg = drawSvg(div);
    const [x, y] = handleAxis();

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(d3.timeYear)
      )
    svg.append("g")
      .call(d3.axisLeft(y))
    // svg.append('line').classed('hoverLine', true)
    // svg.append('circle').classed('hoverPoint', true);
    svg.append("text").classed('hoverText', true);
    
    // Add the area
    svg.append("path")
      .datum(data)
      .attr("fill", "#cce5df")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr("d", d3.area()
        .x(d => x(d[xAxis]))
        .y0(y(0))
        .y1(d => y(d[yAxis]))
      )
      .on('mousemove', (event, d) => {
        const { offsetX, pageY } = event;

        const xValue = x.invert(offsetX).getFullYear();
        const dataIndex = data.findIndex(el => el.date.getFullYear() === xValue);
        const value = data[dataIndex].value;
        console.log(xValue, dataIndex)
        if (dataIndex < 0) return;

        svg.selectAll('.hoverText')
            .attr('x', x(xValue))
            .attr('y', y(value))
            .attr('dx', '500')
            .attr('dy', '100')
            .style('text-anchor', 'end')
            .text(value);
      })

    svg.append('path')
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
          .x(d => x(d[xAxis]))
          .y(d => y(d[yAxis]))
        )

    svg.selectAll("myCircles")
        .data(data)
        .join("circle")
          .attr("fill", "yellow")
          .attr("stroke", "none")
          .attr("cx", d => x(d[xAxis]))
          .attr("cy", d => y(d[yAxis]))
          .attr("r", 3)
  },[handleAxis, height, drawSvg, data, xAxis, yAxis])

  useEffect(() => {
    if (svgRef.current) {
      createAreaGraph(svgRef.current)
    }
  },[svgRef, createAreaGraph]);

  return(
    <svg 
      ref={svgRef}
    />
  )
};

export default AreaLine;

