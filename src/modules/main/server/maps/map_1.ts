import { RpgMap, MapData } from '@rpgjs/server'
import { TowerEvent } from '../events/Tower-1'


@MapData({
    id: 'map_1',
    file: require('./tmx/map_1.tmx'),
})
export class MapOne extends RpgMap { }