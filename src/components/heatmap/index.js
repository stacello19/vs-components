import React, { useRef, useEffect } from 'react';
import { createTooltip } from '../help';
import * as d3 from 'd3';

const Heatmap = ({ width=400, height=400, margin={top: 30, right: 30, bottom: 30, left: 30}}) => {
  const svgRef = useRef();

  const drawSvg = (div) => {
    const svg = d3.select(div)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.right})`);
    return svg;
  };

  const handleAxis = (groups, vars) => {
    const x = d3.scaleBand()
                .range([ 0, width ])
                .domain(groups)
                .padding(0.05)
    const y = d3.scaleBand()
                .range([ height, 0 ])
                .domain(vars)
                .padding(0.05)
    return [x, y];
  }

  const handleScale = (groups) => {
    const color = d3.scaleSequential()
                    .interpolator(d3.interpolateOranges)
                    .domain(groups)
    return color;
  };

  const createHeatmap = (div) => {
    const myGroups = ["A", "B", "C"]
    const myVars = ["v1", "v2", "v3"]
    const data = [
      {group: 'A', variable: 'v1', value: 70},
      {group: 'A', variable: 'v2', value: 66},
      {group: 'A', variable: 'v3', value: 10},
      {group: 'B', variable: 'v1', value: 30},
      {group: 'B', variable: 'v2', value: 90},
      {group: 'B', variable: 'v3', value: 100},
      {group: 'C', variable: 'v1', value: 26},
      {group: 'C', variable: 'v2', value: 48},
      {group: 'C', variable: 'v3', value: 88},
    ]
    const svg = drawSvg(div);
    const [x, y] = handleAxis(myGroups, myVars);
    const color = handleScale([1, 100]);
    const tooltip = createTooltip('.content')

    svg.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(x))
        .select('.domain').remove();
    svg.append('g')
        .call(d3.axisLeft(y))
        .select('.domain').remove();

    svg.selectAll()
        .data(data, (d) => `${d.group}: ${d.variable}`)
        .join('rect')
        .attr('x', (d) => x(d.group))
        .attr('y', (d) => y(d.variable))
        .attr("rx", 14)
        .attr("ry", 14)
        .attr('width', x.bandwidth())
        .attr('height', y.bandwidth())
        .style('fill', (d) => color(d.value))
        .style("stroke-width", 4)
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on('mouseover', function() {
          tooltip.style('opacity', 1);

          d3.select(this)
            .style('stroke', 'black')
            .style('opacity', 1)
        })
        .on('mousemove', function(event, d) {
          tooltip.html(`<div>This cell value is ${d.value}</div>`)
                // .style('display', 'block')
                .style('left', `${event.pageX}px`)
                .style('top', (event.pageY - 100) + 'px')
        })
        .on('mouseleave', function() {
          tooltip.style('opacity', 0);
                
          d3.select(this)
            .style('stroke', 'none')
            .style('opacity', 0.8)
        })

  };

  useEffect(() => {
    if (svgRef.current) {
      createHeatmap(svgRef.current);
    }
  },[svgRef])

  return (
    <div className='content'>
      <svg ref={svgRef} />
    </div>
  )
}

export default Heatmap;