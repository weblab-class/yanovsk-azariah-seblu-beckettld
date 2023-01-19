import { RpgServer, RpgModule } from '@rpgjs/server'
import world from './maps/tmx/myworld.world'
import { MapOne } from './maps/map_1'
import { player } from './player'

@RpgModule<RpgServer>({ 
    player,
    maps: [
        MapOne
    ]
})
export default class RpgServerModuleEngine {}