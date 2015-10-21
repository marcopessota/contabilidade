<?php
	set_time_limit(0);

	$filename = "../rep/diario/diario_1610_2015.txt";

	$f = fopen($filename, "r");
	$preview_lines = array();
	$count_preview_lines = 0;

	if($f) {
		while (($line = fgets($f)) !== false){
			if(!empty($line)){
				$preview_lines[] = utf8_encode($line);
				if($count_preview_lines == 10){
					break;
				}
				$count_preview_lines++;
			}
		}
		fclose($f);
	}
	$retorno = new stdClass();
	$retorno->success = "ok";
	$retorno->error = "no_error";
	$retorno->value = $preview_lines;
	echo json_encode($retorno);
?>