var d3 = require('d3');
var ns = {};

var plotPosition = function(el, features, xMap, yMap){
  d3.select(el).select('svg')
    .selectAll('.position')
    .data([features])
    .enter().append('circle')
    .attr('class', 'position')
    .attr('r', 2.5)
    .attr('cx', xMap)
    .attr('cy', yMap)
    .style('fill', 'black');
}

var updatePosition = function(el, features, xMap, yMap){
  d3.select(el).select('svg')
    .selectAll('.position')
    .data([features])
    .attr('class', 'position')
    .attr('r', 2.5)
    .attr('cx', xMap)
    .attr('cy', yMap)
    .style('fill', 'black');
}

ns.create = function(el, props) {
  var svg = d3.select(el)
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('class', 'scatterChart');

  var h = this._helpers(el, {
    domain: props.domain,
    xVal: props.xVal,
    yVal: props.yVal,
    width: props.width,
    height: props.height
  });

  this._drawAxis(svg, {
    scales: h.scales,
    width: h.width,
    height: h.height,
    xVal: props.xVal,
    yVal: props.yVal
  });

  this._drawPoints(svg, {
    scales: h.scales,
    xVal: props.xVal,
    yVal: props.yVal,
    x: h.x,
    y: h.y,
    legend: props.legend
  });

  plotPosition(el, props.features, h.x, h.y)
}

ns.update = function(el, props){
  var h = this._helpers(el, props)
  updatePosition(el, props.features, h.x, h.y)
}

ns._helpers = function(el, props) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40};

  var xVal = props.xVal,
    yVal = props.yVal,
    domain = {
      x: props.domain[xVal],
      y: props.domain[yVal]},
    height = props.height - margin.top - margin.bottom,
    width = props.width - margin.left - margin.right,
    x = d3.scale.linear()
      .domain(domain.x)
      .range([0, width]),
    y = d3.scale.linear()
      .domain(domain.y)
      .range([height, 0]),
    c = d3.scale.category10(),
    xMap = function(d){ return x(d[xVal])},
    yMap = function(d){ return y(d[yVal])};

  return {
    scales: {
      x: x,
      y: y,
      c: c},
    x: xMap,
    y: yMap,
    height: height,
    width: width
  }
}

ns._drawAxis = function(svg, props) {
  var xAxis = d3.svg.axis().scale(props.scales.x).orient('bottom'),
    yAxis = d3.svg.axis().scale(props.scales.y).orient('right');

  // x-axis
  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + props.height + ')')
    .call(xAxis)
    .append('text')
    .attr('class', 'label')
    .attr('x', props.width - 5)
    .attr('y', -2)
    .style('text-anchor', 'end')
    .text(props.xVal);

  // y-axis
  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(' + props.width + ', 0)')
    .call(yAxis)
    .append('text')
    .attr('class', 'label')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '-1.2em')
    .style('text-anchor', 'end')
    .text(props.yVal);
}

ns._drawPoints = function(svg, props) {
  d3.csv('/build/iris.csv', function(data) {

    data.forEach(function(d) {
      d[props.xVal] = +d[props.xVal];
      d[props.yVal] = +d[props.yVal];
    });

    // draw dots
    svg.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 2.5)
      .attr('cx', props.x)
      .attr('cy', props.y)
      .style('opacity', 0.6)
      .style('fill', function(d) { return props.scales.c(d.Species);});

    if(props.legend){
      var legend = svg.selectAll('.legend')
        .data(props.scales.c.domain())
        .enter().append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
          return 'translate(0,' + i * 13 + ')'; 
        });

      legend.append('rect')
        .attr('x', 10)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', props.scales.c);

      legend.append('text')
        .attr('x', 24)
        .attr('y', 5)
        .attr('dy', '.25em')
        .style('text-anchor', 'begin')
        .text(function(d) { return d;})
    }
  });
}

export default ns;
