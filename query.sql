-- Active: 1679928031758@@127.0.0.1@3306@dbportafolio
CREATE DATABASE
    IF NOT EXISTS `dbportafolio` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `dbportafolio`;

CREATE TABLE
    IF NOT EXISTS `accounts` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `username` varchar(50) NOT NULL,
        `password` varchar(255) NOT NULL,
        `email` varchar(100) NOT NULL,
        PRIMARY KEY (`id`)
    ) ENGINE = InnoDB AUTO_INCREMENT = 2 DEFAULT CHARSET = utf8;

INSERT INTO
    `accounts` (
        `id`,
        `username`,
        `password`,
        `email`
    )
VALUES (
        1,
        'admin',
        '1234',
        'admin@test.com'
    );

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Yuseiwheel2021';

INSERT INTO `accounts` (`id`,`username`,`password`,`email`)
VALUES (2,'bryan','1234','bryan@test.com');