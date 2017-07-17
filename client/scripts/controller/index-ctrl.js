'use strict';

var app = angular.module('app');

app.controller('IndexCtrl', function($http, AppConst, Searcher) {
  let self = this;

  (function() {
    $http.get('./res/equipment.json').then(function(response) {
      self.vars.equipments = response.data;
    });
  })();

  this.vars = {
    equipments: {},
    statValues: angular.copy(AppConst.statValues),
    viableMargin: AppConst.viableMargin,
    maxLoopCount: AppConst.maxLoopCount,
    resistanceDeduction: AppConst.resistanceDeduction,
    blackList: AppConst.blackList,
    result: {}
  };

  this.consts = {
    equipmentTypes: AppConst.equipmentTypes,
    statLabels: AppConst.statLabels
  };

  this.permissions = {
    isReady: function() {
      return !_.isEmpty(self.vars.equipments);
    },
    isResult: function() {
      return !_.isEmpty(self.vars.result);
    }
  };

  this.handlers = {
    build: function() {
      self.vars.result = Searcher.search({
        equipments: self.vars.equipments,
        statValues: self.vars.statValues,
        viableMargin: self.vars.viableMargin,
        maxLoopCount: self.vars.maxLoopCount,
        resistanceDeduction: self.vars.resistanceDeduction
      });
      console.log(self.vars.result);
    }
  };
});
