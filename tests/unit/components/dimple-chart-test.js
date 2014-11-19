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

test('it won\'t draw when there is no data', function(){
  expect(1);

  // creates the component instance
  var component = this.subject({
    drawDuration: 0,
    customizeChart: function(chart){
      chart.addCategoryAxis("x", "Word");
      chart.addMeasureAxis("y", "Awesomeness");
      chart.addSeries(null, dimple.plot.bar);
    }
  });

  // appends the component to the page
  var dom = this.append();

  ok(dom.find("svg").children().length === 1, "There should be one lone g tag");

});

test('it uses remapped data for charting', function() {
  expect(2);

  // creates the component instance
  var component = this.subject({
    drawDuration: 0,
    remap: function(){
      return [
        { "Word":"Hello", "Awesomeness":1000 },
        { "Word":"World", "Awesomeness":1000 }
      ];
    },
    customizeChart: function(chart){
      chart.addCategoryAxis("x", "Word");
      chart.addMeasureAxis("y", "Awesomeness");
      chart.addSeries(null, dimple.plot.bar);
    }
  });

  Ember.run(function(){
    component.set("data", []);
  });

  // appends the component to the page
  var dom = this.append();

  ok(dom.find("svg rect.dimple-hello").length === 1, "There should be at least one bar");

  return new Ember.RSVP.Promise(function(resolve, reject) {

    Ember.run.next(function(){
      component.set("data", "");

      Ember.run.next(function(){

        ok(dom.find("svg rect.dimple-hello").length === 1, "There should still be at least one bar");
        resolve();
      });
    });

  });

});

test("It does not mutate data", function(){

  // creates the component instance
  var component = this.subject({
    drawDuration: 0,
    remap: function(data) {
      return [];
    }
  });

  Ember.run(function(){
    component.set("data", [
      { "Word":"Hello", "Awesomeness":1000 },
      { "Word":"World", "Awesomeness":1000 }
    ]);
  });

  ok (component.get("data").length > 0);

});

test ("remap is called whenever data changes", function(){

  var counter = 0;
    // creates the component instance
  var component = this.subject({
    drawDuration: 0,
    remap: function(data) {
      counter++;
    }
  });

  var _testRuns = 3;
  Ember.run(function(){
    for (var i = _testRuns; i >= 0; i--) {
      component.set("data", i);
      // Get the data so it'll be sure to update.
      component.get("_data");
    }
    Ember.run.next(function(){
      ok(counter >= _testRuns, "Remap should be called at least as many times as the setter, give or take");
    });
  });

});
