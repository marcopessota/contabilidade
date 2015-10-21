<?php

error_reporting(0);

function __autoload($class_name) {
    require_once 'lib/classes/' . $class_name . '.php';
}


// REALIZA CONEXÃO COM O BANCO DE DADOS
$m = new MongoClient();
$_M = $m->contabilidade; // selectiona o banco


?>