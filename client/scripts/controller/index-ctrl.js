'use strict';

var app = angular.module('app');

app.controller('IndexCtrl', function($http, AppConst, Searcher) {
  let self = this;

  (function() {
    Searcher.loadEquipments();
  })();

  this.vars = {
    scores: angular.copy(AppConst.statsScores),
    result: {}
  };

  this.consts = {
    equipmentTypes: AppConst.equipmentTypes
  };

  this.permissions = {
    isReady: function() {
      return !_.isEmpty(self.vars);
    }
  };

  this.handlers = {
    build: function() {
      Searcher.setStatValues(self.vars.scores);
      self.vars.result = Searcher.search();
      console.log(self.vars.result);
    }
  };
});
