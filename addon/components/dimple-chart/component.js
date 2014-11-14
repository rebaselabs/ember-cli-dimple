/**
 * DimpleChartComponent.
 *
 * Allows for setting of the `data` property and provides some hooks
 * for custom chart drawing.
 * @class DimpleChartComponent
 */

import Ember from 'ember';
import ResizeMixin from 'ember-cli-dimple/mixins/resize';

var DimpleChartComponent = Ember.Component.extend(ResizeMixin, Ember.Evented, {

  classNames: ["dimple-chart"],

  /**
   * Local copy of DimpleJS.
   * Use @get("dimple") for all your charting needs.
   *
   * @property {Object} dimple Local Dimple
   */
  dimple: dimple,

  /**
   * Local d3.
   * At the time of writing d3 is a global but that may not always be the case
   *
   * @property {Object} d3 local d3
   */
  d3: d3,

  /**mple
   * The DimpleJS SVG element as an arary.
   * This is returned when calling `this.dimple.newSvg`
   *
   * @type {Array}
   */
  svg: null,

  /**
   * Cached data.
   *
   * @private
   * @property {Array} _data The internally stored data when the `data` computed property
   *                         is used as a setter.
   * @type {Array}
   */
  _data: null,

  /**
   * Data property. When used as a setter, the passed-in data will first be remapped
   * according to the `@remap` function.
   *
   * @param  {String} key   The key for the property. This is used by Ember.
   * @param  {Mixed}  value Optional param when using data as a setter.
   * @return {Mixed}        The remapped data.
   */
  data: (function(key, value) {
    if (value) {
      this.set("_data", this.remap(value));
    }
    return this.get("_data");
  }).property("_data"),

  /**
   * Remap passed-in data.
   * Typically this is used to map data fields to Dimple, but it can be more extensive.
   *
   * @param  {Mixed}  data The incoming data
   * @return {Mixed}       The remapped data as will be passed to Dimple
   */
  remap: function(data) {
    return data;
  },

  /**
   * Private didInsert handler
   * Draw the SVG and initialize chart drawing.
   *
   * @private
   */
  _didInsertElement: (function() {
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.dimple.newSvg("#" + (this.$().attr("id")));
      return this.trigger("didInsertSVG");
    });
  }).on("didInsertElement"),

  /**
   * The basic chart model.
   * This relies on an SVG being set and data.
   * @return {Object} The dimple chart object.
   */
  chartModel: (function() {
    var data, svg;
    if ((svg = this.get("svg")) && (data = this.get("data"))) {
      return new this.dimple.chart(svg, data);
    }
  }).property("svg", "data"),

  /**
   * The chart object with all settings applied.
   * This is effected by taking `@chartModel` through the `customizeChart` function.
   * @property {Dimple} chart The complete chart object, ready to `draw()`
   */
  chart: (function() {
    var chart;
    chart = this.get('chartModel');
    if (chart) {
      this._customizeChart(chart);
      this.get('customizeChart').call(this, chart);
    }
    return chart;
  }).property("chartModel"),

  /**
   * Private customizeChart method.
   *
   * @method _customizeChart
   * @param  {chartModel} chart The base chart model
   * @return {chart}            A basic chart that can be further customized by subclasses.
   */
  _customizeChart: function(chart) {
    return chart.setBounds("10%", "10%", "80%", "80%");
  },

  /**
   * The customizeChart function.
   * Once the data is loaded and the SVG is initialized,
   * the chart can be customized prior to drawing.
   * Typically this involves setting axes.
   *
   * @method customizeChart
   * @param {Dimple} chart The chart to be customized
   */
  customizeChart: Ember.K,

  /**
   * Update the chart. This happens any time the chart changes.
   *
   * @protected
   * @method updateChart
   */
  updateChart: (function() {
    var chart;
    if (!(chart = this.get("chart"))) {
      return;
    }
    Ember.run.scheduleOnce('afterRender', this, function() {
      this._resizeSvg(chart);
      chart.draw();
    });
  }).observes('chart').on("didInsertSVG"),

  /**
   * Redraw the chart when resized.
   *
   * @private
   * @see mixins/resize
   */
  onResizeEnd: (function() {
    return this.updateChart();
  }),

  /**
   * Resize the SVG (i.e. when the window is resized.)
   *
   * @private
   * @param  {Dimple} chart The chart object
   * @method _resizeSvg
   */
  _resizeSvg: function(chart) {
    var $self, svg;
    if (chart === null) {
      return;
    }
    if (!(svg = this.$(chart.svg[0]))) {
      return;
    }
    $self = this.$();
    svg.height($self.height());
    return svg.width($self.width());
  }

});

export default DimpleChartComponent;
