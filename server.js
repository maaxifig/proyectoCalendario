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

app.get('/cursos', function (req, res) {
  res.send('Estos son los cursos');
  console.log("Página de cursos");
})

/*app.get('/users', (request, response) => {
  pool.query('SELECT * FROM Usuario', (error, result) => {
      if (error) throw error;

      response.send(result);
  });
});*/

app.post('/createUser', (req, res) => {

  /*if (!req.body.name || req.body.name.length < 3) {
      // 400 Bad request
      res.status(400).send('Name is required and should be minimum 3 characters!');
      return;
  }*/

  var username = req.body.userId; //Aca se rompe. Hay que buscar la libreria de json para acceder a los datos.
  console.log('user id: '+username).toString();

  const user = {
      userId: req.body.userId,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      apartment: req.body.apartment

  };
  conexion.query('INSERT INTO Usuario (userId, first_name, last_name, password, apartment) VALUES ('+user.userId+','+user.first_name+','+user.last_name+', '+user.password+','+user.apartment+')');
  if(!err) {
    res.json(rows);
  } else {
    console.log(err);
  }
});

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