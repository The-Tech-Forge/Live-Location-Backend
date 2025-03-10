import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import os from 'os';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }, // Allow all origins (Adjust as needed)
});

const employeeLocations = new Map(); // Use Map for better performance

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('updateLocation', ({ employeeId, latitude, longitude }) => {
        employeeLocations.set(employeeId, { latitude, longitude });
        console.log(`Updated location for ${employeeId}: ${latitude}, ${longitude}`);

        // Broadcast location update to all clients
        io.emit('locationUpdate', Object.fromEntries(employeeLocations));
    });
console.log(employeeLocations)
    socket.on('disconnect', () => {
      console.log(employeeLocations)
        console.log('Client disconnected');
    });
});

const getNetworkAddresses = () => {
    const interfaces = os.networkInterfaces();
    const addresses = [];
  
    for (const name in interfaces) {
      for (const iface of interfaces[name]) {
        // Filter only IPv4 and non-internal (not localhost) addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          addresses.push(iface.address);
        }
      }
    }
  
    return addresses;
  };

const PORT = process.env.PORT || 8080;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at the following links:`);
    console.log(`- Local: http://localhost:${PORT}`);

    const addresses = getNetworkAddresses();
    addresses.forEach((addr) => {
        console.log(`- Network: http://${addr}:${PORT}`);
    });
}
);
