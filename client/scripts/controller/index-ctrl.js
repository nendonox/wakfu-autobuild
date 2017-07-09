'use strict';

var app = angular.module('app');

app.controller('IndexCtrl', function($http) {
  var self = this;
  $http.get('./res/equipment.json').then(function(res) {
    self.data = res.data;
  });
});
