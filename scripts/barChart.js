var d3 = require('d3');
var $ = require('jquery');
var ns = {}

ns.create = function(el, props){
  var svg = d3.select(el)
    .append('svg')
    .attr('width', props.width)
    .attr('height', props.height)
    .attr('class', 'barChart');

  var h = this._helpers(el, {
    width: props.width,
    height: props.height
  })

  $.get(this._url(props), function(data){
    svg.selectAll('rect')
      .data(data.data, function(d){ return d.label;})
      .enter()
      .append('rect')
      .attr('width', h.barWidth)
      .attr('fill', function(d){return h.c(d.label)})
      .attr('x', function(d, i) { return i * (h.barWidth + h.barPadding) })
      .attr('height', 0)
      .attr('y', h.height)
      .transition()
      .duration(h.duration)
      .ease(h.ease)
      .attr('height', function(d){return h.height - h.y(d.prob)})
      .attr('y', function(d){return h.y(d.prob)});

    var text = svg.selectAll('text')
      .data(data.data, function(d){ return d.label; })

    text.enter()
      .append('text')
      .attr('x', function(d, i) { return i * (h.barWidth + h.barPadding) })
      .attr('dx', h.barWidth/2)
      .attr('dy', '1.2em')
      .attr('text-anchor', 'middle')
      .text(function(d) {return (100 * d.prob).toFixed(1) + '%';})
      .attr('fill', 'white')
      .attr('y', h.height)
      .transition()
      .duration(h.duration)
      .ease(h.ease)
      .attr('y', function(d){ return h.y(d.prob)});

    text.enter()
			.append('text')
			.attr('y', 10 + h.height)
      .attr('x', function(d, i) { return i * (h.barWidth + h.barPadding);})
			.attr('dx', h.barWidth/2)
			.attr('text-anchor', 'middle')
			.attr('fill', 'black')
			.text(function(d) { return d.label;});
  })
}

ns._helpers = function(el, props){
  var margin = {top: 0, right: 20, bottom: 30, left: 40},
    width = props.width - margin.left - margin.right,
    height = props.height - margin.top - margin.bottom,
    yScale = d3.scale.linear()
      .domain([0, 1])
      .range([height, 0]),
    colorScale = d3.scale.category10(),
    barWidth = width / 3;

  return {
    y: yScale,
    c: colorScale,
    width: width,
    height: height,
    barWidth: barWidth,
    barPadding: 2,
    duration: 300,
    ease: 'linear'
  }
}

ns._url = function(props) {
  return ('/api/predict?' +
              'sepalLength=' + props.features['Sepal Length'] + '&' +
              'sepalWidth=' + props.features['Sepal Width'] + '&' +
              'petalLength=' + props.features['Petal Length'] + '&' +
              'petalWidth=' + props.features['Petal Width']);
}

ns.update = function(el, props){
  var h = this._helpers(el, {
    width: props.width,
    height: props.height
  })

  $.get(this._url(props), function(data){
    var svg = d3.select(el).select('.barChart');
    svg.selectAll('rect')
      .data(data.data, function(d){ return d.label;})
      .transition()
      .duration(h.duration)
      .ease(h.ease)
      .attr('height', function(d){return h.height - h.y(d.prob)})
      .attr('y', function(d){return h.y(d.prob)});

    svg.selectAll('text')
      .data(data.data, function(d){ return d.label; })
      .transition()
      .duration(h.duration)
      .ease(h.ease)
      .text(function(d) {return (100 * d.prob).toFixed(1) + '%';})
      .attr('y', function(d){ return h.y(d.prob)});
  })
}

export default ns;
