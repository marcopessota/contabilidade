	<?php
	// require_once("../config.php");

	set_time_limit(0);
	$return = new StdClass();

	if(CONNECTOR_DB == "MYSQL"){
		$sql_insert = 'INSERT INTO trial_balance VALUES ';
		$result = $_MY->query('SELECT account, SUM(credit) as credit_sum, SUM(debt) as debt_sum FROM '.$tabela.' group by account');
		$cont_insert = 0;
		$id_diario = 1;
		while($row = $result->fetch_assoc()){
			$cont_insert++;
			if($cont_insert > 5000){
				$sql_insert .= '(null, "'.$row["account"].'", '.($row["debt_sum"] - $row["credit_sum"]).', '.$row["debt_sum"].', '.$row["credit_sum"].', '.$id_diario.' )';
				$_MY->query($sql_insert);
				$cont_insert = 0;
				$sql_insert = 'INSERT INTO trial_balance VALUES ';
			}else{
				$sql_insert .= '(null, "'.$row["account"].'", '.($row["debt_sum"] - $row["credit_sum"]).', '.$row["debt_sum"].', '.$row["credit_sum"].', '.$id_diario.' ),';
			}
		}
		if($cont_insert > 0){
			$_MY->query(rtrim($sql_insert, ","));
		}
	}elseif(CONNECTOR_DB == "MONGODB"){
		$return->data = iterator_to_array($_M->balance_sheet->find(array(), array('outstanding_balance_sum' => 1, "desc_account" => 1, "chart_account" => 1))->sort(array("desc_account" => 1)), false);
		$return->success = "ok";
		$return->error = "no_error";
	}


	echo json_encode($return);
?>