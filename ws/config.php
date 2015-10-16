<?php 
	
	function __autoload($class_name) {
	    require_once 'lib/classes/' . $class_name . '.php';
	}

?>