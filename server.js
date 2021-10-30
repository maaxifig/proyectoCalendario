// require: Trae la librería express del npm.
var express = require('express');
// Se invoca la función (de la variable express) y se almacena en la variable app.
var app = express();

var mysql = require('mysql');

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

// Define el home de la página y que función se va a ejecutar.
// La función tiene como parámetro el request y el response.
app.get('/', function (req, res) {
  res.send('Este es el home');
  console.log("Página de inicio...")
})

app.get('/Test', function (req, res) {
  res.send('Estos es el test');
  console.log("Página de cursos");
})

/*app.get('/users', (request, response) => {
  pool.query('SELECT * FROM Usuario', (error, result) => {
      if (error) throw error;

      response.send(result);
  });
});*/

app.get('/getAllUsers', (req, res) => {
  conexion.query('SELECT * FROM Usuario', (err, rows, fields) => {
    if(!err) {
      res.json(rows);
    } else {
      console.log(err);
    }
  });  
});

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

// Correr el servidor con el puerto 8989.
app.listen(5000);