
CREATE DATABASE dbportafoliopost;



CREATE TABLE pacientes (
        pacientes_id serial PRIMARY KEY NOT NULL,
        rut_pacientes VARCHAR (50) UNIQUE NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        fechanac DATE NOT NULL,
        direccion VARCHAR(70) NOT NULL,
        telefono1 VARCHAR NOT NULL,
        telefono2 VARCHAR,
        email VARCHAR (30) NOT NULL
    );

CREATE TABLE
    users (
        users_id serial PRIMARY KEY NOT NULL,
        rut_users VARCHAR(50) NOT NULL,
        username VARCHAR (50) NOT NULL,
        password VARCHAR (50) NOT NULL,
        creado TIMESTAMP NOT NULL,
        rol VARCHAR NOT NULL
    );

ALTER TABLE users
ADD CONSTRAINT fk_pacientes_users_rut FOREIGN KEY (rut_users) REFERENCES pacientes(rut_pacientes);

CREATE TABLE recetas (
    recetas_id Serial Primary Key NOT NULL,
    rut_paciente_recetas VARCHAR(50) NOT NULL,
    rut_medico VARCHAR(50) NOT NULL,
    nombre_medico VARCHAR(50) NOT NULL,
    especialidad_medico VARCHAR(50) NOT NULL,
    fechaEmision Timestamp NOT NULL,
    vigente BOOLEAN NOT NULL
);

ALTER TABLE recetas ADD CONSTRAINT fk_paciente_recetas_rut FOREIGN KEY (rut_paciente_recetas) REFERENCES pacientes(rut_pacientes);

CREATE TABLE receta_detalle (
    receta_detalle_id SERIAL PRIMARY KEY NOT NULL,
    recetas_id_detalle INTEGER NOT NULL,
    medicamento VARCHAR NOT NULL,
    id_medicamento_detalle INTEGER NOT NULL,
    prescripcion VARCHAR NOT NULL
);


CREATE TABLE lista_medicamento(
    id_medicamento SERIAL PRIMARY KEY NOT NULL,
    id_nombre_medicamento VARCHAR NOT NULL,
    id_contenido VARCHAR NOT NULL
);

ALTER TABLE receta_detalle ADD CONSTRAINT fk_receta_recetadetalle FOREIGN KEY (recetas_id_detalle) REFERENCES recetas(recetas_id);
ALTER TABLE receta_detalle ADD CONSTRAINT fk_receta_listamedicamento FOREIGN KEY (id_medicamento_detalle) REFERENCES lista_medicamento(id_medicamento);

INSERT INTO pacientes (rut_pacientes,nombre,apellido,fechanac,direccion,telefono1,telefono2,email) 
VALUES ('19614018-2','Fernando','Perez','24-10-1997','Casa1','962652710','0','fernandoperezverdejo@gmail.com');

INSERT INTO users (rut_users,username,password,creado,rol) 
VALUES ('19614018-2','admin','1234','now',2);