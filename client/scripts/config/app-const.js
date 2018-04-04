'use strict';

app.constant('AppConst', {
  viableMargin: 15,
  resistanceDeduction: 1,
  annealingViableMargin: 60,
  annealingMaxIteration: 2500000,
  annealingCoolingAlpha: 0.995,
  relicBonus: 280,
  epicBonus: 220,
  equipmentSets: {
    'Nogord': [
      'Dragon Helm',
      'Iridescent Necklace',
      'Dragon Amulet',
      'Dragon Epaulettes',
      'Coat of Chain Scales',
      'Prismatic Ring',
      'Dragon Seal',
      'Dragon Shin Guards',
      'Dragon Slicer',
      'Prismatic Bow',
      'Mage Cape',
      'Prismatic Buckle',
      'Dragon Armor',
      'Dragon Coat',
      'Prismatic Belt'
    ],
    'BattleFields': [
      'Beltic',
      'Lumenettes',
      'Contractabelt',
      'Taks',
      'Grenatines',
      'Rubicunds',
      'Erreotype',
      'Hektorch',
      'Broh',
      'Rox',
      'Larzines',
      'Krage',
      'Splurge',
      'Ka-Bling',
      'Shting',
      'Ding',
      'Trisaph',
      'Diemeter',
      'Cloagrippen',
      'Castlemet',
      'Hoshin',
      'Piratine',
      'Krds',
      'Handetary',
      'Boclida',
      'Beechnuuut',
      'Nelva',
      'Fuop',
      'Fuzzuffily',
      'Gooolden',
      'Feldspar',
      'Octarines',
      'Dianine'
    ]
  },
  equipmentSetNames: [
    'Nogord',
    'BattleFields'
  ],
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
  rarities: [
    'Relic',
    'Epic',
    'PvP',
    'Legendary',
    'Mythical'
  ],
  statLabels: [
    'Health Points',
    'AP',
    'MP',
    'WP',
    'Range',
    'Control',
    'Block',
    'Critical Hit',
    'Critical Mastery',
    'Rear Mastery',
    'Healing Mastery',
    'Area Mastery',
    'Single Target Mastery',
    'Melee Mastery',
    'Distance Mastery',
    'Berserk Mastery',
    'Mastery in 3 random elements',
    'Mastery in 2 random elements',
    'Mastery in 1 random elements',
    'Mastery Fire',
    'Mastery Earth',
    'Mastery Air',
    'Mastery Water',
    '90% Vivacity',
    'Elemental Resistance',
    'Resistance to 3 random elements',
    'Resistance to 2 random elements',
    'Resistance to 1 random elements',
    'Resistance Fire',
    'Resistance Earth',
    'Resistance Air',
    'Resistance Water',
    'Critical Resistance',
    'Rear Resistance',
    'Dodge',
    'Lock',
    'Initiative',
    'Wisdom',
    'Prospecting'
  ],
  presets: [
    {
      name: 'Xelor 13AP 5MP 3Range 20Block',
      statValues: JSON.parse('{"Health Points":0.3,"AP":280,"MP":180,"WP":"20","Range":120,"Control":0,' +
        '"Block":4,"Critical Hit":13,"Critical Mastery":0.8,"Rear Mastery":0,"Healing Mastery":0,' +
        '"Area Mastery":"0.4","Single Target Mastery":"0.4","Melee Mastery":0,"Distance Mastery":1,' +
        '"Berserk Mastery":0,"Mastery in 3 random elements":1,"Mastery in 2 random elements":0.8,' +
        '"Mastery in 1 random elements":0,"Mastery Fire":0.25,"Mastery Earth":0.25,"Mastery Air":0.25,' +
        '"Mastery Water":0.25,"90% Vivacity":0,"Elemental Resistance":4,"Resistance to 3 random elements":3,' +
        '"Resistance to 2 random elements":2,"Resistance to 1 random elements":1,"Resistance Fire":1,' +
        '"Resistance Water":1,"Resistance Air":1,"Resistance Earth":1,"Critical Resistance":"0.25",' +
        '"Rear Resistance":"0.25","Dodge":0,"Lock":0,"Initiative":0,"Wisdom":0,"Prospecting":10}'),
      searchTarget: JSON.parse('{"minAp":13,"maxAp":13,"minMp":5,"maxMp":7,"minRange":3,' +
        '"maxRange":3,"minWp":6,"maxWp":15,"minCtrl":0,"maxCtrl":15,"minBlock":20,"maxBlock":100}')
    },
    {
      name: 'Xelor 13AP 5MP NonCrit',
      statValues: JSON.parse('{"Health Points":0.3,"AP":280,"MP":180,"WP":"20","Range":"100","Control":0,' +
        '"Block":4,"Critical Hit":"0","Critical Mastery":"0","Rear Mastery":0,"Healing Mastery":0,' +
        '"Area Mastery":"0.4","Single Target Mastery":"0.4","Melee Mastery":0,"Distance Mastery":1,' +
        '"Berserk Mastery":0,"Mastery in 3 random elements":1,"Mastery in 2 random elements":0.8,' +
        '"Mastery in 1 random elements":0,"Mastery Fire":0.25,"Mastery Earth":0.25,"Mastery Air":0.25,' +
        '"Mastery Water":0.25,"90% Vivacity":0,"Elemental Resistance":4,"Resistance to 3 random elements":3,' +
        '"Resistance to 2 random elements":2,"Resistance to 1 random elements":1,"Resistance Fire":1,' +
        '"Resistance Water":1,"Resistance Air":1,"Resistance Earth":1,"Critical Resistance":"0.25",' +
        '"Rear Resistance":"0.25","Dodge":0,"Lock":0,"Initiative":0,"Wisdom":0,"Prospecting":10}'),
      searchTarget: JSON.parse('{"minAp":13,"maxAp":13,"minMp":5,"maxMp":7,"' +
        'minRange":0,"maxRange":3,"minWp":6,"maxWp":15,"minCtrl":0,"maxCtrl":15,"minBlock":0,"maxBlock":100}')
    },
    {
      name: 'Feca 12AP 6MP NonCrit Melee',
      statValues: JSON.parse('{"Health Points":0.3,"AP":280,"MP":180,"WP":"50","Range":"120","Control":"75",' +
        '"Block":4,"Critical Hit":"0","Critical Mastery":"0","Rear Mastery":0,"Healing Mastery":0,"Area Mastery":"0",' +
        '"Single Target Mastery":"0","Melee Mastery":"0.8","Distance Mastery":"0","Berserk Mastery":0,' +
        '"Mastery in 3 random elements":"0.8","Mastery in 2 random elements":0.8,"Mastery in 1 random elements":"0.8",' +
        '"Mastery Fire":0.25,"Mastery Earth":0.25,"Mastery Air":0.25,"Mastery Water":0.25,"90% Vivacity":0,' +
        '"Elemental Resistance":4,"Resistance to 3 random elements":3,"Resistance to 2 random elements":2,' +
        '"Resistance to 1 random elements":1,"Resistance Fire":1,"Resistance Water":1,"Resistance Air":1,' +
        '"Resistance Earth":1,"Critical Resistance":"0.25","Rear Resistance":"0.25","Dodge":0,' +
        '"Lock":"0.5","Initiative":0,"Wisdom":0,"Prospecting":10}'),
      searchTarget: JSON.parse('{"minAp":12,"maxAp":12,"minMp":6,"maxMp":6,"minRange":0,' +
        '"maxRange":10,"minWp":6,"maxWp":15,"minCtrl":0,"maxCtrl":15,"minBlock":0,"maxBlock":50}')
    },
    {
      name: 'Steamer 12AP 6MP LD-Single',
      statValues: JSON.parse('{"Health Points":0.3,"AP":280,"MP":180,"WP":"0","Range":120,' +
        '"Control":0,"Block":4,"Critical Hit":"13","Critical Mastery":0.8,"Rear Mastery":0,"Healing Mastery":0,' +
        '"Area Mastery":"0","Single Target Mastery":"1","Melee Mastery":0,"Distance Mastery":1,"Berserk Mastery":0,' +
        '"Mastery in 3 random elements":1,"Mastery in 2 random elements":"1","Mastery in 1 random elements":"1",' +
        '"Mastery Fire":0.25,"Mastery Earth":0.25,"Mastery Air":0.25,"Mastery Water":0.25,"90% Vivacity":0,' +
        '"Elemental Resistance":4,"Resistance to 3 random elements":3,"Resistance to 2 random elements":2,' +
        '"Resistance to 1 random elements":1,"Resistance Fire":1,"Resistance Water":1,"Resistance Air":1,' +
        '"Resistance Earth":1,"Critical Resistance":"0.25","Rear Resistance":"0.25",' +
        '"Dodge":0,"Lock":0,"Initiative":0,"Wisdom":0,"Prospecting":10}'),
      searchTarget: JSON.parse('{"minAp":12,"maxAp":12,"minMp":6,"maxMp":6,"minRange":3,' +
        '"maxRange":3,"minWp":0,"maxWp":15,"minCtrl":0,"maxCtrl":15,"minBlock":20,"maxBlock":100}')
    }
  ]
});
