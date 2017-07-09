#!/usr/bin/env python

import lxml.html

def parseEquipments(html):
    root = lxml.html.fromstring(html)
    d = dict()
    trs = root.xpath('//tbody/tr')
    for tr in trs:
        name = tr.xpath('./td[2]/span[@class="ak-linker"]/a/text()')[0]
        etype = tr.xpath('./td[3]/img/@title')[0]
        _stats = tr.xpath('./td[4]//div[@class="ak-title"]/text()')
        _stats = map(lambda x: x.strip(), _stats)
        stats = dict()
        for stat in _stats:
            splits = stat.split(' ')
            value = splits[0]
            key = ' '.join(splits[1:])
            key = key.replace('  ', ' ')
            stats[key] = value
        d[name] = {
            'type': etype,
            'stats': stats
        }
    return d

f_armors = open('../dest/html/armors.html')
f_weapons = open('../dest/html/weapons.html')
html = f_armors.read() + f_weapons.read()

print parseEquipments(html)
