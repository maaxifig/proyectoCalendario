// require: Trae la librería express del npm.
var express = require('express');
// Se invoca la función (de la variable express) y se almacena en la variable app.
var app = express();

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

// Correr el servidor con el puerto 8989.
app.listen(5000);