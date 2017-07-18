cd `dirname $0`
mkdir -p ../dest/html 2> /dev/null
wget 'https://www.wakfu.com/en/mmorpg/encyclopedia/armors?LVL_MIN=200&LVL_MAX=200&RARITY[]=4&RARITY[]=5&RARITY[]=7&size=120' -O ../dest/html/armors.html
wget 'https://www.wakfu.com/en/mmorpg/encyclopedia/weapons?LVL_MIN=200&LVL_MAX=200&RARITY[]=4&RARITY[]=5&RARITY[]=7' -O ../dest/html/weapons.html