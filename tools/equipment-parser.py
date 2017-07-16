#!/usr/bin/env python

SRC_HTML_PATH = '../dest/html/*.html'
DST_JSON_PATH = '../dest/data/equipment.json'

import lxml.html
import glob
import json
import os

def parseEquipments(html):
    root = lxml.html.fromstring(html)
    equipments = dict()
    trs = root.xpath('//tbody/tr')
    for tr in trs:
        name = tr.xpath('./td[2]/span[@class="ak-linker"]/a/text()')[0]
        rarity = tr.xpath('./td[2]/span[contains(@class, "ak-icon-small")]/@title')[0]
        _type = tr.xpath('./td[3]/img/@title')[0]
        _stats = tr.xpath('./td[4]//div[@class="ak-title"]/text()')
        _stats = map(lambda x: x.strip(), _stats)
        stats = dict()
        for stat in _stats:
            splits = stat.split(' ')
            value = splits[0]
            key = ' '.join(splits[1:])
            key = key.replace('  ', ' ')
            stats[key] = value
        if not equipments.has_key(_type):
            equipments[_type] = [];
        equipments[_type].append({
            'name': name,
            'rarity': rarity,
            'type': _type,
            'stats': stats
        })
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
