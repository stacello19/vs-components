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

export const parseTooltipText = (text, dataObj) => {  
  const newText = text.replace(/%.*?%/g, (match) => {
    const str = match.replace(/[^()_a-zA-Z0-9-]+/g, '');
    return dataObj[str];
  });
  return newText
};

export const createTooltip = (className) => {
  const tooltipDiv = d3.select(className)
    .append('div')
    .attr('class', 'tooltip2')
    .style('position', 'absolute')
    .style('opacity', 0)
  return tooltipDiv
};