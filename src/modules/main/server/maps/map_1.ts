import { RpgMap, MapData } from '@rpgjs/server'

@MapData({
    id: 'map_1',
    file: require('./tmx/map_1.tmx'),
    name: 'Town' // optional
})
export class MapOne extends RpgMap { }