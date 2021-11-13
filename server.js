// require: Trae la librería express del npm.

//MARK: - PREPARACION INICIAL:
var express = require('express');
const morgan = require('morgan')

var app = express();
app.use(morgan('dev'))
var mysql = require('mysql');
app.use(express.json());

//MARK: -------------------------------------------------------------------------------------- CONECCION:
var conexion = mysql.createConnection({

  host: 'localhost',
  database: 'sistemaReservas',
  user: 'root',
  password: 'Loreto18'

});

conexion.connect(function(error){
  if(error){
    throw error;
  }else{
    console.log('Conexion exitosa');
  }
})

//MARK: -------------------------------------------------------------------------------------- USUARIOS:
// Define el home de la página y que función se va a ejecutar.
// La función tiene como parámetro el request y el response.
app.get('/', function (req, res) {
  res.send('Este es el home');
  console.log("Página de inicio...")
})

//MARK: - Create User:
app.post('/createUser', (req, res) => {
  console.log("Estoy dentro del endpoint");

  
  user = req.body
  const query = 'INSERT INTO Usuario (userId, first_name, last_name, password, apartment) VALUES ("'+user.userId+'","'+user.first_name+'","'+user.last_name+'", "'+user.password+'","'+user.apartment+'")'
  console.log(query)
  
  conexion.query(query);

});

//MARK: - UpdateUser:
app.put('/updateUser/:userId', (req,res) => {

  var { userId } = req.params
  if (!userId) return res.status(404).send('The user with the given ID was not found!');

  var user = req.body;

  const query = 'UPDATE Usuario SET userID = "'+ user.userId +'", first_name = "'+ user.first_name +'", last_name = "'+ user.last_name +'",password = "'+ user.password +'",apartment = "'+user.apartment+'" WHERE userId = "'+ userId +'"'; 
  console.log(query);
  conexion.query(query);

})

//MARK: - GetAllUsers:
app.get('/getAllUsers', (req, res) => {
  conexion.query('SELECT * FROM Usuario', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

//MARK: - Get Specific User:
app.get('/getUserById/:id', (req, res) => {
  const { id } = req.params
  conexion.query('SELECT * FROM Usuario WHERE userId = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

//MARK: - Delete Reserve:
app.delete('/removeUserById/:id', (req, res) => {

const { id } = req.params
  conexion.query('DELETE  FROM Usuario WHERE userId = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });

});


//MARK: -------------------------------------------------------------------------------------- RESERVES:


//MARK: - Create Reserve:
app.post('/createReserva', (req, res) => {

  reserva = req.body
  const query = 'INSERT INTO Reserva (userId, turno, conLimpieza, fecha) VALUES ("'+reserva.userId+'", "'+reserva.turno+'",'+reserva.conLimpieza+', "'+reserva.fecha+'")'
  console.log(query)

  conexion.query(query);

});

//MARK: - Update Reserve:
app.put('/updateReserva/:idReserva', (req,res) => {

  var { idReserva } = req.params
  if (!idReserva) return res.status(404).send('The Reserve with the given ID was not found!');

  var reserva = req.body;

  const query = 'UPDATE Reserva SET fecha = "'+ reserva.fecha +'", userId = "'+ reserva.userId +'",turno = "'+ reserva.turno +'",conLimpieza = '+reserva.conLimpieza+' WHERE idReserva = "'+ idReserva +'"';
  console.log(query);
  conexion.query(query);

})

//MARK: - Delete Reserve:
app.delete('/removeReservaById/:id', (req, res) => {

const { id } = req.params
  conexion.query('DELETE  FROM Reserva WHERE idReserva = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });

});

//MARK: - Get Specific Reserve:
app.get('/getReservaById/:id', (req, res) => {
  const { id } = req.params
  conexion.query('SELECT * FROM Reserva WHERE idReserva = ?', [id], (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//MARK: - Get All Reserves:
app.get('/getAllReservas', (req, res) => {
  conexion.query('SELECT * FROM Reserva', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });
});

//MARK: -------------------------------------------------------------------------------------- Final:
app.listen(5000);