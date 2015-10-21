<?php
	set_time_limit(0);
	$return = new stdClass();
	// print_r($post);exit;
	$filename = "../rep/diario/diario_1610_2015.txt";

	$f = fopen($filename, "r");
	$preview_lines = array();
	$count_preview_lines = 0;
	$date_start_position = NULL;
	$date_end_position = NULL;

	$cc_start_position = NULL;
	$cc_end_position = NULL;
	$cc_digits = NULL;

	$side_debt = "";


	$final_obj = array();
	$cont_obj = 0;


	if($f) {
		if($post["preview"] == true){
			while (($line = fgets($f)) !== false){
				$line = trim($line);
				if(!empty($line)){
					$preview_lines[] = utf8_encode($line);
					if($count_preview_lines == 10){
						break;
					}
					$count_preview_lines++;
				}
			}
		}else{
			do_process();
			while (($line = fgets($f)) !== false){
				$line = trim($line);
				if(!empty($line)){
					$final_obj = new stdClass();
					$date_match = get_date_line($line);
					$final_obj->date = $date_match[0];
					$account_match = get_numero_conta($line);
					$final_obj->account = $account_match[0];
					$values = get_debito_credito_linha($line);
					if($side_debt == "left"){
						$final_obj->debt = $values[0][0][0];
						$final_obj->credit = $values[0][1][0];
					}else{
						$final_obj->credit = $values[0][0][0];
						$final_obj->debt = $values[0][1][0];
					}

					$count_remove = 0;
					$arr_position_matchs = array();
					$arr_position_matchs[$date_match[1]] = strlen($date_match[0]);
					$arr_position_matchs[$values[0][0][1]] = strlen($values[0][0][0]);
					$arr_position_matchs[$values[0][1][1]] = strlen($values[0][1][0]);

					ksort($arr_position_matchs);
					$concept = $line;
					foreach($arr_position_matchs as $k_item => $v_item){
						$concept = substr_replace($concept, '', $k_item - $count_remove, $v_item + $k_item);
						$count_remove += $v_item;
					}
					$concept = trim(str_replace($account_match[0], '', $concept));
					$final_obj->concept = utf8_encode($concept);
					$cont_obj++;
					// $aaa->b = "aaa";$_M->diario_teste->insert($aaa);exit();
					// $_M->diario_teste->insert($final_obj);
					// exit();
					if($cont_obj == 20){
						echo $line . PHP_EOL . $concept. PHP_EOL ;
					// 	print_r($final_obj);
						exit();
					}
				}
			}
			// do_process();
			// while (($line = fgets($f)) !== false){
			// 	$line = trim($line);
			// 	if(!empty($line)){
			// 		$final_obj[$cont_obj] = new stdClass();
			// 		$date_match = get_date_line($line);
			// 		$final_obj[$cont_obj]->date = $date_match[0];
			// 		$account_match = get_numero_conta($line);
			// 		$final_obj[$cont_obj]->account = $account_match[0];
			// 		$values = get_debito_credito_linha($line);
			// 		if($side_debt == "left"){
			// 			$final_obj[$cont_obj]->debt = $values[0][0][0];
			// 			$final_obj[$cont_obj]->credit = $values[0][1][0];
			// 		}else{
			// 			$final_obj[$cont_obj]->credit = $values[0][0][0];
			// 			$final_obj[$cont_obj]->debt = $values[0][1][0];
			// 		}

			// 		$count_remove = 0;
			// 		$arr_position_matchs = array();
			// 		$arr_position_matchs[$date_match[1]] = strlen($date_match[0]);
			// 		$arr_position_matchs[$values[0][0][1]] = strlen($values[0][0][0]);
			// 		$arr_position_matchs[$values[0][1][1]] = strlen($values[0][1][0]);

			// 		ksort($arr_position_matchs);
			// 		$concept = $line;
			// 		foreach($arr_position_matchs as $k_item => $v_item){
			// 			$concept = substr_replace($concept, '', $k_item - $count_remove, $v_item + $k_item);
			// 			$count_remove += $v_item;
			// 		}
			// 		$concept = str_replace($account_match[0], '', $concept);
			// 		$final_obj[$cont_obj]->concept = trim($concept);
			// 		$cont_obj++;
			// 		$_M->diario_teste->insert($arr_total);

			// 		// if($cont_obj == 20){
			// 		// 	print_r($final_obj);
			// 		// 	exit();
			// 		// }
			// 	}
			// }
		}
		fclose($f);
		$return->success = "ok";
		$return->error = "no_error";
		$return->value = $preview_lines;
	}else{
		$return->success = "error";
		$return->error = "file_open";
		$return->value = array();
	}
	echo json_encode($return);

	// Applies decisions by user's answers
	function do_process(){
		global $post;
		global $date_start_position;
		global $date_end_position;
		global $cc_start_position;
		global $cc_end_position;
		global $cc_digits;
		global $side_debt;

		$answers = $post["answers"];
		if($answers["question1.1"] == "yes"){
			if($answers["question1.1.1"]["positions"][0]["start"] == $answers["question1.1.1"]["positions"][1]["start"] &&
				$answers["question1.1.1"]["positions"][0]["start"] == $answers["question1.1.1"]["positions"][2]["start"] &&
				$answers["question1.1.1"]["positions"][1]["start"] == $answers["question1.1.1"]["positions"][2]["start"]){
				$date_start_position = $answers["question1.1.1"]["positions"][0]["start"];
				$date_end_position = ($answers["question1.1.1"]["positions"][0]["end"] - $answers["question1.1.1"]["positions"][0]["start"]) + 10;
			}
		}else{
			if($answers["question1.2"] == "above"){
				$date_start_position = 0;
				$date_end_position = -1;
			}

		}

		if($answers["question2.1"]["positions"][0]["start"] == $answers["question2.1"]["positions"][1]["start"] &&
			$answers["question2.1"]["positions"][0]["start"] == $answers["question2.1"]["positions"][2]["start"] &&
			$answers["question2.1"]["positions"][1]["start"] == $answers["question2.1"]["positions"][2]["start"]){
			$cc_start_position = $answers["question2.1"]["positions"][0]["start"];
			$cc_end_position = ($answers["question2.1"]["positions"][0]["end"] - $answers["question2.1"]["positions"][0]["start"]);
			$cc_digits = strlen(trim($answers["question2.1"]["selections"][0]));
		}

		if($answers["question3.1"]["positions"][0]["start"] < $answers["question4.1"]["positions"][1]["start"]){
			$side_debt = "left";
		}else{
			$side_debt = "right";
		}
	}

	function get_date_line($line){
		global $date_start_position;
		global $date_end_position;
		if($date_end_position = -1){
			$string_line = substr($line, $date_start_position);
		}else{
			$string_line = substr($line, $date_start_position, $date_end_position);
		}
		$count_matchs = preg_match("/(?:\d{1,2})\/(?:\d{1,2})\/\d{4}/", $string_line, $match, PREG_OFFSET_CAPTURE);
    	if($count_matchs == 1){
    		return $match[0];
    	}else{
    		return null;
    	}
	}

	function get_numero_conta($line){
		global $cc_start_position;
		global $cc_end_position;
		global $cc_digits;
		$string_line = substr($line, ($cc_start_position - $cc_start_position / 2), $cc_end_position + 20);
		$count_matchs = preg_match_all("/(?<!\B)[0-9]{".$cc_digits."}(?!\B)/", $string_line, $match, PREG_OFFSET_CAPTURE);
    	if($count_matchs = 2){
    		return $match[0][0];
    	}else{
			return null;
		}
	}

	function get_debito_credito_linha($line){
		$count_matchs = preg_match_all("/[0-9.]*\,[0-9][0-9]/",  $line, $match, PREG_OFFSET_CAPTURE);
    	if($count_matchs > 0){
    		return $match;
    	}else{
    		return null;
    	}
	}
?>