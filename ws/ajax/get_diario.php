<?php
	require_once("../config.php");

	set_time_limit(0);


	// $fields = new 

	$lines_obj_mongo = $_M->diario_teste3->find(array(), array('_id' => 'false'));
	$lines = iterator_to_array($lines_obj_mongo, false);
	echo json_encode($lines);
?>