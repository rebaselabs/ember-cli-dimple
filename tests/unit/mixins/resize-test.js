import Ember from 'ember';
import ResizeMixin from 'ember-cli-dimple/mixins/resize';

module('ResizeMixin');

// Replace this with your real tests.
test('it works', function() {
  var ResizeObject = Ember.Object.extend(ResizeMixin);
  var subject = ResizeObject.create();
  ok(subject);
});
