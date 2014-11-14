module.exports = {

  name: 'ember-cli-dimple',

  included: function(app) {
    this._super.included(app);

  	app.import({
  	  development: app.bowerDirectory + '/d3/d3.js',
  	  production:  app.bowerDirectory + '/d3/d3.min.js'
  	});

  	app.import({
  	  development: app.bowerDirectory + '/dimple/dist/dimple.v2.1.0.js',
  	  production:  app.bowerDirectory + '/dimple/dist/dimple.v2.1.0.min.js'
  	});

    app.import('vendor/styles/ember-cli-dimple.css');
  }

};
