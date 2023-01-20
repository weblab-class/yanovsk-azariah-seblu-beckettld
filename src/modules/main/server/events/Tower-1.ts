import { RpgEvent, EventData, RpgPlayer } from '@rpgjs/server'

@EventData({
    name: 'tower-1',
    hitbox: {
        width: 32,
        height: 32
    }
})
export class TowerOneEvent extends RpgEvent {
    onInit() {
    }
    async onPlayerTouch(player: RpgPlayer) {
        await player.showText('Solve coding challenge', {
            talkWith: this
        })
    }
} 