<?php
	require_once("../config.php");

	set_time_limit(0);


	$fields = new StdClass();
	$fields->date = 1;
	$fields->entry = 1;
	$fields->account = 1;
	$fields->debt_account = 1;
	$fields->credit_account = 1;
	$fields->value = 1;
	$fields->debt_value = 1;
	$fields->credit_value = 1;
	$fields->concept = 1;
	$fields->title = 1;
	$fields->doc1 = 1;
	$fields->doc2 = 1;

	$lines_obj_mongo = $_M->diario_teste3->find(array(), $fields);
	$lines = iterator_to_array($lines_obj_mongo, false);
	echo json_encode($lines);
?>