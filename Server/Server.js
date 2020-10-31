'use strict';

var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	compression = require('compression'),
	session = require('express-session');

var mysql = require('mysql');

var app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: true, maxAge: 60000 }
}));

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "toor",
	database: 'parcial'
});

app.options("/*", function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
	res.sendStatus(200);
});

app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

/*****************************************************************/
app.get('/', function (req, res) {
	res.json({ Mensaje: "Servidor iniciado..." });
});
app.get('/Dashboard', function (req, res) {
	var Send = {
		Exito: false,
		Proyectos: [],
		LicPro: []
	};
	var pro = [], Lic = [];

	con.query('SELECT Nombre, (SELECT COUNT(Id) FROM Proyectos WHERE IdCategoria = c.Id AND Estado = 1) AS Proyectos FROM Categorias c', (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Consultando los Datos de las Graficas.' });
		}
		else {
			rows.forEach((row) => {
				pro.push({ label: row.Nombre, Proyectos: row.Proyectos });
			});
			Send.Proyectos = pro;			
			con.query('SELECT Nombre, (SELECT COUNT(Id) FROM Proyectos WHERE IdLicencia = c.Id AND Estado = 1) AS Proyectos FROM Licencias c', (err, rows) => {
				if (err) {
					console.log("Error=>", err);
					res.json({ Exito: false, Mensaje: 'Error Consultando los Datos de las Graficas.' });
				}
				else {
					rows.forEach((row) => {
						Lic.push({label: row.Nombre, value: row.Proyectos});
					});
					//console.log("Licencias=>",Lic);
					Send.LicPro = Lic;
					Send.Exito = true;
					res.json(Send);
				}
			});
		}
	});
});
app.get('/InfoProyectos', function (req, res) {
	var Send = {
		Exito: false,
		Categorias: [],
		Proyectos: [],
		Licencias: [],
		RowsPage: ''
	};
	var cat = [], pro = [], lic = [];

	con.query('SELECT * FROM Categorias', (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Consultando las Categorias.' });
		}
		else {
			rows.forEach((row) => {
				//console.log(`${row.Id} - ${row.Usuario} - ${row.Password} - ${row.Nombre}`);
				cat.push({ Nombre: row.Nombre, Id: row.Id });
			});
			Send.Categorias = cat;
			con.query('SELECT p.*,c.Nombre as Categoria FROM proyectos p INNER JOIN categorias c ON c.Id = p.IdCategoria WHERE p.Estado = 1', (err, rowsp) => {
				if (err) res.json({ Exito: false, Mensaje: 'Error Consultando los Proyectos.' });
				else {
					rowsp.forEach((rowp) => {
						pro.push({
							Nombre: rowp.Nombre, Id: rowp.Id,
							Fecha: rowp.Fecha,
							Descripcion: rowp.Descripcion,
							Categoria: rowp.Categoria,
							Link: rowp.LinkProyecto,
							Autor: rowp.Autor,
							Avatar: rowp.Avatar
						});
					});
					Send.Proyectos = pro;
					con.query('SELECT *FROM Licencias', (err, rowsl) => {
						if (err) res.json({ Exito: false, Mensaje: 'Error Consultando las Licencias.' });
						else {
							rowsl.forEach((row) => {
								lic.push({ Nombre: row.Nombre, Id: row.Id });
							});
							Send.Licencias = lic;
							con.query('SELECT *FROM Configuracion WHERE Activo = 1', (err, rowsl) => {
								if (err) res.json({ Exito: false, Mensaje: 'Error Consultando las Configuraciones.' });
								else {
									rowsl.forEach((row) => {
										Send.RowsPage = row.Tipo;
									});
									Send.Exito = true;
									res.json(Send);
								}
							});
						}
					});
				}
			});
		}
	});
});
app.get('/FilterProyectos', function (req, res) {
	//console.log(req.query);
	var query = "";
	if (req.query.data !== "") {
		query = 'SELECT p.*,c.Nombre as Categoria FROM proyectos p INNER JOIN categorias c ON c.Id = p.IdCategoria WHERE p.Estado = 1 AND p.IdCategoria = ' + req.query.data;
	}else{
		query = 'SELECT p.*,c.Nombre as Categoria FROM proyectos p INNER JOIN categorias c ON c.Id = p.IdCategoria WHERE p.Estado = 1';
	}
	con.query(query, (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Filtrando los Proyectos.' });
		}
		else {
			var pro = [];
			rows.forEach((row) => {
				pro.push({
					Nombre: row.Nombre, Id: row.Id,
					Fecha: row.Fecha,
					Descripcion: row.Descripcion,
					Categoria: row.Categoria,
					Link: row.LinkProyecto,
					Autor: row.Autor,
					Avatar: row.Avatar
				});
			});
			res.json({ Exito: true, Proyectos: pro });
		}
	});
});
app.post('/GuardarProyecto', function (req, res) {
	var Send = {
		Exito: false,
		Mensaje: ""
	};
//console.log("<=",req.body.Input,"=>");
	con.query("INSERT INTO Proyectos(IdCategoria,Nombre,Fecha,Descripcion,IdLicencia,Link,Autor,Avatar,Estado) VALUES("+req.body.Input.Categoria+",'"+req.body.Input.Nombre+"','"+req.body.Input.Fecha+"','"+req.body.Input.Descripcion+"',"+req.body.Input.Licencia+",'"+req.body.Input.Link+"','"+req.body.Input.Autor+"','"+req.body.Input.Imagen+"',1)", (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Insertando los Datos.' });
		}
		else {
			Send.Exito = true;
			res.json(Send);
		}
	});
});
app.post('/EliminarProyecto', function (req, res) {
	var Send = {
		Exito: false,
		Mensaje: ""
	};
//console.log("<=",req.body.Input,"=>");
	con.query("UPDATE Proyectos SET Estado = 0 WHERE Id = "+req.body.Id, (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Eliminando el Registro.' });
		}
		else {
			Send.Exito = true;
			res.json(Send);
		}
	});
});
app.get('/ConfProyectos', function (req, res) {
	var Send = {
		Exito: false,
		Config: [],
		Proyectos: []
	};
	var conf = [], pro = [], lic = [];

	con.query('SELECT * FROM Configuracion', (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Consultando las Categorias.' });
		}
		else {
			rows.forEach((row) => {
				//console.log(`${row.Id} - ${row.Usuario} - ${row.Password} - ${row.Nombre}`);				
				conf.push({ Id: row.Id, Tipo: row.Tipo, Activo: (row.Activo == 1)?true:false });
			});
			Send.Config = conf;
			con.query('SELECT p.*,c.Nombre as Categoria FROM proyectos p INNER JOIN categorias c ON c.Id = p.IdCategoria WHERE p.Estado = 0', (err, rowsp) => {
				if (err) res.json({ Exito: false, Mensaje: 'Error Consultando los Proyectos.' });
				else {
					rowsp.forEach((rowp) => {
						pro.push({
							Nombre: rowp.Nombre, Id: rowp.Id,
							Fecha: rowp.Fecha,
							Descripcion: rowp.Descripcion,
							Categoria: rowp.Categoria,
							Link: rowp.LinkProyecto,
							Autor: rowp.Autor,
							Avatar: rowp.Avatar
						});
					});
					Send.Proyectos = pro;
					Send.Exito = true;
					res.json(Send);
				}
			});
		}
	});
});
app.post('/GuardarConf', function (req, res) {
	var Send = {
		Exito: false,
		Mensaje: ""
	};
	con.query('UPDATE configuracion SET Activo = 0', (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Actualizando los Filtros.' });
		}
		else {			
			con.query('UPDATE configuracion SET Activo = 1 WHERE Id = ' + req.body.Id, (err, rows) => {
				if (err) {
					console.log("Error=>", err);
					res.json({ Exito: false, Mensaje: 'Error Actualizando los Filtros.' });
				}
				else {			
					Send.Exito = true;
					res.json(Send);
				}
			});
		}
	});	
});
app.post('/ActivarProyecto', function (req, res) {
	var Send = {
		Exito: false,
		Mensaje: ""
	};
	con.query('UPDATE Proyectos SET Estado = 1 WHERE Id = ' + req.body.Id, (err, rows) => {
		if (err) {
			console.log("Error=>", err);
			res.json({ Exito: false, Mensaje: 'Error Actualizando los Filtros.' });
		}
		else {			
			Send.Exito = true;
			res.json(Send);
		}
	});	
});
/*****************************************************************/
/***		Control de Errores		***/
app.use(function (err, req, res, next) {
	console.error("Primer Handler: ", err.stack);
	console.log("\n\n");
	next(err);
});

app.use(function (err, req, res, next) {
	if (req.xhr) {
		res.status(500).send({
			error: 'Error Interno!'
		});
	} else {
		console.log("Error Tipo 500: ", err);
		next(err);
	}
});

// Error 500
app.use(function (err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	res.status(500);
	res.render('500', {
		error: err
	});
});

// Error 404
app.use(function (req, res) {
	/* res.status(404);
	res.render('404', {
		Error: 'El objecto que buscas no se encuentra en el servidor!!!'
	}); */
	res.status(404).send({
		Error: 'El objecto que buscas no se encuentra en el servidor!!!'
	});
});
// Excepción no Controlada
process.on('uncaughtException', function (err) {
	console.log('Excepción No Controlada: \n' + err);
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Escuchando por: " + port);