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
    statValues: angular.copy(AppConst.statValues),
    viableMargin: AppConst.viableMargin,
    maxLoopCount: AppConst.maxLoopCount,
    resistanceDeduction: AppConst.resistanceDeduction,
    blackList: AppConst.blackList,
    equipments: {},
    result: {},
    getCandidatesNumber: () => { return Searcher.getCandidatesNumber(); },
    getSearchedNumber: () => { return Searcher.getSearchedNumber(); },
    getResult: () => { return Searcher.getResult(); }
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
      return !_.isEmpty(self.vars.getResult());
    }
  };

  this.handlers = {
    build: function() {
      Searcher.search({
        equipments: self.vars.equipments,
        equipmentTypes: AppConst.equipmentTypes,
        statValues: self.vars.statValues,
        viableMargin: self.vars.viableMargin,
        maxLoopCount: self.vars.maxLoopCount,
        blackList: self.vars.blackList,
        resistanceDeduction: self.vars.resistanceDeduction
      });
    }
  };
});
