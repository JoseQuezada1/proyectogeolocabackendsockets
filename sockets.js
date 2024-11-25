const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Permite solicitudes desde cualquier origen
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 4000;

app.use(cors());

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL en Railway');
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('location', (data) => {
    console.log('Ubicación recibida:', data, new Date());
    const { latitude, longitude, userid } = data;

    const query = 'UPDATE ubicaciones SET latitude = ?, longitude = ? WHERE userid = ?';
    connection.query(query, [latitude, longitude, userid], (err, result) => {
      if (err) {
        console.error('Error al insertar en la base de datos:', err);
      } else {
        console.log('Ubicación guardada en la base de datos');
      }
    });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(port, () => {
  console.log(`Servidor de sockets escuchando en el puerto ${port}`);
});