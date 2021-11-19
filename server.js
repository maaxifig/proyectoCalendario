// require: Trae la librería express del npm.

//MARK: - PREPARACION INICIAL:
const { json } = require('body-parser');
var express = require('express');
const morgan = require('morgan')
var router = express.Router();
var app = express();
app.use(morgan('dev'))
var mysql = require('mysql');
app.use(express.json());

//MARK: -------------------------------------------------------------------------------------- CONECCION:
var conexion = mysql.createConnection({

  host: 'localhost',
  database: 'sistemaReservas',
  user: 'root',
  password: ''

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
  user = req.body
  const query = 'INSERT INTO Usuario (userId, first_name, last_name, password, apartment) VALUES ("'+user.userId+'","'+user.first_name+'","'+user.last_name+'", "'+user.password+'","'+user.apartment+'")'
  conexion.query(query, (err, rows, fields) => {
      if(!err && rows.affectedRows > 0){
        res.status(200).json({
          status: "Se creo el usuario correctamente"
        });
      } else {
        res.status(400).json({
          status: "El userId ya esta utilizado, ingrese otro"
        });
      }
  })
});

//MARK: - UpdateUser:                     REVISAR
app.put('/updateUser/:userId', (req,res) => {

  var { userId } = req.params
  var user = req.body;

  const query = 'UPDATE Usuario SET userID = "'+ user.userId +'", first_name = "'+ user.first_name +'", last_name = "'+ user.last_name +'",password = "'+ user.password +'",apartment = "'+user.apartment+'" WHERE userId = "'+ userId +'"'; 
  
  conexion.query(query, (err, rows, fields) => {
    if(!err){
      res.status(200).json({
        Status: 'El usuario se modifico correctamente'
      });
    }
    else {
      res.status(409).json({
        Status: 'No se puede modificar el usuario ya que esta ligado a una reserva o no existe'
      });
    }
  });

});

//MARK: - GetAllUsers:
app.get('/getAllUsers', (req, res) => {
  conexion.query('SELECT * FROM Usuario', (err, rows, fields) => {
    if(!err && rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({
        Status: 'Not found'
      });
    }
  });  
});

//MARK: - Get Specific User:
app.get('/getUserById/:id', (req, res) => {
  const { id } = req.params
  conexion.query('SELECT * FROM Usuario WHERE userId = ?', [id], (err, rows, fields) => {
    if(!err && rows.length >0) {
      res.status(200).json(rows);
    } 
    else{
      res.status(404).json({
        Status: 'El usuario no existe'
      });
    }
  });  
});

//MARK: - Delete User:             FUNCIONANDO NO TOCAR

app.delete('/removeUserById/:id', (req, res) => {

  const { id } = req.params
     conexion.query('DELETE  FROM Usuario WHERE userId = ?', [id], (err, rows, fields) => {
      if(rows){
        if(rows.affectedRows > 0) {
          res.status(200).json({
            Status: 'El usuario se elimino correctamente'
          });
        } else {
          if(!err){
            res.status(404).json({
            Status: 'El usuario no existe'
          });
        }
      }
    }
      else {
          res.status(409).json({
          Status: 'Conflict',
          messege: 'El usuario tiene reservas vigentes',
          code: '409'
      });
      }
    });
  });


//MARK: -------------------------- RESERVES:----------------------------------------------------


//MARK: - Create Reserve: No se valida formato de fecha porque se supone q en calendar siempre sale bien
app.post('/createReserva', (req, res) => {

  reserva = req.body

  const query = 'INSERT INTO Reserva (userId, turno, conLimpieza, fecha) VALUES ("'+reserva.userId+'", "'+reserva.turno+'",'+reserva.conLimpieza+', "'+reserva.fecha+'")'

    conexion.query(query, (err, rows, fields) => {
      console.log("Error: "+err);
      if(!err && rows.affectedRows > 0){
        res.status(200).json({
          status: "Se creo el la reserva correctamente"
        });
      } else {
        res.status(400).json({
          status: "El usuario no existe"
        });
      }
  })
});

//MARK: - Update Reserve:
app.put('/updateReserva/:idReserva', (req,res) => {

  var { idReserva } = req.params
  if (!idReserva) return res.status(404).send('No se paso ningun id de reserva');

  var reserva = req.body;

  const query = 'UPDATE Reserva SET fecha = "'+ reserva.fecha +'", userId = "'+ reserva.userId +'",turno = "'+ reserva.turno +'",conLimpieza = '+reserva.conLimpieza+' WHERE idReserva = "'+ idReserva +'"';
  console.log(query);
  conexion.query(query, (err, rows, fields) => {
    if(!err){
      res.status(200).json({
        status: "La reserva se modifico correctamente"
      });
    } else {
      res.status(409).json({
        status: "Hubo un error al modificar la reserva"
      });
    }
  });

})


//MARK: - Delete Reserve:
app.delete('/removeReservaById/:id', (req, res) => {

const { id } = req.params
  conexion.query('DELETE  FROM Reserva WHERE idReserva = ?', [id], (err, rows, fields) => {
    console.log(rows);
      if(rows.affectedRows > 0) {
          res.status(200).json({
          Status: 'La reserva se elimino correctamente'
        });
      } else {
          if(!err){
            res.status(404).json({
            Status: 'La reserva no existe'
          });
        }
      }
  });
});

//MARK: - Get Specific Reserve:
app.get('/getReservaById/:id', (req, res) => {
  const { id } = req.params
  conexion.query('SELECT * FROM Reserva WHERE idReserva = ?', [id], (err, rows, fields) => {
    if(!err && rows.length >0) {
      res.status(200).json(rows);
    } else {
        res.status(404).json({
        Status: 'La reserva no existe'
      });
    }
  });
});

//MARK: - Get All Reserves:
app.get('/getAllReservas', (req, res) => {
  conexion.query('SELECT * FROM Reserva', (err, rows, fields) => {
    console.log("Cantidad de reservas:"+ rows.length);
    if(!err && rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({
        Status: 'No hay reservas'
      });
    }
  });
});

//Validar fecha HAY QUE IMPLEMENTARLO CON CALLBACKS
/* 
function validarReserva (fecha, turno) {
  const query = 'SELECT * FROM Reserva WHERE fecha = "'+fecha+'" AND turno = "'+turno+'"'
  console.log("query: "+ query);
  const resultado = conexion.query(query, (err, rows, fields) => {
    
    console.log("rows: "+rows);
    console.log("fields: "+fields);
    
    if(!err){
      return rows.length
    }
   
  });
  console.log("resultado:"+resultado);
  console.log(Object.values(resultado));

  return resultado;

}
*/

//MARK: -------------------------------------------------------------------------------------- Final:
app.listen(5000);