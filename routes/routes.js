import * as fs from "fs";
import { Router } from "express";
import { escribirArchivo, leerArchivo, alertaSI } from "../utils/handlers.js";
import { send } from "process";
import { time, timeEnd } from "console";
import { Script } from "vm";
import pool from "../server.js";
const router = Router();
let objusuario = "";

//===================GET===================//

router.get('/', (req, res) => {
	if (objusuario == "") {
		res.render('home', { flag: 0, Iniciar: 1, Menu: 0, menuadmin: 0, Registro: 1 })
	} else if (objusuario.rows[0].rol < 1) {
		res.render('home', { flag: 1, Iniciar: 0, Menu: 1, menuadmin: 0, Registro: 0 })
	} else {
		(objusuario.rows[0].rol == 2)
		res.render('home', { flag: 1, Iniciar: 0, Menu: 1, menuadmin: 1, Registro: 0 })
	}
})

router.get('/contacto', (req, res) => {
	if (objusuario == "") {
		res.render('contacto', { flag: 0, Iniciar: 1, Menu: 0, Registro: 1 })
	} else {
		res.render('contacto', { flag: 1, Iniciar: 0, Menu: 1, Registro: 0 });
	}
})

router.get('/login', (req, res) => {
	res.render('login', { Iniciar: 1, Registro: 1 });
});

router.get('/recetario', async (req, res) => {
	// validacion de usuario logeado
	//let receta = await pool.query('SELECT * FROM users WHERE $1=username', [usuario logeado]);
	if (objusuario == "") {
		res.render('home', { flag: 0, Iniciar: 1, Menu: 0, Registro: 1, menuadmin: 0 })
	} else if (objusuario.rows[0].rol < 2) {
		res.render('recetario', { receta: 1, Menu: 1 })
	}
});

router.get('/calendario', async (req, res) => {
	//validacion de usuario logeado
	if (objusuario == "") {
		res.render('home', { flag: 0, Iniciar: 1, Menu: 0, menuadmin: 0 })
	} else if (objusuario.rows[0].rol < 2) {
		res.render('calendario', { Menu: 1 })
	}
});


router.post('/app', async (req, res) => {
	let user = req.body.username;
	let pass = req.body.password;
	//console.log(req.body.email);
	//console.log(req.body.password);
	let result = await pool.query(`select count(*) from users where $1=username and $2=password`, [`${req.body.username}`, `${req.body.password}`]);
	objusuario = await pool.query(`select * from users where $1=username and $2=password`, [`${req.body.username}`, `${req.body.password}`]);
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
		res.render('login', { exitoso: 1, Registro: 1 });
	} else {
		console.log('usuario no encontrado');
		res.render('login', { error: 1 });
	}
});

router.get('/logout', (req, res) => {
	//console.log(req.session.loggedin);
	req.session.destroy();
	//console.log(req.session.loggedin);
	res.redirect('/');
	objusuario = ""
});

router.get('/admin', (req, res) => {
	//console.log(objusuario.rows[0].rol);
	//console.log(req.session.loggedin);
	//cambiar el rol por 0 = paciente , 1 =medico ,2 = admin
	if (objusuario.rows[0].rol == '2' && req.session.loggedin)
		res.render('admin', { flag: 1 })
	else {
		res.redirect('/')
	}
});

router.get('/register', (req, res) => {
	res.render('register', { Registro: 1, Iniciar: 1 })
});

router.post('/register?', async (req, res) => {
	let rut = req.body.rut;
	let nombre = req.body.nombre;
	let apellido = req.body.apellido;
	let fechanac = req.body.fechanac;
	let direccion = req.body.direccion;
	let telefono1 = req.body.telefono1;
	let telefono2 = req.body.telefono2;
	let user = req.body.username;
	let pass = req.body.password;
	let email = req.body.email;

	let result = await pool.query('SELECT * FROM users WHERE $1=username', [user]);
	console.log(result.rowCount);
	if (result.rowCount > 0) {
		res.render('home', { flag: 0, Iniciar: 1, Registro: 1 })
	} else {
		console.log('no encuentra usuario, INSERTAR');
		await pool.query(`INSERT INTO pacientes 
	(rut_pacientes,nombre,apellido,fechanac,direccion,telefono1,telefono2,email) 
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
			[`${rut}`, `${nombre}`, `${apellido}`, `${fechanac}`, `${direccion}`, `${telefono1}`, `${telefono2}`, `${email}`]);
		await pool.query(`INSERT INTO users (rut_users,username,password,creado,rol) 
		VALUES ($1,$2,$3,$4,$5)`,
			[`${rut}`, `${user}`, `${pass}`, `now`, `0`]);
		// ejemplo insert pool.query(`INSERT INTO users VALUES (0,'19614018-2','${user}','${pass}','now','false')`)
		res.render('login');
	}
});

router.get('/registromedico', (req, res) => {
	console.log(req.session.loggedin);
	if (req.session.loggedin) {
		if (objusuario.rows[0].rol == '2') {
			res.render('registromedico')
		} else { res.redirect('/'); }
	}
	else {
		res.redirect('/');
	}
});

router.post('/registromedico', async (req, res) => {
	let rut = req.body.rut;
	let nombre = req.body.nombre;
	let apellido = req.body.apellido;
	let fechanac = req.body.fechanac;
	let direccion = req.body.direccion;
	let telefono1 = req.body.telefono1;
	let telefono2 = req.body.telefono2;
	let user = req.body.username;
	let pass = req.body.password;
	let email = req.body.email;

	let result = await pool.query('SELECT * FROM users WHERE $1=username', [user]);
	console.log(result.rowCount);
	if (result.rowCount > 0) {
		res.render('home', { flag: 0, Iniciar: 1, Registro: 1 })
	} else {
		console.log('no encuentra usuario, INSERTAR');
		await pool.query(`INSERT INTO pacientes 
	(rut_pacientes,nombre,apellido,fechanac,direccion,telefono1,telefono2,email) 
	VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
			[`${rut}`, `${nombre}`, `${apellido}`, `${fechanac}`, `${direccion}`, `${telefono1}`, `${telefono2}`, `${email}`]);
		await pool.query(`INSERT INTO users (rut_users,username,password,creado,rol) 
		VALUES ($1,$2,$3,$4,$5)`,
			[`${rut}`, `${user}`, `${pass}`, `now`, `1`]);
		// ejemplo insert pool.query(`INSERT INTO users VALUES (0,'19614018-2','${user}','${pass}','now','false')`)
		res.render('login')
	}
});

router.get('/medico', async (req, res) => {
	console.log(req.session.loggedin);
	if (req.session.loggedin) {
		if (objusuario.rows[0].rol ==='1' || objusuario.rows[0].rol ==='2') {
			res.render('medico',{datareceta:1})
		} else { res.redirect('/')}
	}
	else {
		res.redirect('/');
	}
})

export default router;