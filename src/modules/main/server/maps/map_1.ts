import { RpgMap, MapData } from '@rpgjs/server'
import { VillagerEvent } from '../events/villager'
import { TowerOneEvent } from '../events/tower-1'
@MapData({
    id: 'map_1',
    file: require('./tmx/map_1.tmx'),
    events: [
        TowerOneEvent
    ]
})
export class MapOne extends RpgMap { }