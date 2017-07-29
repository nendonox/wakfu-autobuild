'use strict';

app.service('EquipmentSelect', function(AppConst) {
  let self = this;

  let makeSelectableEquipments = (equipments) => {
    let copiedEquipments = _.clone(equipments);
    _.each(copiedEquipments, (equipmentList, key) => {
      _.each(equipmentList, (equipment) => {
        equipment.enabled = true;
      });
    });
    return copiedEquipments;
  };

  let makeCondition = () => {
    let baseCondition = {
      name: '',
      minLevel: 0,
      maxLevel: 200,
      types: {},
      rarities: {},
      equipmentSetNames: {}
    };
    _.each(AppConst.equipmentTypes, (type) => {
      baseCondition.types[type] = false;
    });
    _.each(AppConst.rarities, (rarity) => {
      baseCondition.rarities[rarity] = false;
    });
    _.each(AppConst.equipmentSetNames, (setName) => {
      baseCondition.equipmentSetNames[setName] = false;
    });
    return baseCondition;
  };

  let enableSelectedFlags = (equipments) => {
    _.each(equipments, (equipment) => {
      equipment.enabled = true;
    });
  };

  let disableSelectedFlags = (equipments) => {
    _.each(equipments, (equipment) => {
      equipment.enabled = false;
    });
  };

  let getFilteredEquipments = (equipments, condition) => {
    let equipmentList =  _.reduce(equipments, (result, value, key) => {
      return _.concat(result, value);
    }, []);
    let validTypes = _.filter(AppConst.equipmentTypes, (type) => {
      return condition.types[type];
    });
    let validRarities = _.filter(AppConst.rarities, (rarity) => {
      return condition.rarities[rarity];
    });
    let equipmentFilterSets = _.reduce(condition.equipmentSetNames, (result, value, key) => {
      return value ? _.concat(result, AppConst.equipmentSets[key]) : result;
    }, []);
    return _.filter(equipmentList, (equipment) => {
      return equipment.name.toLowerCase().indexOf(condition.name) >= 0 &&
        condition.minLevel <= equipment.level && equipment.level <= condition.maxLevel &&
        (_.isEmpty(validTypes) || _.includes(validTypes, equipment.type)) &&
        (_.isEmpty(validRarities) || _.includes(validRarities, equipment.rarity)) &&
        (_.isEmpty(equipmentFilterSets) || _.includes(equipmentFilterSets, equipment.name));
    });
  };

  return {
    disableSelectedFlags: disableSelectedFlags,
    enableSelectedFlags: enableSelectedFlags,
    getFilteredEquipments: getFilteredEquipments,
    makeSelectableEquipments: makeSelectableEquipments,
    makeCondition: makeCondition
  };
});
