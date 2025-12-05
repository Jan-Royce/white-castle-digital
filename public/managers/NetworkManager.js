export class NetworkManager {
    constructor(scene, socket) {
        this.scene = scene;
        this.socket = socket;
        
        this.bindLocalEvents();
        this.bindSocketEvents();
    }
    
    bindLocalEvents() {
        this.scene.events.on('remove_die', (die) => {
            this.socket.emit('remove_die', die);
        });
        
        this.scene.events.on('place_die', (data) => {
            this.socket.emit('place_die', data);
        });
    }
    
    bindSocketEvents() {
        this.socket.on('remote_remove_die', (die) => {
            this.scene.events.emit('remote_remove_die', die);
        });
        
        this.socket.on('remote_place_die', (data) => {
            this.scene.events.emit('remote_place_die', data);
        });
    }
}