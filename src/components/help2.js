import * as d3 from 'd3';

export const createDomain = (data, key) => {
  return data.map(el => el[key]);
};

export const createColorPalette = (type, len) => {
  switch (type) {
    case 'Color-1':
      return d3.schemeCategory10.slice(0, len);
    case 'Color-2':
      return d3.schemeAccent.slice(0, len);
    case 'Color-3':
      return d3.schemeDark2.slice(0, len);
    case 'Color-4':
      return d3.schemePaired.slice(0, len);
    case 'Color-5':
      return d3.schemePastel1.slice(0, len);
    case 'Color-6':
      return d3.schemePastel2.slice(0, len);
    case 'Color-7':
      return d3.schemeSet1.slice(0, len);
    case 'Color-8':
      return d3.schemeSet2.slice(0, len);
    case 'Color-9':
      return d3.schemeSet3.slice(0, len);
    case 'Color-10':
      return d3.schemeTableau10.slice(0, len);
    default:
      return [];
  }
}

export const parseTooltipText = (text, dataObj, format) => {  
  const newText = text.replace(/%.*?%/g, (match) => {
    const str = match.replace(/[^()_a-zA-Z0-9-]+/g, '');
    const value = dataObj[str]
    console.log('>>>', format, value)
    if (format === 'decimal') {
      return d3.format('.2f')(value);
    } else if (format === 'percentage') {
      return d3.format('.2%')(value < 0 ? value : value/100)
    } else if (format === 'currency') {
      return d3.format('($.2f')(value)
    } else if (format === 'thousand') {
      return d3.format(',.0f')(value)
    }
    return value;
  });
  return newText
};

export const createTooltip = (className) => {
  const tooltipDiv = d3.select(className)
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('opacity', 0)
  return tooltipDiv
};

export const createLabels = (svg, height, width, margin, label) => {
  svg.append('text')
    .attr('class', 'label')
    .attr('x', -(height)/2)
    .attr('y', -(margin.left+margin.right)/2)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text(label.xLabel)

  svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2)
    .attr('y', height + (margin.bottom + margin.top)/2)
    .attr('text-anchor', 'middle')
    .text(label.yLabel);
}

export const showLegend = (svg, color, legend, groups, width, margin) => {
  const { type, size } = legend;
  if (type === 'square') {
    svg.selectAll('legendColor')
      .data(groups)
      .enter()
      .append('rect')
      .attr('x', width - 100)
      .attr('y', function(d,i){ return (-margin.top/2) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('width', size)
      .attr('height', size)
      .style('fill', function(d){ return color(d)})
  } else if (type === 'circle') {
    svg.selectAll('legendColor')
      .data(groups)
      .enter()
      .append('circle')
      .attr('cx', width - 100)
      .attr('cy', function(d,i){ return (-margin.top/2) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr('r', size)
      .style('fill', function(d){ return color(d)})
  }

  // Add one dot in the legend for each name.
  svg.selectAll('legendLabel')
    .data(groups)
    .enter()
    .append('text')
    .attr('x', type === 'square' ? width - 100 + size*1.2 : width - 100 + 20)
    .attr('y', function(d,i){ return type === 'square' ? (-margin.top/2) + i*(size+5) + (size/2) : (-margin.top/2) + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
    .style('fill', function(d){ return color(d)})
    .text(d => legend.text[d])
    .attr('text-anchor', 'left')
    .style('alignment-baseline', 'middle')
}

export const drawSvg = (div, width, height, margin, type) => {
  let svg;
  if (type === 'bar') {
    svg = d3.select(div)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.right})`);
  } else if (type === 'pie') {
    svg = d3.select(div)
      .append('g')
      .attr('transform', `translate(${width/2},${height/2})`);
  }
  return svg;
};

export const createColorInterpolate = (type) => {
  switch (type) {
    case 'Int-1':
      return d3.interpolateViridis;
    case 'Int-2':
      return d3.interpolateInferno;
    case 'Int-3':
      return d3.interpolateMagma;
    case 'Int-4':
      return d3.interpolatePlasma;
    case 'Int-5':
      return d3.interpolateWarm;
    case 'Int-6':
      return d3.interpolateCool;
    case 'Int-7':
      return d3.interpolateCubehelixDefault;
    case 'Int-8':
      return d3.interpolateBuGn;
    case 'Int-9':
      return d3.interpolateBuPu;
    case 'Int-10':
      return d3.interpolateGnBu;
    case 'Int-11':
      return d3.interpolateOrRd;
    case 'Int-12':
      return d3.interpolatePuBuGn;
    case 'Int-13':
      return d3.interpolatePuBu;
    case 'Int-14':
      return d3.interpolatePuRd;
    case 'Int-15':
      return d3.interpolateRdPu;
    case 'Int-16':
      return d3.interpolateYlGnBu;
    case 'Int-17':
      return d3.interpolateYlGn;
    case 'Int-18':
      return d3.interpolateYlOrBr;
    case 'Int0-19':
      return d3.interpolateYlOrRd;
    default:
      return [];
  }
}