import * as d3 from 'd3';
import './area-chart.scss';

const baseColor = '#444444';
const textColor = '#9B9B9B';
const circleColor = '#E43556';
const blueCircleColor = '#6549B8';
const circleInnerColor = 'white';
const textFontSize = '12px';
const yStrokeColor = '#282828';
const yStrokeDash = "6, 3";
const xAxisOffset = 20;

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

function addXGridGradient(svg) {
  const colorScale = d3.scaleLinear().range([textColor, '#12110F', 'black']).domain([1, 2, 3]);
  const linearGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "area-chart__x-axis-gradient");

  linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(1));

  linearGradient.append("stop")
    .attr("offset", "75%")
    .attr("stop-color", colorScale(2));

  linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(3));
}

function addChartGradient(svg, theme, uniqKey) {
  const redGradient = ['rgba(233, 80, 90, 0.9)', 'rgba(233, 80, 90, 0.1)'];
  const blueGradient = ['rgba(101, 73, 184, 0.9)', 'rgba(101, 73, 184, 0.1)'];
  const colorScale = d3.scaleLinear().range(theme === 'redStyle' ? redGradient : blueGradient).domain([1, 2]);
  const linearGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", `area-chart__area-gradient${uniqKey}`)
    .attr("gradientTransform", "rotate(90)");

  linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(1));

  linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(2));
}

function addLineGradient(svg, theme, uniqKey) {
  const redGradient = ['white', '#E43556'];
  const blueGradient = ['white', '#8560F9'];
  const colorScale = d3.scaleLinear().range(theme === 'redStyle' ? redGradient : blueGradient).domain([1, 2]);
  const linearGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", `area-chart__line-gradient${uniqKey}`)
    .attr("gradientTransform", "rotate(90)");

  linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale(1));

  linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale(2));
}

function calculateTextPositions(items) {
  const labelsArray = [];
  for (let i = 0; i < items.length; i++) {
    const month = (new Date(items[i].label)).getMonth();
    labelsArray.push(months[month]);
  }
  const uniqMonths = Array.from(new Set(labelsArray));

  const xPositions = uniqMonths.map(month => {
    const start = labelsArray.indexOf(month);
    const end = labelsArray.lastIndexOf(month);
    return start + (end - start) / 2;
  });
  return uniqMonths.map((month, i) => ({
    month,
    position: xPositions[i]
  }))
}

function renderAxis({svg, yScale, xScale, height, maxValue, width, items}) {
  const yAxis = d3.axisRight(yScale);
  const xAxis = d3.axisBottom(xScale);
  const positions = calculateTextPositions(items);

  const xAxisElement = svg.append("g")
    .attr("class", "area-chart__x-axis")
    .attr('transform', `translate(0, ${height - xAxisOffset})`)
    .call(xAxis.tickSize(0));

  xAxisElement.select('path').attr('stroke', baseColor);
  xAxisElement.selectAll('text').remove();

  const xGridElement = svg.append("g")
    .attr("class", "area-chart__x-grid")
    .attr("stroke", "url(#area-chart__x-axis-gradient)")
    .call(
      xAxis
        .ticks(6)
        .tickSize(height - xAxisOffset)
    );

  xGridElement.selectAll('line').attr("stroke", yStrokeColor);

  const yAxisElement = svg.append("g")
    .attr("class", "area-chart__y-axis")
    .style("stroke-dasharray", yStrokeDash)
    .call(
      yAxis
        .tickValues([0, maxValue / 2 - maxValue / 20, maxValue - maxValue / 20])
        .tickSize(width)
    );
  const positionsContainer = svg
      .append('g')
      .attr("class", "area-chart__positions-container")


  positions.forEach(({
                       position, month
                     }) => {
    positionsContainer
      .append('g')
      .attr('transform', `translate(${xScale(position)}, ${height})`)
      .append('text')
      .style('fill', textColor)
      .style('font-size', textFontSize)
      .text(month.toUpperCase());
  });

  yAxisElement.selectAll('line').attr('stroke', yStrokeColor);


  yAxisElement.selectAll('text').remove();
  yAxisElement.selectAll('path').remove();
  yAxisElement.selectAll('g:first-of-type').remove();

  xAxisElement.selectAll('line').remove();

  xGridElement.select('path').remove();
  xGridElement.select('.tick').remove();
  xGridElement.selectAll('text').remove();

  return {
    xAxisElement,
    yAxisElement,
  }
}

function buildTooltip({group, x, y, tooltipValue, additionalClass, theme}) {
  const fo = group
    .append('foreignObject')
    .style('pointer-events', 'none');

  const wrapperWidth = 56;
  const wrapperHeight = 40;
  const tooltip = fo
    .attr('width', wrapperWidth)
    .attr('height', wrapperHeight)
    .attr('x', x - wrapperWidth / 2)
    .attr('y', y - wrapperHeight)
    .append("xhtml:div");

  tooltip
    .classed('area-chart__tooltip', true)
    .classed('area-chart__tooltip--blue', theme !== 'redStyle')
    .classed(additionalClass, true);

  tooltip.append('div')
    .attr('class', 'area-chart__container')
    .append('div')
    .attr('class', 'area-chart__content')
    .html(tooltipValue);

  tooltip
    .append('div')
    .attr('class', 'area-chart__arrow')
}

function renderCircle({cx, cy, isActive, svg, theme}) {
  const circleGroup = svg
    .append('g')
    .attr('class', `area-chart__circle-group ${isActive ? 'area-chart__circle-group--active' : 'area-chart__circle-group--inactive'}`);
  const themedCircleColor = theme === 'redStyle' ? circleColor : blueCircleColor;

  circleGroup
    .append('circle')
    .attr('r', 5)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', isActive ? themedCircleColor : circleInnerColor);

  circleGroup
    .append('circle')
    .attr('r', 2)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', isActive ? circleInnerColor : themedCircleColor)
}

function renderHiddenBars({items, yScale, xScale, svg, width, height, theme}) {
  const barWidth = width / (items.length - 1);
  const hiddenBarGroup = svg
      .append('g')
      .attr('class', `area-chart__hidden-bars`);

  items.forEach((value, i) => {
    const isBorderValues = i === 0 || i === items.length - 1;
    const barOffset = i === 0 ? 0 : barWidth / 2;
    const localBarWidth = isBorderValues ? barWidth / 2 : barWidth;
    hiddenBarGroup
      .append('rect')
      .attr('x', xScale(i) - barOffset)
      .attr('y', 0)
      .attr('width', localBarWidth)
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('mouseover', () => {
        const tooltipGroup = svg
            .append('g')
            .attr('class', 'area-chart__tooltip-group');
        renderCircle({
          cx: xScale(i),
          cy: yScale(value.value),
          svg: tooltipGroup,
          isActive: true,
          theme
        });
        buildTooltip({
          group: tooltipGroup,
          x: xScale(i),
          y: yScale(value.value),
          tooltipValue: value.tooltipValue,
          theme
        })
      })
      .on('mouseout', () => {
        svg.select('.area-chart__tooltip-group').remove();
        svg.select('foreignObject').remove();
      });
  });
}

function renderMaxMinValues({
                              xScale, yScale, maxValue, svg, items, theme
                            }) {
  const container = svg
      .append('g')
      .attr('class', 'area-chart__min-max-container')
  const maxIndex = items.findIndex(x => x.value === maxValue);
  renderCircle({
    cx: xScale(maxIndex),
    cy: yScale(maxValue),
    svg: container,
    theme
  });

  container
    .append('g')
    .attr('width', '50px')
    .attr('transform', `translate(${xScale(maxIndex)}, ${yScale(maxValue) - 20})`)
    .attr('fill', 'white')
    .append('text')
    .style('font-size', textFontSize)
    .attr('text-anchor', 'middle')
    .text(items[maxIndex].tooltipValue);
}

export function areaChart({
                            data, width = 510, height = 255, selector, theme = 'redStyle', uniqKey
                          }) {
  const maxValue = Math.max(...data.map(x => x.value));
  const minValue = Math.min(...data.map(x => x.value));
  const lineCurve = theme === 'redStyle' ? d3.curveCatmullRom.alpha(0.5) : d3.curveLinear;

  /*calculate metrics*/
  const xScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .range([height - 20, 0])
    .domain([0, maxValue + maxValue / 10]);

  const lineScale = d3.line()
    .x(function (d, i) {
      return xScale(i);
    })
    .y(function (d) {
      return yScale(d.value);
    })
    .curve(lineCurve);

  const areaScale = d3.area()
    .x(function (d, i) {
      return xScale(i);
    })
    .y0(height - 20)
    .y1(function (d) {
      return yScale(d.value);
    })
    .curve(lineCurve);

  const chartContainer = d3.select(selector)
    .append('svg')
    .attr("class", "area-chart");

  addXGridGradient(chartContainer);
  addChartGradient(chartContainer, theme, uniqKey);
  addLineGradient(chartContainer, theme, uniqKey);

  const svg = chartContainer.data(data)
    .attr('width', width)
    .attr('height', height)
    .append('g');

  renderAxis({svg, height, maxValue, width, items: data, xScale, yScale});

  svg
    .append('g')
    .append('path')
    .attr("class", "area-chart__area-gradient")
    .datum(data)
    .attr('fill', `url(#area-chart__area-gradient${uniqKey})`)
    .attr('d', areaScale);

  svg
    .append('g')
    .append('path')
    .attr("class", "area-chart__area-path")
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', `url(#area-chart__line-gradient${uniqKey})`)
    .attr('stroke-width', '1px')
    .attr('d', lineScale);
  renderMaxMinValues({maxValue, minValue, svg, items: data, yScale, xScale, theme});
  renderHiddenBars({items: data, yScale, xScale, height, width, svg, theme});

  return (newProps) => {
    xScale.range([0, newProps.width]);
    yScale.range([newProps.height - 20, 0]);
    areaScale
        .y0(newProps.height - 20)
    chartContainer
        .attr('width', newProps.width)
        .attr('height', newProps.height);

    svg
        .select('.area-chart__area-gradient')
        .datum(data)
        .attr('d', areaScale);
    svg
        .select('.area-chart__area-path')
        .datum(data)
        .attr('d', lineScale);

    svg.selectAll('.area-chart__x-axis').remove();
    svg.selectAll('.area-chart__x-grid').remove();
    svg.selectAll('.area-chart__y-axis').remove();
    svg.selectAll('.area-chart__min-max-container').remove();
    svg.selectAll('.area-chart__positions-container').remove();
    svg.selectAll('.area-chart__hidden-bars').remove();
    renderAxis({svg, height: newProps.height, maxValue, width: newProps.width, items: data, xScale, yScale});

    renderMaxMinValues({maxValue, minValue, svg, items: data, yScale, xScale, theme});
    renderHiddenBars({items: data, yScale, xScale, height, width, svg, theme});

  };
}
