'use strict';

var app = angular.module('app');

app.constant('AppConst', {
  equipmentTypes: [
    'Helmet',
    'Cloak',
    'Amulet',
    'Epaulettes',
    'Breastplate',
    'Belt',
    'Ring',
    'Boots',
    'One-Handed Weapons',
    'Two-Handed Weapons',
    'Second Hand'
  ],
  statsScores: {
    'Health Points': 0.3,
    'AP': 280,
    'MP': 180,
    'WP': 0,
    'Range': 120,
    'Control': 0,
    'Block': 4,
    'Critical Hit': 13,
    'Critical Mastery': 0.8,
    'Rear Mastery': 0,
    'Healing Mastery': 0,
    'Area Mastery': 0.8,
    'Single Target Mastery': 0,
    'Melee Mastery': 0,
    'Distance Mastery': 1,
    'Berserk Mastery': 0,
    'Mastery to 3 random elements': 1,
    'Mastery to 2 random elements': 0.8,
    'Elemental Resistance': 4,
    'Resistance to 3 random elements': 3,
    'Resistance to 2 random elements': 2,
    'Resistance to 1 random elements': 1,
    'Resistance Fire': 1,
    'Resistance Water': 1,
    'Resistance Air': 1,
    'Resistance Earth': 1,
    'Critical Resistance': 0,
    'Rear Resistance': 0,
    'Dodge': 0,
    'Lock': 0,
    'Initiative': 0,
    'Wisdom': 0,
    'Prospecting': 10
  }
});
