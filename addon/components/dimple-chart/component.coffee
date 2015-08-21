###*
 * DimpleChartComponent.
 *
 * Allows for setting of the `data` property and provides some hooks
 * for custom chart drawing.
 * @class DimpleChartComponent
###

`import Ember from 'ember'`
`import ResizeMixin from 'ember-cli-dimple/mixins/resize'`

DimpleChartComponent = Ember.Component.extend ResizeMixin, Ember.Evented,
  classNames: ["dimple-chart"]

  ###*
   * The time for charts to draw.
   *
   * @property {Number} drawDuration The time for charts to draw, in ms
   * @type {Number}
  ###
  drawDuration: 1000

  _chart: null

  ###*
   * The chart object with all settings applied and data attached.
   *
   * @property {Dimple} chart The complete chart object, ready to `draw()`
  ###
  chart: ( ->
    return unless (svg = @get("svg")) and (data = @get("_data"))
    unless chartModel = @get("_chart")
      chartModel = new @dimple.chart(svg, data)
      @_customizeChart chartModel
      @get("customizeChart").call @, chartModel
      @set("_chart", chartModel)
    chartModel.data = data
    chartModel
  ).property("_data", "svg")

  ###*
   * The SVG element
   *
   * @property {SVG} svg The SVG element for the chart.
   * @type {SVG}
  ###
  svg: (->
    @dimple.newSvg "#" + @$().attr("id")
  ).property()

  ###*
   * Data property. This will be passed in to the component from the outside world.
   *
   * @property {Mixed} data The data to be charted
  ###
  data: null

  ###*
   * Remap passed-in data.
   * Typically this is used to map data fields to Dimple, but it can be more extensive.
   *
   * @param  {Mixed}  data The incoming data
   * @return {Mixed}       The remapped data as will be passed to Dimple
  ###
  remap: (data) ->
    data

  ###*
   * The customizeChart function.
   * Once the data is loaded and the SVG is initialized,
   * the chart can be customized prior to drawing.
   * Typically this involves setting axes.
   *
   * @method customizeChart
   * @param {Dimple} chart The chart to be customized
  ###
  customizeChart: Ember.K

  ###*
   * Local copy of DimpleJS.
   * Use @get("dimple") for all your charting needs.
   *
   * @property {Object} dimple Local Dimple
  ###
  dimple: dimple

  ###*
   * Local d3.
   * At the time of writing d3 is a global but that may not always be the case
   *
   * @property {Object} d3 local d3
  ###
  d3: d3

  ###*
   * Internal data. This is what the chart will use to draw.
   *
   * @private
   * @property {Array} _data The internally stored data when the `data` computed property
   * is used as a setter.
   * @type {Array}
  ###
  _data: ( ->
    @remap data if data = @get("data")
  ).property("data")

  ###*
   * Private customizeChart method.
   *
   * @method _customizeChart
   * @param  {chartModel} chart The base chart model
   * @return {chart}            A basic chart that can be further customized by subclasses.
  ###
  _customizeChart: (chart) ->
    chart.setBounds "10%", "10%", "80%", "80%"

  ###*
   * Update the chart. This happens any time the chart changes.
   *
   * @protected
   * @method updateChart
   * @param {Boolean} noDataUpdate True if the data should not be refreshed.
  ###
  updateChart: ((noDataUpdate) ->
    return unless chart = @get("chart")
    Ember.run.scheduleOnce "afterRender", @, ->
      @doDraw chart, noDataUpdate
  ).observes("chart").on("didInsertElement")

  ###*
   * The actual draw function
   *
   * @method doDraw
   * @param  {Dimple} chart The chart to draw.
  ###
  doDraw: (chart, noDataUpdate) ->
    return unless (svg = chart?.svg?[0]) and (!Ember.isEmpty(chart.data))
    @sendAction "willDraw", @
    chart.draw @get("drawDuration", noDataUpdate)
    @sendAction "didDraw", @

  ###*
   * Update the chart when resized.
   *
   * @private
   * @see mixins/resize
  ###
  onResizeEnd: (->
    @updateChart(true)
  )

`export default DimpleChartComponent`
