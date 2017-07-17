'use strict';

var app = angular.module('app');

app.service('Searcher', function($http, AppConst) {
  let self = this;

  let setEquipments = function(equipments) {
    self.equipments = equipments;
  };

  let setStatValues = function(statValues) {
    self.statValues = statValues;
  };

  let makeResistance = function(fire, earth, air, water) {
    return {fire: fire, earth: earth, air: air, water: water};
  };

  let makeSingleResistance = function(resistance) {
    resistance = parseInt(resistance);
    if (!resistance) { return null; }
    return [
      makeResistance(resistance, 0, 0, 0),
      makeResistance(0, resistance, 0, 0),
      makeResistance(0, 0, resistance, 0),
      makeResistance(0, 0, 0, resistance)
    ];
  };

  let makeDoubleResistance = function(resistance) {
    resistance = parseInt(resistance);
    if (!resistance) { return null; }
    return [
      makeResistance(resistance, resistance, 0, 0),
      makeResistance(resistance, 0, resistance, 0),
      makeResistance(resistance, 0, 0, resistance),
      makeResistance(0, resistance, resistance, 0),
      makeResistance(0, resistance, 0, resistance),
      makeResistance(0, 0, resistance, resistance)
    ];
  };

  let makeTripleResistance = function(resistance) {
    resistance = parseInt(resistance);
    if (!resistance) { return null; }
    return [
      makeResistance(resistance, resistance, resistance, 0),
      makeResistance(resistance, resistance, 0, resistance),
      makeResistance(resistance, 0, resistance, resistance),
      makeResistance(0, resistance, resistance, resistance)
    ];
  };

  let checkMinimumResistance = function(resistance) {
    return _.min([resistance.fire, resistance.air, resistance.earth, resistance.water]);
  };

  let calcResistanceDeduction = function(baseResistance, modifiableResistances) {
    let bestResistance = baseResistance;
    let minimumResistance = checkMinimumResistance(baseResistance);
    let modifiableResistanceGenerator = cartesian(modifiableResistances);
    for (let modifiableResistance of modifiableResistanceGenerator) {
      let copiedResistance = angular.copy(baseResistance);
      _.each(modifiableResistance, function(resistance) {
        copiedResistance.fire += resistance.fire;
        copiedResistance.earth += resistance.earth;
        copiedResistance.air += resistance.air;
        copiedResistance.water += resistance.water;
      });
      let minimumResistance2 = checkMinimumResistance(copiedResistance);
      if (minimumResistance2 > minimumResistance) {
        minimumResistance = minimumResistance2;
        bestResistance = copiedResistance;
      }
    }
    return bestResistance.fire + bestResistance.air + bestResistance.water + bestResistance.earth - minimumResistance * 4;
  };

  let evalEquipment = function(equipment) {
    return _.reduce(equipment.stats, function(sum, value, key) {
      let score = parseInt(value) * self.statValues[key];
      return score ? sum + score : sum;
    }, 0);
  };

  let evalEquipmentSet = function(equipmentSet) {
    let score = 0;
    let relic = 0;
    let epic = 0;
    let resistance = makeResistance(0, 0, 0, 0);
    let modifiableResistances = [];

    // 両手持ちの場合はサブ武器を外す
    if (equipmentSet[9].type === 'Two-Handed Weapons') {
      equipmentSet.pop();
    }

    _.each(equipmentSet, function(equipment) {
      // 基本スコア
      score += equipment.score;

      // レリック or エピックスコア
      if (equipment.rarity === 'Relic') relic += 1;
      else if (equipment.rarity === '') epic += 1;

      // 耐性（固定）
      let resistanceFire = parseInt(equipment.stats['Resistance Fire']) || 0;
      let resistanceEarth = parseInt(equipment.stats['Resistance Earth']) || 0;
      let resistanceAir = parseInt(equipment.stats['Resistance Air']) || 0;
      let resistanceWater = parseInt(equipment.stats['Resistance Water']) || 0;
      let elementalResistance = parseInt(equipment.stats['Elemental Resistance']) || 0;
      resistance.fire += resistanceFire + elementalResistance;
      resistance.earth += resistanceEarth + elementalResistance;
      resistance.air += resistanceAir + elementalResistance;
      resistance.water += resistanceWater + elementalResistance;

      // 耐性（可変）
      let singleResistance = makeSingleResistance(equipment.stats['Resistance to 1 random elements']);
      let doubleResistance = makeDoubleResistance(equipment.stats['Resistance to 2 random elements']);
      let tripleResistance = makeTripleResistance(equipment.stats['Resistance to 3 random elements']);
      if (singleResistance) { modifiableResistances.push(singleResistance); }
      if (doubleResistance) { modifiableResistances.push(doubleResistance); }
      if (tripleResistance) { modifiableResistances.push(tripleResistance); }
    });

    if (relic > 1 || epic > 1) { return 0; }
    if (equipmentSet[7].name === equipmentSet[8].name || equipmentSet[7].score < equipmentSet[8].score) { return 0; }
    return score - calcResistanceDeduction(resistance, modifiableResistances);
  };

  let makeScoredEquipments = function() {
    let equipments = angular.copy(self.equipments);
    _.each(AppConst.equipmentTypes, function(type) {
      _.each(equipments[type], function(equipment) {
        equipment.score = evalEquipment(equipment);
      });
    });
    return equipments;
  };

  let makeEquipmentRankings = function() {
    let scoredEquipments = makeScoredEquipments();
    let rankings = {};
    _.each(AppConst.equipmentTypes, function(type) {
      rankings[type] = _.reverse(_.sortBy(scoredEquipments[type], ['score']));
    });
    return rankings;
  };

  let makeViableEquipments = function(_viableMargin, blackList) {
    let viableMargin = parseInt(_viableMargin);
    let equipmentRankings = makeEquipmentRankings();
    let viableEquipments = {};
    _.each(AppConst.equipmentTypes, function(type) {
      let legMax = 0;
      let equipments = [];
      _.each(equipmentRankings[type], function(equipment) {
        if (_.includes(blackList, equipment.name)) {
          return true;
        }
        if (legMax === 0 && equipment.rarity === 'Legendary') {
          legMax = equipment.score;
        }
        if (legMax !== 0 && equipment.score < legMax - viableMargin) {
          return false;
        }
        equipments.push(equipment);
      });
      viableEquipments[type] = equipments;
    });
    return viableEquipments;
  };

  let search = function(query) {
    setEquipments(query.equipments);
    setStatValues(query.statValues);

    let viableEquipments = makeViableEquipments(query.viableMargin, query.blackList);
    let equipmentSetGenerator = cartesian(
      viableEquipments['Helmet'],
      viableEquipments['Cloak'],
      viableEquipments['Amulet'],
      viableEquipments['Epaulettes'],
      viableEquipments['Breastplate'],
      viableEquipments['Belt'],
      viableEquipments['Boots'],
      viableEquipments['Ring'],
      viableEquipments['Ring'],
      viableEquipments['One-Handed Weapons'].concat(viableEquipments['Two-Handed Weapons']),
      viableEquipments['Second Hand']
    );
    let ranking = [];
    let scoreThreshold = 0;
    let count = 0;
    const queueLength = 3;
    for (let equipmentSet of equipmentSetGenerator) {
      count += 1;
      let score = evalEquipmentSet(equipmentSet);
      if (ranking.length < queueLength || score > scoreThreshold) {
        ranking.push({score: score, set: equipmentSet});
        ranking = _.sortBy(ranking, ['score']);
        if (ranking.length > queueLength) {
          ranking.shift();
        }
        scoreThreshold = ranking[0].score;
      }
    }
    return {
      viableEquipments: viableEquipments,
      ranking: _.reverse(ranking),
      count: count
    };
  };

  return {
    search: search
  };
});
