import * as fs from "fs";
import { Router } from "express";
import { escribirArchivo, leerArchivo, alertaSI } from "../utils/handlers.js";
import { send } from "process";
import { time, timeEnd } from "console";
import { Script } from "vm";
import pool from "../server.js";
const router = Router();
let user = "";

//===================GET===================//

router.get('/', (req, res) => {
	if (user == "") {
		res.render('home', { flag: 0, Iniciar: 1, menuadmin: 0 })
	} else if (user != 'admin') {
		res.render('home', { flag: 1, Iniciar: 0, menuadmin: 0 })
	} else {
		(user == 'admin')
		res.render('home', { flag: 1, Iniciar: 0, menuadmin: 1 })
	}
})

router.get('/contacto', (req, res) => {
	if (user == "") {
		res.render('contacto', { flag: 0, Iniciar: 1 })
	} else {
		res.render('contacto', { flag: 1, Iniciar: 0 });
	}
})

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/recetario', async (req, res) => {
	// validacion de usuario logeado
	//let receta = await pool.query('SELECT * FROM users WHERE $1=username', [usuario logeado]);
	res.render('recetario',{receta:1});
});

router.get('/calendario', (req, res) => {
	res.render('calendario');
});

// router.post('/app', async (req, res) => {
//     let user = req.body.user;
//     let pass = req.body.pass;
//     const datausuarios = await leerArchivo('./data/login.json');
//     const datapacientes = await leerArchivo('./data/pacientes.json');

//     let arrUsuarios = datausuarios.users;
//     console.log(arrUsuarios);
//     let arrPacientes = datapacientes.pacientes;
//     console.log(arrPacientes);
//     console.log(user);
//     console.log(pass);
//     let llave = false;
//     arrUsuarios.forEach(element => {
//         if (user == element.nombre && pass == element.contrasena) {
//             console.log(element.nombre);
//             console.log(element.contrasena);
//             llave = true;
//         }
//     });
//     if (llave == true) {
//             res.render("login1")
//     }
//     else {
//         res.render("login2")
//     }       
// });
router.post('/app', async (req, res) => {
	user = req.body.username;
	let pass = req.body.password;
	//console.log(req.body.email);
	//console.log(req.body.password);
	let result = await pool.query(`select count(*) from users where $1=username and $2=password`, [`${req.body.username}`, `${req.body.password}`]);

	let objusuario= await pool.query(`select * from users where $1=username and $2=password`, [`${req.body.username}`, `${req.body.password}`]); 
	//console.log(objusuario.rows[0].users_id); traer valores de usuario 
	//console.log(objusuario.rows); //traer usuario como objeto
	//console.log(objusuario.rows[0].rol); //traer rol


	//console.log(result);
	if (result.rows[0].count > 0) {
		console.log('usuario encontrado');
		// Authenticate the user
		req.session.loggedin = true;
		req.session.username = user;
		// Redirect to home page
		res.render('login',{exitoso:1});
	} else {
		console.log('usuario no encontrado');
		res.render('login',{error:1});
	}

})


router.get('/logout', (req, res) => {
	//console.log(req.session.loggedin);
	req.session.destroy();
	//console.log(req.session.loggedin);
	res.redirect('/');
	user = "";
});

router.get('/admin', (req, res) => {
	if (user == "admin" && req.session.loggedin == true) { res.render('admin', { flag: 1 }) }
	else {
		res.redirect('/')
	}
});

router.get('/register', (req, res) => {
	res.render('register')
});

router.post('/register?', async (req, res) => {
	let rut = req.body.rut;
	let nombre = req.body.nombre;
	let apellido = req.body.apellido;
	let fechanac = req.body.fechanac;
	let direccion = req.body.direccion;
	let telefono1 = req.body.telefono1;
	let telefono2 = req.body.telefono2;
	user = req.body.username;
	let pass = req.body.password;
	let email = req.body.email;


	let result = await pool.query('SELECT * FROM users WHERE $1=username', [user]);
	console.log(result.rowCount);
	if (result.rowCount > 0) {
		res.render('home', { flag: 0, Iniciar: 1 })
	} else {
	console.log('no encuentra usuario, INSERTAR');
	await pool.query(`INSERT INTO pacientes 
	(rut_pacientes,nombre,apellido,fechanac,direccion,telefono1,telefono2,email) 
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
	[`${rut}`,`${nombre}`,`${apellido}`,`${fechanac}`,`${direccion}`,`${telefono1}`,`${telefono2}`,`${email}`]);
	await pool.query(`INSERT INTO users (rut_users,username,password,creado,rol) VALUES ($1,$2,$3,$4,$5)`,
	[`${rut}`,`${user}`,`${pass}`,`now`,`false`]);
	// ejemplo insert pool.query(`INSERT INTO users VALUES (0,'19614018-2','${user}','${pass}','now','false')`)
		res.render('login')
	}
});

export default router;