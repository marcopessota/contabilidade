<?php
// $time_start = microtime(true);
error_reporting(0);
set_time_limit(0);

$m = new MongoClient();
$_M = $m->contabilidade; // selectiona o banco

exit();
$numero_colunas = 10;

// echo is_numeric("21");exit();

$nome_cmapos = array("lancamento", "anotacao", "conceito", "data", "conta", "numero_doc_1", "numero_doc_2", "debito", "credito");

$filename = "../rep/diario/diario_1610_2015.txt";
// if(empty($_GET["n"])){
//  echo "Digite nome do arquivo";
// }else{
	$f = @fopen($filename, "r");

	// echo $filename;

	$titulos = true;
	$cont_linha = 0;


	$objetao = array();
	$objetao[$cont_linha] = new stdClass();
	if($f) {
		while (($line = fgets($f)) !== false){
			if(!empty($line)){
				// echo $line.PHP_EOL;exit();
				// $data = get_data_linha($line);
				$debito_credito = get_debito_credito_linha($line);
				$debito = $debito_credito[0][0];
				$credito = $debito_credito[0][1];
				// $conta = get_anotacao($line);
				print_r($debito_credito);

				// echo $data.PHP_EOL; 
			}
		}
		fclose($f);
	}
	$time_end = microtime(true);

//dividing with 60 will give the execution time in minutes other wise seconds
// $execution_time = date("H:i:s", $time_end-$time_start);
//execution time of the script
// echo '<b>Total Execution Time:</b> '.$execution_time.' Mins';
// }

	// Pega a data da linha no formato dd/mm/YYYY
	function get_data_linha($line){
		$data_linha =  $dateArray = preg_match("/(?:\d{1,2})\/(?:\d{1,2})\/\d{4}/",  $line, $match);
		if($data_linha == 1){
			// print_r($match);
			return $match[0];
		}else{
			return null;
		}
	}

	function get_debito_credito_linha($line){
		$data_linha =  $dateArray = preg_match_all("/-?[0-9.]*\,[0-9][0-9]/",  $line, $match);
		if($data_linha > 0){
			return $match;
		}else{
			return null;
		}
	}

	// Pega numero da conta
	function get_numero_conta($line){
		$str_explode = explode(" - ", $line);
		if(count($str_explode) > 1){
			$data_linha = $dateArray = preg_match_all("/[0-9]*$/", $str_explode[0], $match);
			if($data_linha = 2){
				return $match[0][0];
			}else{
				return null;
			}
		}else{
			return null;
		}
	}

	function get_lancamento($line){
		$data_linha = $dateArray = preg_match("/^[0-9.]*/", $line, $match);
		if($data_linha > 0){
			return $match[0];
		}else{
			return null;
		}
	}

	function get_anotacao($line){
		$data_linha = $dateArray = preg_match_all("/[0-9.]*/", $line, $match);
		print_r($match);exit;
		if(!empty($match[0][6])){
			return $match[0][6];
		}else{
			return null;
		}
	}

	function get_conceito($line){
		$str_explode = explode("Conceito:", $line);
		if(count($str_explode) > 1){
			return trim($str_explode[1]);
		}else{
			return null;
		}
	}

?>