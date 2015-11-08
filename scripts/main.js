var React = require('react');
var ReactDom = require('react-dom');

var Catalyst = require('react-catalyst');
var ScatterPlot = require('./scatterPlot');
var Bar = require('./barChart');

/*
 * App
*/
var App = React.createClass({
  mixins: [Catalyst.LinkedStateMixin],
  getInitialState: function(){
    var domain = {
      'Sepal Width': [1.0, 5.0],
      'Sepal Length': [3.5, 8.5],
      'Petal Width': [0.0, 3.5],
      'Petal Length': [0.0, 7.5]
    }
    var dimensions= Object.keys(domain);
    var features = {};
    for(var j=0; j < dimensions.length; j++){
      var key = dimensions[j];
      features[key] = 0.5 * (domain[key][0] + domain[key][1]) ;
    }
    return {
      domain: domain,
      features: features
    }
  },
  render: function(){
    return (
      <div>
        <Header />
        <div className='container'>
          <div className='row'>
            <Features domain={this.state.domain} features={this.state.features} 
                      linkState={this.linkState} />
            <div className='col-md-10'>
              <BarChart features={this.state.features}/>
              <ScatterNav features={this.state.features}
                          domain={this.state.domain}/>
            </div>
          </div>
        </div>
      </div>
  )}
});

/*
 * Header
*/
var Header = React.createClass({
  render: function(){
    return(
      <div className="jumbotron">
        <div className="container">
          <h1>Interactive Models with Flask and ReactJS</h1>
          <p>Illustrating how to display an interactive model using the Python <a href="http://flask.pocoo.org/">Flask</a> framework and <a href="https://facebook.github.io/react/">ReactJS</a>.  We use the famous <a href="http://en.wikipedia.org/wiki/Iris_flower_data_set">iris dataset</a> to train a <a href="http://en.wikipedia.org/wiki/Random_forest">random forest</a> in <a href="http://scikit-learn.org/stable/">scikit-learn</a>, and put up an interactive dashboard giving predictions.
          </p>
          </div>
    </div>
    )
  }
});

/*
 * Features
*/
var Features = React.createClass({
  renderFeature: function(key){
    var domain = this.props.domain[key];
    var linkState = this.props.linkState;
    return (
      <div className='form-group' key={key}>
        <label className='col-md-4 control-label'>{key}:</label>
        <div className='col-md-8'>
          <input className='form-control' type='number' 
            min={domain[0]} max={domain[1]} step="0.05"
            valueLink={linkState('features.' + key)}/>
        </div>
      </div>
    )
  },
  render: function(){
    return(
      <div className='col-md-2'>
        <h2>Features</h2>
          <form className='form-horizontal'>
            {Object.keys(this.props.domain).map(this.renderFeature)}
          </form>
      </div>
    )
  }
});

/*
 * BarChart
*/
var BarChart = React.createClass({
  componentDidMount: function() {
    var el = ReactDom.findDOMNode(this);
    Bar.create(el, {
      features: this.props.features,
      width: '450',
      height: '400'});
  },
  componentDidUpdate: function() {
    var el = ReactDom.findDOMNode(this);
    Bar.update(el, {
      features: this.props.features,
      width: '450',
      height: '400'});
  },
  render: function(){
    return(
      <div className='col-md-6'>
        <h2>Class Probabilities</h2>
      </div>
    )
  }
});


/*
 * ScatterNav
*/
var ScatterNav = React.createClass({
  render: function(){
    return(
      <div className='col-md-6'>
        <Scatter width='500' height='200' 
        xVal='Sepal Width' yVal='Sepal Length' 
        domain={this.props.domain} features={this.props.features} legend />

        <Scatter width='500' height='200'
        xVal='Petal Width' yVal='Petal Length' 
        domain={this.props.domain} features={this.props.features} />
      </div>
    )
  }
});

/* 
 * Scatter
 */
var Scatter = React.createClass({
  componentDidMount: function() {
    var el = ReactDom.findDOMNode(this);
    ScatterPlot.create(
      el, {
        width: this.props.width,
        height: this.props.height,
        domain: this.props.domain,
        xVal: this.props.xVal,
        yVal: this.props.yVal,
        legend: this.props.legend,
        features: this.props.features
      })
  },
  componentDidUpdate: function() {
    var el = ReactDom.findDOMNode(this);
    ScatterPlot.update(
      el, {
        width: this.props.width,
        height: this.props.height,
        domain: this.props.domain,
        xVal: this.props.xVal,
        yVal: this.props.yVal,
        features: this.props.features
      })
  },
  render: function(){
    return <span></span>
  }
})

ReactDom.render(<App />, document.querySelector('#main'))
