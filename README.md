# Ember-cli-dimple

This addon provides an entrypoint for using [PMSI-AlignAlytics/dimple](https://github.com/pmsi-alignalytics/dimple/) with your [ember-cli](https://github.com/stefanpenner/ember-cli) project.

## Installation

Installation follows the blueprint pattern used in similar addons:

```
npm install ember-cli-dimple --save
ember g ember-cli-dimple
```

This will add the necessary entries in your `bower.json` and make available a new component in your project: `{{dimple-chart}}`

## Usage

This addon must be extended by subclasses. This can be done by creating your own component:

```coffeescript
ember g component custom-chart
```

and in `components/custom-chart`:

```coffeescript
`import DimpleChartComponent from 'ember-cli-dimple/components/dimple-chart/component'`

CustomChartComponent = DimpleChartComponent.extend(...)

`export default CustomChartComponent`
```

The DimpleChartComponent provides two main hooks for customization:

```coffeescript
remap: (data) ->
```

and

```coffeescript
customizeChart: (chart) ->
```

The former will allow you to transform incoming data into the target format for your chart. Here is a remap example that aggregates data by series and returns an array of summed values:

```coffeescript
###*
 * Transform time series data into a sum by series.
 *
 * @method remap
 * @param  {Array} data The time-series data as
 *                      [{ series: "x", value: y }, ..., { series: "x", value: yn }]
 * @return {Array}      The transformed data as [{ series: "x", value: sum(y1..yn) }]
###
remap: (data) ->
  _data = _.groupBy(data, "series")

  _data = _.map _data, (value, key) ->
    series: key
    value: _.reduce value, ((sum, num) -> sum + num["count"]), 0

  _data
```

The latter will allow you to set the axes and other properties on your chart prior to drawing:

```coffeescript
###*
 * Customize chart before drawing
 *
 * @method customizeChart
 * @param {Dimple} chart The chart object
###
customizeChart: (chart) ->
  chart.addMeasureAxis("p", "value");
  pie = chart.addSeries("series", dimple.plot.pie);
  pie.innerRadius = "50%";
  chart.addLegend(0, 0, 90, 300, "left");
```

From there, you can add the custom component into your templates with a data binding:

```coffeescript
{{custom-chart data=myDataSource}}
```

## Notes on styling
The component attempts to redraw on window resize using a modified version of [realityendshere/emberella:resize_handler](https://github.com/realityendshere/emberella/blob/master/packages/emberella/lib/mixins/resize_handler.coffee). The sizing depends on CSS so please ensure your `.dimple-chart` has a well-defined width and height.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
