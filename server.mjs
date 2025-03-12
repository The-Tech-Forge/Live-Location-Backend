import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import os from 'os';
import { Employee } from './Handler/Employee.mjs';
import { Client } from './Handler/Client.mjs';

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }, // Allow all origins (Adjust as needed)
});

const employeeLocations = new Map();
const socketEmployeeMap = new Map(); 

io.on('connection', (socket) => {

    socket.on("identify",(user_type)=>{
      if(user_type == "employee"){
        new Employee(socket,employeeLocations, socketEmployeeMap,  io);
      }else if(user_type == "client"){
        new Client(socket,io,employeeLocations);
      }else{
        console.log("Unknow user")
      }
    })
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
