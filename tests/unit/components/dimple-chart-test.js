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
    drawDuration: 0,
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

  ok(dom.find("svg rect.dimple-hello").length > 0);
  ok(dom.find("svg rect.dimple-world").length > 0);

});

test('it can redraw when changing data', function() {
  expect(4);

  // creates the component instance
  var component = this.subject({
    drawDuration: 0,
    customizeChart: function(chart){
      chart.addCategoryAxis("x", "Word");
      chart.addMeasureAxis("y", "Awesomeness");
      chart.addSeries(null, dimple.plot.bar);
    }
  });

  Ember.run(function(){
    component.set("data", [
      { "Word":"Hello", "Awesomeness":1000 },
      { "Word":"World", "Awesomeness":1000 }
    ]);
  });

  // appends the component to the page
  var dom = this.append();

  ok(dom.find("svg rect.dimple-hello").length === 1, "There should be one bar");
  var height = dom.find("svg rect.dimple-hello").attr("height");
  ok(height > 0, "It should have a height");

  return new Ember.RSVP.Promise(function(resolve, reject) {

    Ember.run.next(function(){
      component.set("data", [
        { "Word":"Hello", "Awesomeness":500 },
        { "Word":"World", "Awesomeness":1000 }
      ]);

      Ember.run.next(function(){

        ok(dom.find("svg rect.dimple-hello").length === 1, "There should still be one bar");
        var height_2 = dom.find("svg rect.dimple-hello").attr("height");
        ok(parseInt(height, 10) > parseInt(height_2, 10), "It should have a shorter height");
        resolve();
      });
    });

  });

});
