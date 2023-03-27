import * as fs from "fs";
import { Router } from "express";
import { escribirArchivo, leerArchivo ,alertaSI } from "../utils/handlers.js";
import { send } from "process";
import { time, timeEnd } from "console";
import { Script } from "vm";
import connection from "../server.js";
const router = Router();

//===================GET===================//

router.get('/', (req, res) => {
    res.render('home');
})

router.get('/contacto', (req, res) => {
    res.render('contacto');
})

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
router.post('/app', function(request, response) {
	// Capture the input fields
	let user = request.body.username;
	let pass = request.body.password;
	// Ensure the input fields exists and are not empty
	if (user && pass) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [user, pass], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = user;
				// Redirect to home page
				response.render('login1');
			} else {
				response.render('login2');
			}

			//response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}

});
export default router;