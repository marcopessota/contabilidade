<?php
set_time_limit(0);
require_once("../config.php");




$collection = "diario_teste3";

$tabela = "diario2";

$time_start = microtime(true);

do_chart_account();

$time_end = microtime(true);

$execution_time = ($time_end - $time_start)/60;

echo '<b>Total Execution Time:</b> '.$execution_time.' Mins';

function do_chart_account(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;

	if(CONNECTOR_DB == "MYSQL"){
		$sql_insert = 'INSERT INTO chart_account VALUES ';
		$result = $_MY->query('SELECT distinct(account), title FROM '.$tabela);
		$cont_insert = 0;
		$id_diario = 1;
		while($row = $result->fetch_assoc()){
			$cont_insert++;
			if($cont_insert > 5000){
				$sql_insert .= '(null, '.$id_diario.', "'.$row["account"].'", "'.(utf8_decode($row["title"]) ).'")';
				$_MY->query($sql_insert);
				$cont_insert = 0;
				$sql_insert = 'INSERT INTO chart_account VALUES ';
			}else{
				$sql_insert .= '(null, '.$id_diario.', "'.$row["account"].'", "'.(utf8_decode($row["title"]) ).'"),';
			}
		}
		if($cont_insert > 0){
			$_MY->query(rtrim($sql_insert, ","));
		}
	}elseif(CONNECTOR_DB == "MONGODB"){
		$mongo_obj = $_M->$collection->aggregate(array(
			array(
			'$project' => array(
			    "account" => 1,
			    "title" => 1
			)
			),
			array('$group' => array('_id' => array('account' => '$account', 'title' => '$title')))
		));
		// print_r($mongo_obj["result"]);exit;
		foreach ($mongo_obj["result"] as $k_obj => $v_obj) {
			$insert_obj = new stdClass();
			$insert_obj->id_diario = 1;
			$insert_obj->account = $v_obj["_id"]["account"];
			$insert_obj->desc = $v_obj["_id"]["title"];
			$_M->chart_account->insert($insert_obj);
			unset($mongo_obj["result"][$k_obj]);
		}
	}
}

?>