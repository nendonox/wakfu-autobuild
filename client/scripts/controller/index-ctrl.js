'use strict';

var app = angular.module('app');

app.controller('IndexCtrl', function($http, AppConst) {
  var self = this;

  (function() {
    $http.get('./res/equipment.json').then(function(res) {
      self.vars.equipments = res.data;
    });
  })();

  this.privates = {
    calcScore: function(equipment) {
      return _.reduce(equipment.stats, function(sum, value, key) {
        var score = parseInt(value) * self.vars.scores[key];
        return score ? sum + score : sum;
      }, 0);
    }
  };

  this.vars = {
    equipments: {},
    rankings: {},
    scores: angular.copy(AppConst.statsScores)
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
      self.vars.rankings = {};
      _.each(self.consts.equipmentTypes, function(type) {
        _.each(self.vars.equipments[type], function(equipment) {
          equipment.score = self.privates.calcScore(equipment);
        });
        self.vars.rankings[type] = _.reverse(_.sortBy(self.vars.equipments[type], ['score']));
      });
      console.log(self.vars.rankings);
    }
  };
});
