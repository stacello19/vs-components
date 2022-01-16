import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const data = [{type: 'a', value: 200}, {type:'b', value: 300}, {type:'c', value: 100}];

const Pie = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (svgRef.current) {
      drawSvg(svgRef.current)
    }
  },[svgRef])

  const drawSvg = (div) => {
    const svg = d3.select(div)
                    .append("g")
                    .attr("transform", "translate(" + 400 / 2 + "," + 400 / 2 + ")");

    const data_ready = createPie();
    const color = handleScale();
    const radius = Math.min(400, 400) / 2;
    svg
        .selectAll('.arc')
        .data(data_ready)
        .enter()
        .append('path')
        .attr('class', 'arc')
        .attr('d', d3.arc()
          .innerRadius(0)
          .outerRadius(radius)
        )
        .attr('fill', (d) => color(d.value))
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
  }

  const handleScale = () => {
    const ordScale = d3.scaleOrdinal()
                      .domain(data.map(el => el.type))
                      .range(['#ffd384','#94ebcd','#fbaccc']);
    return ordScale;
  };

  const createPie = () => {
    const pie = d3.pie()
                .value(d => d.value);
    return pie(data);
  }
  return(
    <svg 
      ref={svgRef}
      width={400}
      height={400}
    />
  )
};

export default Pie;

