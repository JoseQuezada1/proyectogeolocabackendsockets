const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3001", // Permite solicitudes desde este origen
    methods: ["GET", "POST"]
  }
});

const port = 4000;

app.use(cors());

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '77510331Josep',
  database: 'dbgeolocalizacion'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('location', (data) => {
    console.log('Ubicación recibida:', data, new Date());
    const { latitude, longitude, userid } = data;
    
    // Envía la ubicación de vuelta al cliente
    //socket.emit('locationUpdate', { latitude, longitude });

    // Aquí manejamos los datos de la ubicación y los guardamos en la base de datos
    const query = 'update Ubicaciones set latitude = ?, longitude = ? where userid = ?';
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
