import { Router } from "express";
import pool from "../server.js";
const router = Router();
let objusuario = "";
let datareceta = "";

//===================GET===================//

router.get('/', (req, res) => {
	if (objusuario == "") {
		res.render('home', { flag: 0, Iniciar: 1, Menu: 0, menuadmin: 0, Registro: 1 })
	} else if (objusuario.rows[0].rol == '0') {
		res.render('home', { flag: 1, Iniciar: 0, Menu: 1, menuadmin: 0, Registro: 0 })
	} else if (objusuario.rows[0].rol == '1') {
		res.render('home', { flag: 1, Iniciar: 0, Menu: 1, menuadmin: 0, Registro: 0, Medico: 1 })
	} else {
		(objusuario.rows[0].rol == '2')
		res.render('home', { flag: 1, Iniciar: 0, Menu: 1, menuadmin: 1, Registro: 0, Medico: 1 })
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
		//console.log('usuario encontrado');
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
		//console.log('no encuentra usuario');
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
	//console.log(req.session.loggedin);
	//console.log(objusuario.rows[0]);
	if (req.session.loggedin) {
		if (objusuario.rows[0].rol === '1' || objusuario.rows[0].rol === '2') {
			res.render('medico', { datareceta, btnanadir: 0, Medico: 1 })
		} else { res.redirect('/') }
	}
	else {
		res.redirect('/');
	}
})

router.post('/buscarpaciente/', async (req, res) => {
	let result = await pool.query('SELECT * FROM pacientes where $1=rut_pacientes', [`${req.body.rut}`]);
	if (result.rows == []) {
		console.log('error');
	} else {
		datareceta = result.rows[0];
		//console.log(datareceta);
		//console.log(datareceta[0].rut_pacientes);
		//console.log(datareceta[0].nombre);
		let buscarmedicamentos = await pool.query('SELECT id_nombre_medicamento,id_contenido FROM lista_medicamento');
		let medicamentos = buscarmedicamentos.rows;
		//console.log(medicamentos);
		res.render('medico', { datareceta, btnanadir: 1, Medico: 1, medicamentos })
	}
});

router.post('/buscarreceta/', async (req, res) => {
	let rut = req.body.rut;
	//console.log('pasa');
	//console.log(rut); //ya se muestra bien el rut
	let result = await pool.query('SELECT count(*) FROM recetas where rut_paciente_recetas=$1', [rut]);
	if (result.rows[0].count == 0) {
		res.render('medico', { receta: "no hay receta(s) disponibles" })
	} else {
		//mostrar recetas
		//let resultadoreceta = await pool.query('SELECT * FROM recetas where rut_paciente_recetas=$1', [rut]);

		//let resultadoreceta1 = resultadoreceta.rows;
		// receta detalle
		//let res1=[];
		// await Promise.all(resultadoreceta1.map(async(e)=>{
		// 	const res =await pool.query('SELECT * FROM receta_detalle where recetas_id_detalle=$1',[e.recetas_id]);
		// 	res1.push(res.rows)
		// }));
		// res1.forEach(element => {
		// 	console.log(element);
		// });
		// let resultadorecetadetalle = res1.rows;
		let medicinas0 = await pool.query('SELECT * FROM lista_medicamento');
		let medicinas = medicinas0.rows;

		let resultadoreceta = await pool.query(`
		SELECT 
		* 
		FROM recetas a 
			INNER JOIN receta_detalle b ON a.recetas_id = b.recetas_id_detalle 
			INNER JOIN lista_medicamento c ON c.id_medicamento = b.id_medicamento_detalle
		WHERE a.rut_paciente_recetas=$1 ORDER BY fechaemision ASC`,[rut]);

		//foreach para cambiar estado true o false a vigente o no vigente
		resultadoreceta.rows.forEach(element => {
			if (element.vigente == true) {
				element.vigente = "Vigente";
			} else element.vigente = "No Vigente"
		});

		let resultadoreceta1= resultadoreceta.rows;
		console.log(resultadoreceta1);

		res.render('medico', { receta: "Esta(s) son las recetas disponibles", resultadoreceta1,medicinas})
	}
});

router.post('/anadirreceta/', async (req, res) => {
	let rutpaciente = req.body.rutpaciente;
	let rutmedico = req.body.rutmedico;
	let nommedico = req.body.nombremedico;
	let especialidad = req.body.especialidadmedico;
	let medicamento0 = req.body.medicamento;
	let prescripcion = req.body.prescripcion;
	let result = await pool.query(`INSERT INTO recetas (rut_paciente_recetas,rut_medico,nombre_medico,especialidad_medico,fechaemision,vigente) VALUES ($1,$2,$3,$4,$5,$6)`, [rutpaciente, rutmedico, nommedico, especialidad, 'now', 'true']);
	let idreceta = await pool.query('SELECT count(*) FROM recetas where rut_paciente_recetas=$1', [rutpaciente]);
	//console.log(idreceta.rows[0].count); buscar el id_receta
	let medicamento = await pool.query('SELECT id_medicamento FROM lista_medicamento where id_nombre_medicamento=$1', [medicamento0]);
	//console.log(medicamento.rows[0].id_medicamento); buscar el id del medicamento
	let result2 = await pool.query('INSERT INTO receta_detalle (recetas_id_detalle,medicamento,id_medicamento_detalle,prescripcion) VALUES ($1,$2,$3,$4)', [idreceta.rows[0].count,medicamento0, medicamento.rows[0].id_medicamento, prescripcion]);
	res.render('medico', { message: "Receta Añadida Exitosamente" });
});

router.post('/modificar/', async (req, res) => {
	let id = req.body.id; // id de la receta
	let prescripcion = req.body.prescripcion;
	let medicamento = req.body.medicamento;

	//rescata el id mediante el nombre
	let resultmedicamento = await pool.query('SELECT * FROM lista_medicamento where $1=id_nombre_medicamento',[medicamento]);
	let result=await pool.query(`UPDATE receta_detalle SET medicamento=$1,id_medicamento_detalle=$2,prescripcion=$3 WHERE recetas_id_detalle=${id}`,[medicamento,resultmedicamento.rows[0].id_medicamento, prescripcion]);
	res.render('medico',{message:"Receta Modificada con exito"})
});

router.post('/eliminar/', async (req, res) => {
	let id = req.body.id; //id de receta
	//console.log(id);
	// eliminar receta_detalle
	let result = await pool.query('DELETE FROM receta_detalle WHERE recetas_id_detalle=$1',[id]);
	// eliminar recetas
	let result1= await pool.query('DELETE FROM recetas WHERE recetas_id=$1',[id]);

	res.render('medico',{message:"Receta Eliminada con exito"})

});

router.post('/anadirmedicamento/', async (req, res) => {
	let nombre = req.body.name;
	let contenido = req.body.content;
	let result = await pool.query('INSERT INTO lista_medicamento (id_nombre_medicamento,id_contenido) 	VALUES ($1,$2)', [nombre, contenido])
	res.render('medico', { message: "Medicamento Añadido Exitosamente" })
});

export default router;