let vars = {};

let setEquipments = function(equipments) {
  vars.equipments = equipments;
};

let setEquipmentTypes = function(equipmentTypes) {
  vars.equipmentTypes = equipmentTypes;
};

let setStatValues = function(statValues) {
  vars.statValues = statValues;
};

let setResistanceDeduction = function(resistanceDeduction) {
  vars.resistanceDeduction = resistanceDeduction;
};

let setSearchTarget = function(searchTarget) {
  vars.searchTarget = searchTarget;
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

let searchBestResistance = function(baseResistance, modifiableResistances) {
  let bestResistance = baseResistance;
  let bestModifiableResistance = [];
  let minimumResistance = checkMinimumResistance(baseResistance);
  let modifiableResistanceGenerator = cartesian(modifiableResistances);
  for (let modifiableResistance of modifiableResistanceGenerator) {
    let copiedResistance = _.cloneDeep(baseResistance);
    _.each(modifiableResistance, function(resistance) {
      copiedResistance.fire += resistance.fire;
      copiedResistance.earth += resistance.earth;
      copiedResistance.air += resistance.air;
      copiedResistance.water += resistance.water;
    });
    let _minimumResistance = checkMinimumResistance(copiedResistance);
    if (_minimumResistance > minimumResistance) {
      minimumResistance = _minimumResistance;
      bestResistance = copiedResistance;
      bestModifiableResistance = modifiableResistance;
    }
  }
  return {
    bestResistance: bestResistance,
    bestModifiableResistance: bestModifiableResistance,
    minimumResistance: minimumResistance
  };
};

let calcResistanceDeduction = function(bestResistance) {
  let minimumResistance = checkMinimumResistance(bestResistance);
  return (bestResistance.fire +
    bestResistance.air +
    bestResistance.water +
    bestResistance.earth -
    minimumResistance * 4) * vars.resistanceDeduction;
};

let evalEquipment = function(equipment) {
  return _.reduce(equipment.stats, function(sum, value, key) {
    let score = parseInt(value) * vars.statValues[key];
    return score ? sum + score : sum;
  }, 0);
};

let evalEquipmentSet = function(equipmentSet) {
  let score = 0;
  let relic = 0;
  let epic = 0;
  let ap = 7, mp = 4, wp = 6, range = 0, block = 0, control = 0;
  let resistance = makeResistance(0, 0, 0, 0);
  let modifiableResistances = [];

  // 両手持ちの場合はサブ武器を外す
  if (equipmentSet[9].type === 'Two-Handed Weapons') {
    equipmentSet.pop();
    equipmentSet.push({
      enabled: true,
      level: '-',
      name: 'Empty',
      score: 0,
      stats: {},
      type: 'Second Hand'
    });
  }

  _.each(equipmentSet, function(equipment) {
    // 基本スコア
    score += equipment.score;

    // レリック or エピックスコア
    if (equipment.rarity === 'Relic') relic += 1;
    else if (equipment.rarity === 'Epic') epic += 1;

    // AP, MP, WP, Range
    ap += equipment.stats['AP'] ? parseInt(equipment.stats['AP']) : 0;
    mp += equipment.stats['MP'] ? parseInt(equipment.stats['MP']) : 0;
    wp += equipment.stats['WP'] ? parseInt(equipment.stats['WP']) : 0;
    range += equipment.stats['Range'] ? parseInt(equipment.stats['Range']) : 0;
    block += equipment.stats['Block'] ? parseInt(equipment.stats['Block']) : 0;
    control  += equipment.stats['Control'] ? parseInt(equipment.stats['Control']) : 0;

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

  if (relic > 1 || epic > 1) { return { score: 0 }; }
  if ((equipmentSet[7].name === equipmentSet[8].name && equipmentSet[7].rarity === equipmentSet[8].rarity) || equipmentSet[7].score < equipmentSet[8].score) { return { score: 0 }; }
  if (ap < vars.searchTarget.minAp || vars.searchTarget.maxAp < ap) { return { score: 0 }; }
  if (mp < vars.searchTarget.minMp || vars.searchTarget.maxMp < mp) { return { score: 0 }; }
  if (wp < vars.searchTarget.minWp || vars.searchTarget.maxWp < wp) { return { score: 0 }; }
  if (range < vars.searchTarget.minRange || vars.searchTarget.maxRange < range) { return { score: 0 }; }
  if (block < vars.searchTarget.minBlock || vars.searchTarget.maxBlock < block) { return { score: 0 }; }
  if (control < vars.searchTarget.minCtrl || vars.searchTarget.maxCtrl < control) { return { score: 0 }; }
  let result = searchBestResistance(resistance, modifiableResistances);
  return {
    score: score - calcResistanceDeduction(result.bestResistance),
    set: equipmentSet,
    bestResistance: result.bestResistance,
    bestModifiableResistance: result.bestModifiableResistance,
    minimumResistance: result.minimumResistance
  };
};

let makeScoredEquipments = function(relicBonus, epicBonus) {
  let equipments = _.cloneDeep(vars.equipments);
  _.each(vars.equipmentTypes, function(type) {
    _.each(equipments[type], function(equipment) {
      equipment.score = evalEquipment(equipment);
      if (equipment.rarity === 'Relic') {
        equipment.score -= parseInt(relicBonus);
      } else if (equipment.rarity === 'Epic') {
        equipment.score -= parseInt(epicBonus);
      }
    });
  });
  return equipments;
};

let makeEquipmentRankings = function(relicBonus, epicBonus) {
  let scoredEquipments = makeScoredEquipments(relicBonus, epicBonus);
  let rankings = {};
  _.each(vars.equipmentTypes, function(type) {
    rankings[type] = _.reverse(_.sortBy(scoredEquipments[type], ['score']));
  });
  return rankings;
};

let makeViableEquipments = function(_viableMargin, relicBonus, epicBonus) {
  let viableMargin = parseInt(_viableMargin);
  let equipmentRankings = makeEquipmentRankings(relicBonus, epicBonus);
  let viableEquipments = {};
  _.each(vars.equipmentTypes, function(type) {
    let legMax = 0;
    let legSecond = 0;
    let equipments = [];
    _.each(equipmentRankings[type], function(equipment) {
      if (!equipment.enabled) {
        return true;
      }
      if (legMax !== 0 && legSecond === 0 && (equipment.rarity === 'Legendary' || equipment.rarity === 'PvP' || equipment.rarity === 'Mythical')) {
        legSecond = equipment.score;
      }
      if (legMax === 0 && (equipment.rarity === 'Legendary' || equipment.rarity === 'PvP' || equipment.rarity === 'Mythical')) {
        legMax = equipment.score;
      }
      if (type === 'Ring') {
        if (legSecond !== 0 && equipment.score < legSecond - viableMargin) {
          return false;
        }
      } else {
        if (legMax !== 0 && equipment.score < legMax - viableMargin) {
          return false;
        }
      }
      equipments.push(equipment);
    });
    if (_.isEmpty(equipments)) {
      equipments.push({
        enabled: true,
        level: '-',
        name: 'Empty',
        score: 0,
        stats: {},
        type: type
      });
    }
    if (type === 'Ring' && equipments.length === 1) {
      equipments.push({
        enabled: true,
        level: '-',
        name: 'Empty Ring',
        score: 0,
        stats: {},
        type: type
      });
    }
    viableEquipments[type] = equipments;
  });
  return viableEquipments;
};

let calcCandidatesNumber = function(viableEquipments) {
  return viableEquipments['Helmet'].length *
    viableEquipments['Cloak'].length *
    viableEquipments['Amulet'].length *
    viableEquipments['Epaulettes'].length *
    viableEquipments['Breastplate'].length *
    viableEquipments['Belt'].length *
    viableEquipments['Boots'].length *
    viableEquipments['Ring'].length *
    viableEquipments['Ring'].length *
    viableEquipments['One-Handed Weapons'].concat(viableEquipments['Two-Handed Weapons']).length *
    viableEquipments['Second Hand'].length;
};

let calcStatsByEquipmentSet = function(equipmentSet) {
  return _.reduce(equipmentSet, (result, value) => {
    _.each(value.stats, (stat, key) => {
      if (_.has(result, key)) {
        result[key] += parseInt(stat);
      } else {
        result[key] = parseInt(stat);
      }
    });
    return result;
  }, {});
};

let search = function(query, worker) {
  setEquipments(query.equipments);
  setEquipmentTypes(query.equipmentTypes);
  setStatValues(query.statValues);
  setResistanceDeduction(query.resistanceDeduction);
  setSearchTarget(query.searchTarget);

  let viableEquipments = makeViableEquipments(query.viableMargin, query.relicBonus, query.epicBonus);
  let candidatesNumber = calcCandidatesNumber(viableEquipments);
  worker.postMessage(['candidatesNumber', candidatesNumber]);

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
  let score = 0;
  let scoreThreshold = 0;
  let count = 0;
  const queueLength = 1;
  for (let equipmentSet of equipmentSetGenerator) {
    count += 1;
    if (count%20000 === 0) {
      worker.postMessage(['searchInfo', {
        count: count,
        t: '-1',
        score: score,
        maxScore: scoreThreshold
      }]);
    }
    let result = evalEquipmentSet(_.clone(equipmentSet));
    score = result.score;
    if (ranking.length < queueLength || result.score > scoreThreshold) {
      ranking.push({
        score: result.score,
        set: result.set,
        stats: calcStatsByEquipmentSet(result.set),
        bestResistance: result.bestResistance,
        bestModifiableResistance: result.bestModifiableResistance,
        minimumResistance: result.minimumResistance
      });
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

let annealingProb = (score, nextScore, t) => {
  if (nextScore >= score) {
    return 1;
  } else {
    return Math.exp((nextScore - score)/t);
  }
};

let annealing = function(query, worker) {
  setEquipments(query.equipments);
  setEquipmentTypes(query.equipmentTypes);
  setStatValues(query.statValues);
  setResistanceDeduction(query.resistanceDeduction);
  setSearchTarget(query.searchTarget);

  const MAX_ITER = parseInt(query.annealingMaxIteration);
  const ALPHA = parseFloat(query.annealingCoolingAlpha);
  let viableEquipments = makeViableEquipments(query.annealingViableMargin, query.relicBonus, query.epicBonus);
  worker.postMessage(['candidatesNumber', MAX_ITER]);

  let viableEquipmentArray = [
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
  ];
  let equipmentSet = _.map(viableEquipments, (equipments) => {
    return equipments[_.random(equipments.length - 1)];
  });
  let ranking = [];
  let scoreThreshold = 0;
  let score = 0;
  let count = 0;
  let t = ALPHA;
  const queueLength = 1;
  for (count ; count<MAX_ITER ; count++) {
    // make neighbor
    let neighbor = _.clone(equipmentSet);
    let evaluatedNeighbor;
    for (count ; count<MAX_ITER ; count++) {
      if (count%20000 === 0) {
        worker.postMessage(['searchInfo', {
          count: count,
          t: t,
          score: score,
          maxScore: scoreThreshold
        }]);
      }

      let nextEquipmentType = _.random(viableEquipmentArray.length - 1);
      let nextEquipments = viableEquipmentArray[nextEquipmentType];
      neighbor[nextEquipmentType] = nextEquipments[_.random(nextEquipments.length - 1)];
      evaluatedNeighbor = evalEquipmentSet(_.clone(neighbor));

      // skip invalid equipment set
      if (evaluatedNeighbor.score !== 0) {
        break;
      }
    }

    // register ranking
    if (ranking.length < queueLength || evaluatedNeighbor.score > scoreThreshold) {
      ranking.push({
        score: evaluatedNeighbor.score,
        set: evaluatedNeighbor.set,
        stats: calcStatsByEquipmentSet(evaluatedNeighbor.set),
        bestResistance: evaluatedNeighbor.bestResistance,
        bestModifiableResistance: evaluatedNeighbor.bestModifiableResistance,
        minimumResistance: evaluatedNeighbor.minimumResistance
      });
      ranking = _.sortBy(ranking, ['score']);
      if (ranking.length > queueLength) {
        ranking.shift();
      }
      scoreThreshold = ranking[0].score;
    }

    // adopt neighbor
    t = 150*Math.pow(ALPHA, 1000*count/MAX_ITER);
    if (_.random(1, true) <= annealingProb(score, evaluatedNeighbor.score, t)) {
      equipmentSet = neighbor;
      score = evaluatedNeighbor.score;
    }
  }
  return {
    viableEquipments: viableEquipments,
    ranking: _.reverse(ranking),
    count: count
  };
};

self.addEventListener('message', (message) => {
  if (message.data.type === 'FULL') {
    let result = search(message.data, self);
    self.postMessage(['result', result]);
  } else if (message.data.type === 'SA') {
    let result = annealing(message.data, self);
    self.postMessage(['result', result]);
  }
});
