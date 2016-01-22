<?php
	set_time_limit(0);
	$return = new stdClass();

	$filename = "../rep/diario/sped1.txt";

	$original_extension = (false === $pos = strrpos($filename, '.')) ? '' : substr($filename, $pos);

	$f = fopen($filename, "r");
	$columns = array();

	if($f){
		while (($line = fgets($f)) !== false){
			if(!empty($line)){
				$line = trim($line);
				$columns = explode("|", $line);
				if(sped_validation($line)){
					if(main($line) == "error"){
						$return->success = "error";
						$return->error = "insert_DB";
						$return->value = array();
						echo json_encode($return);
						exit();
					}
				}
			}
		}
		if($cont_insert > 0){
			try{
				$_M->sped_teste3->batchInsert($obj_insert);
			}catch(Exception $e){
				echo "ERRO".PHP_EOL;
				$cont_erro++;
			}
			$cont_insert = 0;
			$obj_insert = [];
		}
		$return->count = $cont_erro;
		$return->success = "success";
		$return->error = "no_error";
		$return->value = array();
		fclose($f);

	}else{
		$return->success = "error";
		$return->error = "file_open";
		$return->value = array();
	}
	echo json_encode($return);

	function sped_validation($line){
		global $columns;
		return $columns[1] == "I250";
	}
	$cont_erro = 0;
	$cont_insert = 0;
	$obj_insert = [];
	function main($line){
		global $columns;
		global $_M;
		global $cont_erro;
		global $cont_insert;
		global $obj_insert;

		$final_obj = new stdClass();
		$final_obj->accountt = $columns[2];
		$final_obj->cost_center = $columns[3];
		$final_obj->value = $columns[4];
		$final_obj->value_type = $columns[5];
		$final_obj->file_num = utf8_encode($columns[6]);
		$final_obj->hist_cod = $columns[7];
		$final_obj->hist = utf8_encode($columns[8]);
		$final_obj->participation_cod = $columns[9];


		$obj_insert[] = $final_obj;
		$cont_insert++;
		if($cont_insert == 20000){
			try{
				$_M->sped_teste3->batchInsert($obj_insert);
			}catch(Exception $e){
				// print_r($e);
				// exit();
				echo "ERRO".PHP_EOL;
				$cont_erro++;
			}
			$cont_insert = 0;
			$obj_insert = [];
			// echo "Hello everybody!";
			
		}

		// if($final_obj->_id){
		// 	return "success";
		// }else{
		// 	return "error";
		// }
	}
?>