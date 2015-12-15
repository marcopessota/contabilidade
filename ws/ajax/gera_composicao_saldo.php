<?php

	set_time_limit(0);
	$return = new StdClass();
	$arr_qry = array();
	$accounts = array();
	$oks = array();
	$outstanding = array();

	foreach($post["rows"] as $k => $v){
		if(!empty($v)){
			$arr_qry[] = array('_id' => new Mongoid($k));
		}
	}

	$balances = $_M->trial_balance->find(array('$or' => $arr_qry));

	foreach ($balances as $k_balance => $v_balance) {
		$accounts[] = array('account' => $v_balance["account"]);
	}

	$entrys = $_M->diario_teste5->find(array('$or' => $accounts));
	$entrys_obj = iterator_to_array($entrys, false);
	// $a = $entrys_obj;
	generate(0, $entrys_obj);
	$return->data_entrys = $entrys_obj;
	$return->data_oks = $oks;


	function generate(){
		global $oks;
		global $entrys_obj;
		// echo count($entrys_obj).PHP_EOL;
		foreach ($entrys_obj as $k_entry => $v_entry) {
			if($v_entry["debt_value"] != 0){
				$result = array_keys(array_column($entrys_obj, 'credit_value'), $v_entry["debt_value"]);
				if(!empty($result)){

					if(!empty($entrys_obj[$k_entry])){
						$oks[] = $entrys_obj[$k_entry];
					}

					if(!empty($entrys_obj[$result[0]])){
						$oks[] = $entrys_obj[$result[0]];
						// echo $k_entry." - ".$result[0].PHP_EOL;
					}
					unset($entrys_obj[$k_entry], $entrys_obj[$result[0]]);
					$entrys_obj = array_values($entrys_obj);
					generate();
				}
			}
		}
	}




	echo json_encode($return);
?>