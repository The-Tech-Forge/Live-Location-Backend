

export class Employee {
    constructor(socket, employeeLocations, socketEmployeeMap, io) {
        this.socket = socket;
        this.employeeLocations = employeeLocations;
        this.socketEmployeeMap = socketEmployeeMap;
        this.io = io;

        this.initSocketEvents();
    }

    initSocketEvents() {
        console.log('New Employee connected');
        console.log(this.employeeLocations);
        this.socket.on('updateLocation', ({ employeeId, latitude, longitude }) => {
            this.updateLocation(employeeId, latitude, longitude);
        });

        this.socket.on('disconnect', () => {
            this.handleDisconnect();
        });
    }

    updateLocation(employeeId, latitude, longitude) {
        this.employeeLocations.set(employeeId, { latitude, longitude });
        this.socketEmployeeMap.set(this.socket.id, employeeId);
        console.log(`Updated location for ${employeeId}: ${latitude}, ${longitude}`);

        // Broadcast location update to all clients
        this.io.emit('locationUpdate', Object.fromEntries(this.employeeLocations));
    }

    handleDisconnect() {
        const employeeId = this.socketEmployeeMap.get(this.socket.id);
        if (employeeId) {
            this.employeeLocations.delete(employeeId); // Remove employee from location data
            this.socketEmployeeMap.delete(this.socket.id); // Remove socket entry
            console.log(`Removed location for ${employeeId}`);
            
            // Broadcast updated location list
            this.io.emit('locationUpdate', Object.fromEntries(this.employeeLocations));
        }

        console.log('Client disconnected');
    }
}