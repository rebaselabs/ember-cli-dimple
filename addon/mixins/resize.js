/**
 * Resize Mixin
 *
 * @see https://github.com/realityendshere/emberella/blob/master/packages/emberella/lib/mixins/resize_handler.coffee
 * @see https://github.com/realityendshere/emberella/blob/master/LICENSE
 * @class ResizeMixin
 */

import Ember from 'ember';

var ResizeMixin = Ember.Mixin.create({

  /**
   * resizeDelay: Time in ms to debounce before triggering resizeEnd
   * @type {Number}
   */
  resizeDelay: 250,

  /**
   * flags whether the window is currently resizing
   *
   * @private
   * @type {Boolean}
   */
  resizing: false,

  /**
   * Triggered when resizing starts. Override in subclasses
   *
   * @method onResizeStart
   */
  onResizeStart: Ember.K,

  /**
   * Triggered when resizing ends. Override in subclasses
   *
   * @method onResizeEnd
   */
  onResizeEnd: Ember.K,

  /**
   * Triggered (repeatedly) during resizing. Override in subclasses
   *
   * @method onResizeStart
   */
  onResize: Ember.K,

  /**
   * Implement a faux resizeEnd event.
   *
   * @private
   * @method debounceResizeEnd
   */
  debounceResizeEnd: function() {
    if (this.isDestroyed) {
      return;
    }
    this.set('resizing', false);
    return this.onResizeEnd();
  },

  /**
   * Get the window resize handler as a proxy.
   *
   * @method resizeHandler
   * @private
   */
  resizeHandler: Ember.computed(function() {
    return $.proxy(this.handleWindowResize, this);
  }).property(),

  /**
   * The resize handler. Trigger one of `onResizeStart`, `onResize`, `onResizeEnd`
   * The former will be triggered when resizing starts.
   * The middle will be throttled to `resizeDelay` and the latter will be debounced
   * with a delay of `resizeDelay`.
   * @param  {event} event The resize event
   */
  handleWindowResize: function(event) {
    if (!this.get('resizing')) {
      this.set('resizing', true);
      if (typeof this.onResizeStart === "function") {
        this.onResizeStart(event);
      }
    }
    if (this.onResize !== null) {
      Ember.run.throttle(this, this.onResize, event, this.get("resizeDelay"));
    }
    if (this.onResizeEnd !== null) {
      return Ember.run.debounce(this, this.debounceResizeEnd, event, this.get("resizeDelay"));
    }
  },
  didInsertElement: function() {
    this._super();
    return $(window).on('resize.' + Ember.guidFor(this), this.get("resizeHandler"));
  },
  willDestroy: function() {
    $(window).off('resize.' + Ember.guidFor(this), this.get("resizeHandler"));
    return this._super();
  }
});

export default ResizeMixin;

