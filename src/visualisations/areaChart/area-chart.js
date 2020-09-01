import * as d3 from 'd3';

import './area-chart.scss';

const baseColor = '#444444';
const textColor = '#737070';
const circleColor = '#E43556';
const circleInnerColor = 'white';
const textFontSize = '14px';
const yStrokeColor = '#282828';
const yStrokeDash = "6, 3";
const xAxisOffset = 20;
const wrapperWidth = 56;
const wrapperHeight = 40;

const formatMonth = d3.timeFormat('%b')

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

function addChartGradient(svg, uniqKey) {
  const gradient = ['rgba(67,66,66,0.9)', 'rgba(117,117,117,0.1)'];
  const colorScale = d3.scaleLinear().range(gradient).domain([1, 2]);
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
  const gradient = ['white', 'rgb(114,97,97)'];
  const colorScale = d3.scaleLinear().range(gradient).domain([1, 2]);
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
    labelsArray.push(formatMonth(items[i].label.toDate()));
  }
  const uniqMonths = Array.from(new Set(labelsArray));

  const xPositions = uniqMonths.map(month => {
    const start = labelsArray.indexOf(month);
    const end = labelsArray.lastIndexOf(month) < (labelsArray.length - 1) ? labelsArray.lastIndexOf(month) + 1: labelsArray.lastIndexOf(month);
    let dateStart = items[start].label.toDate();
    let endDate = items[end].label.toDate();
    if(start !== 0) {
      dateStart.setDate(1);
    }
    if(end !== labelsArray.length - 1) {
      endDate.setDate(0);
    }
    return new Date((dateStart.getTime() + endDate.getTime()) / 2);
  });

  return uniqMonths.map((month, i) => ({
    month,
    position: xPositions[i]
  }))
}

function removeAxisParts({svg}) {
  const yAxis = svg.select('.area-chart__y-axis');
  yAxis
      .selectAll('text')
      .remove();
  yAxis.selectAll('path').remove();
  yAxis.selectAll('g:first-of-type').remove();

  svg
      .select('.area-chart__x-axis')
      .selectAll('line').remove();

  const xGridElement = svg.select(".area-chart__x-grid")

  xGridElement.select('path').remove();
  xGridElement.select('.tick').remove();
  xGridElement.selectAll('text').remove();
}

function createAxis({svg}) {
  svg.append("g")
      .attr("class", "area-chart__x-axis")
  svg.append("g")
      .attr("class", "area-chart__x-grid")
      .attr("stroke", "url(#area-chart__x-axis-gradient)")
  svg.append("g")
      .attr("class", "area-chart__y-axis")
      .style("stroke-dasharray", yStrokeDash)
}

function updateAxis({
                      svg,
                      yScale,
                      xScale,
                      height,
                      maxValue,
                      width,
                      items}) {
  const yAxis = d3.axisRight(yScale);
  const xAxis = d3.axisBottom(xScale);
  const positions = calculateTextPositions(items);

  const xAxisElement = svg.select(".area-chart__x-axis")
    .attr('transform', `translate(0, ${height - xAxisOffset})`)
    .call(xAxis.tickSize(0));

  xAxisElement.select('path').attr('stroke', baseColor);
  xAxisElement.selectAll('text').remove();

  const xGridElement = svg.select(".area-chart__x-grid")
    .attr("stroke", "url(#area-chart__x-axis-gradient)")
    .call(
      xAxis
        .ticks(6)
        .tickSize(height - xAxisOffset)
    );

  xGridElement.selectAll('line').attr("stroke", yStrokeColor);

  const yAxisElement = svg.select(".area-chart__y-axis")
    .style("stroke-dasharray", yStrokeDash)
    .call(
      yAxis
        .tickValues([0, maxValue / 2 - maxValue / 20, maxValue - maxValue / 20])
        .tickSize(width)
    );
  svg.select(".area-chart__positions-container").remove();

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

  removeAxisParts({svg});

  return {
    xAxisElement,
    yAxisElement,
  }
}

function buildTooltip({group, x, y, tooltipValue, additionalClass}) {
  const fo = group
    .append('foreignObject')
    .style('pointer-events', 'none');

  const tooltip = fo
    .attr('width', wrapperWidth)
    .attr('height', wrapperHeight)
    .attr('x', x - wrapperWidth / 2)
    .attr('y', y - wrapperHeight)
    .append("xhtml:div");

  tooltip
    .classed('area-chart__tooltip', true)
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

function renderCircle({cx, cy, svg}) {
  const circleGroup = svg
    .append('g')
    .attr('class', `area-chart__circle-group 'area-chart__circle-group--active'`);

  circleGroup
    .append('circle')
    .attr('r', 5)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill', circleColor);

  circleGroup
    .append('circle')
    .attr('r', 2)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('fill',circleInnerColor)
}

function findDataItem(data, datePoint) {
  const i = d3.bisector(d => d.label.toDate()).left(data, datePoint); // returns the index to the current data item

  if (i === 0) return data[i];
  const d0 = data[i - 1].label.toDate();
  if (i >= data.length) return data[i - 1];
  const d1 = data[i].label.toDate();
  // work out which date value is closest to the mouse
  const realIndex = datePoint - d0 > d1 - datePoint ? i : i - 1;
  return data[realIndex];
}

export function areaChart({
                            data, width = 510, height = 255, selector, uniqKey
                          }) {
  const maxValue = Math.max(...data.map(x => x.value), 0);
  const minValue = Math.min(...data.map(x => x.value), 0);

  /*calculate metrics*/
  const xScale = d3.scaleTime()
    .domain([data[0].label.toDate(), data[data.length - 1].label.toDate()])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .range([height - 20, 0])
    .domain([minValue, maxValue + maxValue / 10]);

  const lineScale = d3.line()
    .x(function (d) {
      return xScale(d.label.toDate());
    })
    .y(function (d) {
      return yScale(d.value);
    })
      .curve(d3.curveCatmullRom.alpha(0.5));

  const areaScale = d3.area()
    .x(function (d) {
      return xScale(d.label.toDate());
    })
    .y0(height - 20)
    .y1(function (d) {
      return yScale(d.value);
    })
      .curve(d3.curveCatmullRom.alpha(0.5));


  const chartContainer = d3.select(selector)
    .append('svg')
    .attr("class", "area-chart");

  addXGridGradient(chartContainer);
  addChartGradient(chartContainer, uniqKey);
  addLineGradient(chartContainer, uniqKey);

  const svg = chartContainer.data(data)
    .attr('width', width)
    .attr('height', height)
    .append('g');

  createAxis({svg});
  updateAxis({svg, height, maxValue, width, items: data, xScale, yScale});

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

  chartContainer
  .on('mouseover', function () {
    const gr = svg
        .append('g')
        .attr('class', 'area-chart__tooltip-group')
    const mouseData = d3.mouse(this);

    const datePoint = xScale.invert(mouseData[0]);
    const item = findDataItem(data, datePoint);

    renderCircle({
      cx: xScale(item.label.toDate()),
      cy: yScale(item.value),
      svg: gr,
    });
    buildTooltip({
      group: gr,
      x: xScale(item.label.toDate()),
      y: yScale(item.value),
      tooltipValue: item.tooltipValue,
    })
  })
  .on('mousemove', function () {
    const mouseData = d3.mouse(this);
    const datePoint = xScale.invert(mouseData[0]);
    const item = findDataItem(data, datePoint);
    const group = svg
        .select('.area-chart__tooltip-group');
    if(!group.select(`[data-item="${item.label.toDate()}"]`).empty()) {
      return;
    }
    group.attr('data-item', item.label.toDate())
    group
        .selectAll('circle')
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr('cx', xScale(item.label.toDate()))
        .attr('cy', yScale(item.value));

    group
        .select('foreignObject')
        .transition()
        .duration(50)
        .ease(d3.easeLinear)
        .attr('x', xScale(item.label.toDate()) - wrapperWidth / 2)
        .attr('y', yScale(item.value) - wrapperHeight);

    group
        .select('.area-chart__content')
        .html(item.tooltipValue);
  })
  .on('mouseout', () => {
        svg
            .select('.area-chart__tooltip-group')
            .attr('class', '')
            .transition()
            .duration(400)
            .style('opacity', 0)
            .remove()
  })

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

    updateAxis({svg, height: newProps.height, maxValue, width: newProps.width, items: data, xScale, yScale});
  };
}
