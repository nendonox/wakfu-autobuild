'use strict';

app.controller('IndexCtrl', function($http, AppConst, EquipmentSelect, Searcher) {
  let self = this;

  (function() {
    $http.get('./res/equipment.json').then(function(response) {
      self.vars.equipments = EquipmentSelect.makeSelectableEquipments(response.data);
    });
  })();

  this.vars = {
    statValues: angular.copy(AppConst.presets[0].statValues),
    viableMargin: AppConst.viableMargin,
    resistanceDeduction: AppConst.resistanceDeduction,
    annealingViableMargin: AppConst.annealingViableMargin,
    annealingMaxIteration: AppConst.annealingMaxIteration,
    annealingCoolingAlpha: AppConst.annealingCoolingAlpha,
    relicBonus: AppConst.relicBonus,
    epicBonus: AppConst.epicBonus,
    equipments: {},
    selectCondition: EquipmentSelect.makeCondition(),
    searchTarget: angular.copy(AppConst.presets[0].searchTarget),
    result: {},
    filteredEquipmentsLengthCache: 0,
    preset: AppConst.presets[0],
    resultStatShowFlags: new Array(11).fill(false),
    getCandidatesNumber: () => { return Searcher.getCandidatesNumber(); },
    getSearchInfo: () => { return Searcher.getSearchInfo(); },
    getResult: () => { return Searcher.getResult(); },
    getFilteredEquipments: () => {
      const filteredEquipments = EquipmentSelect.getFilteredEquipments(self.vars.equipments, self.vars.selectCondition);
      self.vars.filteredEquipmentsLengthCache = filteredEquipments.length;
      return filteredEquipments.slice(0, 50);
    }
  };

  this.consts = {
    equipmentTypes: AppConst.equipmentTypes,
    equipmentSetNames: AppConst.equipmentSetNames,
    rarities: AppConst.rarities,
    statLabels: AppConst.statLabels,
    presets: AppConst.presets
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
    build: function(type) {
      Searcher.search({
        equipments: self.vars.equipments,
        equipmentTypes: AppConst.equipmentTypes,
        statValues: self.vars.statValues,
        viableMargin: self.vars.viableMargin,
        resistanceDeduction: self.vars.resistanceDeduction,
        searchTarget: self.vars.searchTarget,
        annealingViableMargin: self.vars.annealingViableMargin,
        annealingMaxIteration: self.vars.annealingMaxIteration,
        annealingCoolingAlpha: self.vars.annealingCoolingAlpha,
        relicBonus: self.vars.relicBonus,
        epicBonus: self.vars.epicBonus,
        type: type
      });
    },
    cancel: () => {
      Searcher.cancel();
    },
    showEquipmentDetail: function() {

    },
    enableSelectedFlags: () => {
      EquipmentSelect.enableSelectedFlags(
        EquipmentSelect.getFilteredEquipments(self.vars.equipments, self.vars.selectCondition)
      );
    },
    disableSelectedFlags: () => {
      EquipmentSelect.disableSelectedFlags(
        EquipmentSelect.getFilteredEquipments(self.vars.equipments, self.vars.selectCondition)
      );
    },
    getRarityClass: (rarity) => {
      return {
        'rarity-relic': rarity === 'Relic',
        'rarity-epic': rarity === 'Epic',
        'rarity-pvp': rarity === 'PvP',
        'rarity-legendary': rarity === 'Legendary',
        'rarity-mythical': rarity === 'Mythical'
      };
    },
    changePreset: () => {
      self.vars.searchTarget = angular.copy(self.vars.preset.searchTarget);
      self.vars.statValues = angular.copy(self.vars.preset.statValues);
    },
    toggleResultShowFlag: (index) => {
      self.vars.resultStatShowFlags[index] = !self.vars.resultStatShowFlags[index];
    }
  };
});
