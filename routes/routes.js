import * as fs from "fs";
import { Router } from "express";
import { escribirArchivo, leerArchivo, alertaSI } from "../utils/handlers.js";
import { send } from "process";
import { time, timeEnd } from "console";
import { Script } from "vm";
import pool from "../server.js";
const router = Router();
let user="";

//===================GET===================//

router.get('/', (req, res) => {
	if (user == ""){
		res.render('home',{flag:0,Iniciar:1,menuadmin:0})
	} else if (user != 'admin'){
	res.render('home', {flag:1,Iniciar:0,menuadmin:0} )
} else { (user == 'admin') 
	res.render('home',{flag:1,Iniciar:0,menuadmin:1})
} })

router.get('/contacto', (req, res) => {
	if (user == ""){
		res.render('contacto',{flag:0,Iniciar:1})
	} else {
	res.render('contacto', {flag:1,Iniciar:0} );
}})

router.get('/login', (req, res) => {
	res.render('login');
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
    let result = await pool.query(`select count(*) from pacientes where $1=username and $2=password`, [`${req.body.username}`,`${req.body.password}`]);
    //console.log(result.rows[0].count);
    if (result.rows[0].count > 0) {
        console.log('usuario encontrado');
		// Authenticate the user
		req.session.loggedin = true;
		req.session.username = user;
		// Redirect to home page
		res.render('login1');
    } else { console.log('usuario no encontrado');
	res.render('login2'); }

})


router.get('/logout', (req, res) => {
	//console.log(req.session.loggedin);
	req.session.destroy();
	//console.log(req.session.loggedin);
	res.redirect('/');
	user ="";
});

router.get('/admin', (req, res) => {
	if (user == "admin" && req.session.loggedin == true) 
	{ res.render('admin', {flag:1}) } 
	else {
		res.redirect('/')
	}
});

router.get('/register',(req,res) =>{
	res.render('register')
});

router.post('/register?',(req,res) =>{
	user = req.body.username;
	let pass = req.body.password;
	let email = req.body.email;

	pool.query('SELECT * FROM users WHERE username =?',[user], function (error, results, fields){
		if (error) throw error;
		if (results[0]) {
			console.log(results[0]);
			res.render('home',{flag:0,Iniciar:1})
		}else {
			pool.query(`INSERT INTO users VALUES (0,'${user}','${pass}','${email}')`)
			res.render('login')
		}
		// results.forEach(elem => {
		// 	if (user == elem.username ){
		// 		console.log(elem.username);
		// 		console.log('usuario ya registrado')}
			// } else {
			// 	connection.query(`INSERT INTO accounts VALUES (0,'${user}','${pass}','${email}')`)
			// 	res.render('login')
			// }
		// });
	})

});

export default router;