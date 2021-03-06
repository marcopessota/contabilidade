<?php

//error_reporting(0);
error_reporting(E_PARSE);
function __autoload($class_name) {
    // require_once 'lib/classes/' . strtolower($class_name) . '.php';
    $filename = 'lib/classes/' . strtolower($class_name) . '.php';
	if(file_exists($filename)){
    	require_once $filename;
    }
}


// CONSTANTES

// define("CONNECTOR_DB", "MYSQL");
define("CONNECTOR_DB", "MONGODB");

define("SERVER_MYSQL", "localhost");
define("USER_MYSQL", "root");
define("PASSWORD_MYSQL", "");
define("DATABASE_MYSQL", "test");

// define("SERVER_MONGODB", "127.0.0.1");
// define("USER_MONGODB", "");
// define("PASSWORD_MONGODB", "");
// define("DATABASE_MONGODB", "contabilidade");


// $_MY = new Mysql(SERVER_MYSQL, USER_MYSQL, PASSWORD_MYSQL, DATABASE_MYSQL);
// $_MY = new mysqli(SERVER_MYSQL, USER_MYSQL, PASSWORD_MYSQL, DATABASE_MYSQL);
// if (mysqli_connect_errno()) {
//     printf("Connect failed: %s\n", mysqli_connect_error());
//     exit();
// }

// REALIZA CONEXÃO COM O BANCO DE DADOS
$m = new MongoClient();
$_M = $m->contabilidade; // selectiona o banco
MongoCursor::$timeout = -1;

?>