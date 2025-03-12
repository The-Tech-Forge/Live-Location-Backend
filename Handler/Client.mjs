
export class Client {
    constructor(socket, io, employeeLocation) {
        this.socket = socket;
        this.io = io;
        this.employeeLocation = employeeLocation;
        this.initSocketEvents();
    }

    initSocketEvents() {
        console.log('New Client connected');
        console.log(this.employeeLocation);
        this.socket.on('requestData', () => {
            this.sendData();
        });

        this.socket.on('disconnect', () => {
            this.handleDisconnect();
        });
    }

    sendData() {
        // Example data response
        this.socket.emit('responseData', { message: 'Here is the requested data' });
    }

    handleDisconnect() {
        console.log('Client disconnected');
    }
}

