<?php
set_time_limit(0);

$collection = "chart_account";
$tabela = "chart_account";

$time_start = microtime(true);

do_balance_sheet();

$time_end = microtime(true);

$execution_time = ($time_end - $time_start)/60;

echo '<b>Total Execution Time:</b> '.$execution_time.' Mins';

function do_balance_sheet(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
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
		$mongo_obj_chart_account = $_M->chart_account->find();
		$_M->balance_sheet->remove();
		foreach ($mongo_obj_chart_account as $k => $v) {
			$balance_sheet_obj = $_M->trial_balance->aggregate(array(
			array(
				'$project' => array(
				    "account" => 1,
				    "credit" => 1,
				    "debt" => 1,
				    "outstanding_balance" => 1
				)
			),
			array('$match' =>  array('account'=> new MongoRegex("/".$v["account"]."/i"))),
			array('$group' => array('_id' => null,
								'debt_sum' => array('$sum' => '$debt'),
								'credit_sum' => array('$sum' => '$credit'),
								'outstanding_balance_sum' => array('$sum' => '$outstanding_balance')
							    )
			)
			));
			unset($balance_sheet_obj["result"][0]["_id"]);
			$balance_sheet_obj["result"][0]["chart_account"] = $v["account"];
			$balance_sheet_obj["result"][0]["desc_account"] = $v["desc"];
			$balance_sheet_obj["result"][0]["id_diario"] = $id_diario;
			$_M->balance_sheet->insert($balance_sheet_obj["result"][0]);
		}
	}
}

?>