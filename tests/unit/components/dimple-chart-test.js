import {
  moduleForComponent,
  test
} from 'ember-qunit';

moduleForComponent('dimple-chart', 'DimpleChartComponent', {
  // specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
});

test('it renders', function() {
  expect(2);

  // creates the component instance
  var component = this.subject();
  equal(component._state, 'preRender');

  // appends the component to the page
  this.append();
  equal(component._state, 'inDOM');
});

test('it can perform a basic charting subroutine', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    customizeChart: function(chart){
      chart.addCategoryAxis("x", "Word");
      chart.addMeasureAxis("y", "Awesomeness");
      chart.addSeries(null, dimple.plot.bar);
    }
  });

  component.set("data", [
    { "Word":"Hello", "Awesomeness":2000 },
    { "Word":"World", "Awesomeness":3000 }
  ]);

  // appends the component to the page
  var dom = this.append();

  ok(dom.find("svg rect.dimple-hello"));
  ok(dom.find("svg rect.dimple-world"));

});
