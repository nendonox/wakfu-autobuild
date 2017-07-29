cd `dirname $0`
mkdir -p ../dest/html 2> /dev/null
wget 'https://www.wakfu.com/en/mmorpg/encyclopedia/armors?LVL_MIN=50&LVL_MAX=200&RARITY[]=3&RARITY[]=4&RARITY[]=5&RARITY[]=6&RARITY[]=7&size=2500' -O ../dest/html/armors.html
wget 'https://www.wakfu.com/en/mmorpg/encyclopedia/weapons?LVL_MIN=50&LVL_MAX=200&RARITY[]=3&RARITY[]=4&RARITY[]=5&RARITY[]=6&RARITY[]=7&size=1000' -O ../dest/html/weapons.html
