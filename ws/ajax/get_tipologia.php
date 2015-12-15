<?php
set_time_limit(0);

$collection = "chart_account";
$tabela = "chart_account";

// $time_start = microtime(true);

do_balance_sheet();

// $time_end = microtime(true);

// $execution_time = ($time_end - $time_start)/60;

// echo '<b>Total Execution Time:</b> '.$execution_time.' Mins';

function do_balance_sheet(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
	global $post;
	$id_diario = 1;

	if(CONNECTOR_DB == "MYSQL"){
		$sql_insert = 'INSERT INTO balance_sheet VALUES ';
		$obj = $_MY->query('SELECT * FROM chart_account');
		$_MY->query('DELETE FROM balance_sheet');

		$result = array();
		while ($row = $obj->fetch_object()) {
			$obj_sum = $_MY->query('SELECT account, SUM(credit) as credit_sum, SUM(debt) as debt_sum, SUM(outstanding_balance) as outstanding_balance_sum FROM trial_balance where account like "'.$row->account.'%"');
			$obj_sum = $obj_sum->fetch_object();
				$cont_insert++;
				if($cont_insert > 5000){
					$sql_insert .= '(null, '.$obj_sum->debt_sum.', '.$obj_sum->credit_sum.', '.($obj_sum->outstanding_balance_sum).' , "'.$row->account.'", '.$id_diario.' )';
					$_MY->query($sql_insert);
					$cont_insert = 0;
					$sql_insert = 'INSERT INTO balance_sheet VALUES ';
				}else{
					$sql_insert .= '(null, '.$obj_sum->debt_sum.', '.$obj_sum->credit_sum.', '.($obj_sum->outstanding_balance_sum).' , "'.$row->account.'", '.$id_diario.' ),';
				}

			$result[] = $row;
		}

		if($cont_insert > 0){
			$_MY->query(rtrim($sql_insert, ","));
		}
	}elseif(CONNECTOR_DB == "MONGODB"){
		$balance_sheet = array();

		$balance_sheet_obj = $_M->diario_teste5->aggregate(array(
		array(
			'$project' => array(
				'month' => array('$month' => '$ts'),
				'year' => array('$year' => '$ts'),
			    "account" => 1,
			    "credit_value" => 1,
			    "debt_value" => 1
			)
		),
		array('$match' =>  array('account'=> new MongoRegex("/^".$post["digits"]."/i"))),
		array('$group' => array('_id' => array('mouth' => '$month', 'account'=> '$account'),
							'debt_sum' => array('$sum' => '$debt_value'),
							'credit_sum' => array('$sum' => '$credit_value'),
							'year' => array('$first' => '$year'),
						    )
		)
		));
		// print_r($balance_sheet_obj);

		$obj_result = array();
		$cont = 0;
		foreach ($balance_sheet_obj["result"]  as $key => $value) {
			if(!empty($value["_id"])){
				$obj_result[$cont]->account = $value["_id"]["account"];
				$obj_result[$cont]->date = $value["_id"]["mouth"]."/".$value["year"];
				$obj_result[$cont]->debt_sum = $value["debt_sum"];
				$obj_result[$cont]->credit_sum = $value["credit_sum"];
				$obj_result[$cont]->outstanding_balance_sum = $value["debt_sum"] - $value["credit_sum"];
				$cont++;
			}
		}
		$return->success = "ok";
		$return->error = "no_error";
		$return->data = $obj_result;
	}
	echo json_encode($return);
}

?>