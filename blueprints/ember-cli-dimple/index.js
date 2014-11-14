module.exports = {
  description: '',

  normalizeEntityName: function() {},

  afterInstall: function() {
    var that = this;

    return this.addBowerPackageToProject('d3').then(function() {
        return that.addBowerPackageToProject('dimple');
    });
  }
};
