export class NetworkManager {
    constructor(scene, socket) {
        this.scene = scene;
        this.socket = socket;
        
        this.bindLocalEvents();
        this.bindSocketEvents();
    }
    
    bindLocalEvents() {
        this.scene.events.on('place_die', (data) => {
            this.socket.emit('place_die', data);
        });
        
        this.scene.events.on('undo_place_die', (data) => {
            this.socket.emit('undo_place_die', data);
        });
    }
    
    bindSocketEvents() {
        this.socket.on('remote_place_die', (data) => {
            this.scene.events.emit('remote_place_die', data);
        });
        
        this.socket.on('remote_undo_place_die', (data) => {
            this.scene.events.emit('remote_undo_place_die', data);
        });
    }
}