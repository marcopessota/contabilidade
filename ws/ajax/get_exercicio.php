<?php
set_time_limit(0);

$collection = "exercicio";

$tabela = "exercicio";

// $time_start = microtime(true);


// $time_end = microtime(true);

// $execution_time = ($time_end - $time_start)/60;

// echo '<b>Total Execution Time:</b> '.$execution_time.' Mins';

echo json_encode(get_exercicio());

function get_exercicio(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;

	if(CONNECTOR_DB == "MYSQL"){
		$result_obj = $_MY->query('SELECT * FROM '.$tabela);
		$result = array();
		while ($row = $result_obj->fetch_object()) {
			$row->desc = utf8_encode($row->desc);
			$result[] = $row;
		}
	}elseif(CONNECTOR_DB == "MONGODB"){
		$result = iterator_to_array($_M->$collection->find(), false);
	}
	return $result;
}

?>