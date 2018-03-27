#!/usr/bin/env python

SRC_HTML_PATH = '../dest/html/*.html'
DST_JSON_PATH = '../dest/data/equipment.json'

IGNORES = [
    'Coat of the Sorceror-King',
    'White Lai Amulet',
    'Le Golashes',
    'Golden Fangs'
]

COMPLETIONS = {
    'Forgotten Cloak': {
        '90% Vivacity': '80'
    }
}

ALIASES = {
    'max MP': 'MP',
    'max WP': 'WP'
}

import lxml.html
import glob
import json
import os

def parseEquipments(html):
    root = lxml.html.fromstring(html)
    equipments = dict()
    trs = root.xpath('//tbody/tr')
    ignoreSet = set(IGNORES)
    for tr in trs:
        name = tr.xpath('./td[2]/span[@class="ak-linker"]/a/text()')[0]
        rarity = tr.xpath('./td[2]/span[contains(@class, "ak-icon-small")]/@title')[0]
        if rarity == '':
            rarity = 'Epic'
        elif rarity == 'PLAYER-VERSUS-PLAYER COMBAT':
            rarity = 'PvP'

        #
        if name in ignoreSet or name + rarity in ignoreSet:
           continue
        url = tr.xpath('./td[2]/span[@class="ak-linker"]/a/@href')[0]
        _type = tr.xpath('./td[3]/img/@title')[0]
        _stats = tr.xpath('./td[4]//div[@class="ak-title"]/text()')
        _stats = map(lambda x: x.strip(), _stats)
        level = tr.xpath('./td[5]/text()')[0].split(' ')[-1].strip()
        stats = dict()
        for stat in _stats:
            splits = stat.split(' ')
            value = splits[0]
            key = ' '.join(splits[1:])
            key = key.replace('  ', ' ')
            stats[key] = value.replace(',', '')
        if COMPLETIONS.has_key(name):
            for k, v in COMPLETIONS[name].items():
                stats[k] = v
        for key in ALIASES.keys():
            if stats.has_key(key):
                stats[ALIASES[key]] = stats[key]
        if not equipments.has_key(_type):
            equipments[_type] = [];
        equipments[_type].append({
            'name': name,
            'url': url,
            'rarity': rarity,
            'type': _type,
            'stats': stats,
            'level': level
        })
        ignoreSet.add(name + rarity)
    return equipments

def readHtml(path):
    html = ''
    for filename in glob.glob(path):
        html += open(filename).read()
    return html
    
def writeDictToJson(d, path):
    if not os.path.exists(os.path.dirname(path)):
        os.makedirs(os.path.dirname(path))
    with open(path, 'w') as f:
        json.dump(d, f, indent=4)
    
if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    html = readHtml(SRC_HTML_PATH)
    equipments = parseEquipments(html)
    writeDictToJson(equipments, DST_JSON_PATH)
