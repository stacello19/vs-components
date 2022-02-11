import * as d3 from 'd3';

export const createDomain = (data, key) => {
  const uniqArr = new Set(data.map(el => el[key]));
  return Array.from(uniqArr);
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