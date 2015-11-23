	<?php
	require_once("../config.php");

	set_time_limit(0);


	$fields = new StdClass();
	$fields->id_diario = 1;
	$fields->account = 1;
	$fields->debt = 1;
	$fields->credit = 1;
	$fields->outstanding_balance = 1;

	$lines_obj_mongo = $_M->trial_balance->find(array(), $fields);
	$lines = iterator_to_array($lines_obj_mongo, false);
	echo json_encode($lines);
?>