import React, { useRef, useEffect, useCallback } from 'react';
import { createColorPalette } from '../help';
import * as d3 from 'd3';

// const data = [
//   { year: "2006", alex: "104", mindy: "152", sean: "90", karen: "162" },
//   { year: "2007", alex: "122", mindy: "184", sean: "99", karen: "143" },
//   { year: "2008", alex: "50", mindy: "201", sean: "127", karen: "114" },
//   { year: "2009", alex: "150", mindy: "134", sean: "139", karen: "80" }
//   ];
const data = [
  { risk_class: 'VLR', value: 4.442875126405763, diff: 96, max: 100 },
  { risk_class: 'LR', value: 34.950715245783954, diff: 5, max: 39 },
  { risk_class: 'MR', value: 39.38167062435006, diff: 5, max: 44 },
  { risk_class: 'HR', value: 0.937668620369216, diff: 5, max: 5 },
  { risk_class: 'VHR', value: 0, diff: 0, max: 0 },
]

const StackBar = ({ label={show: true, xLabel: 'Sum Percentage %', yLabel: 'Risk Class'}, width=400, height=400, margin=80, groupKey='risk_class', subgroups=['value', 'diff'], colorPalette=[], colorType='Color-6'}) => {
  const svgRef = useRef(null);

  const drawSvg = useCallback((div) => {
    const svg = d3.select(div)
                    .attr('width', width + margin + 50)
                    .attr('height', height + margin + 50)
                    .append("g")
                    .attr("transform", `translate(${margin + 30},${margin / 2})`);
    return svg;
  },[height, width, margin]);

  const handleAxis = useCallback((groups) => {
    const datanum = data.map(obj => Object.keys(obj).reduce((acc, key) => subgroups.includes(key) ? acc + parseInt(obj[key]) : acc+0, 0));
    const domainMax = Math.max(...datanum);

    let x = d3.scaleBand()
              .domain(groups)
              .range([0, width])
              .padding([0.2])
    let  y = d3.scaleLinear()
                .domain([0, Math.ceil(domainMax)])
                .range([ height, 0 ]);
    return [x, y];
  },[width, height, subgroups])

  const handleScale = useCallback(() => {
    const len = subgroups.length;
    const paletteRange = colorPalette.length > 0 ? colorPalette : createColorPalette(colorType, len);
    const color = d3.scaleOrdinal()
                    .domain(subgroups)
                    .range(paletteRange)
    return color;
  },[subgroups, colorPalette, colorType])

  const createPieGraph = useCallback((div) => {
    const svg = drawSvg(div);
    const groups = data.map(d => (d[groupKey]));
    const stackedData = d3.stack().keys(subgroups)(data)
    const [x, y] = handleAxis(groups);
    const color = handleScale();

    // x axis
    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0));
    // y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .selectAll("g")
        .data(stackedData)
        .join("g")
          .attr("fill", d => color(d.key))
          .selectAll("rect")
          .data(d => d)
          .join("rect")
            .attr("x", d => x(d.data[groupKey]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width",x.bandwidth())

    label.show && svg.append('text')
                    .attr('class', 'label')
                    .attr('x', -(height)/2)
                    .attr('y', -margin/1.3)
                    .attr('transform', 'rotate(-90)')
                    .attr('text-anchor', 'middle')
                    .text(label.xLabel)

    label.show && svg.append('text')
                    .attr('class', 'label')
                    .attr('x', width / 2)
                    .attr('y', height + (margin*2)/2.5)
                    .attr('text-anchor', 'middle')
                    .text(label.yLabel);

  },[drawSvg, handleAxis, handleScale, height, subgroups, groupKey, label, margin, width])

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

StackBar.defaultProps = {
  // data: [],
  // domain: [],
  // width: 400,
  // height: 400,
  // margin: {},
  // xAxis: '',
  // yAxis: '',
  // barType: 'vertical',
  // barColor: 'skyblue',
  // text: {
  //   angle: 'titled',
  //   anchor: 'end'
  // },
  // label: {
  //   show: false,
  //   xLabel: '',
  //   yLabel: ''
  // },
  // grid: {
  //   xLine: false,
  //   yLine: false
  // },
  // line: {
  //   show: false,
  //   color: 'white'
  // },
  // info: {
  //   show: false,
  //   location: 'inside',
  //   color: 'black'
  // }
};

export default StackBar;

