<?php 

set_time_limit(0);

$m = new MongoClient();
$_M = $m->contabilidade; // selectiona o banco

$numero_colunas = 10;

echo is_numeric("21");exit();



$filename = "../rep/diario/diario_linhas.txt";
// if(empty($_GET["n"])){
// 	echo "Digite nome do arquivo";
// }else{
	$f = @fopen($filename, "r");
	$titulos = true;
	$cont_linha = 1;
	if($f) {
	    while (($line = fgets($f)) !== false){
	  //   	$data_linha = get_data_linha($line);
			// $valores = get_debito_credito_linha($line);
			// $debito = $valores[0][0];
			// $credito = $valores[0][1];

			$teste = explode(" - ", $line);
			if(count($teste) > 1){
				print_r($teste[1]);
			}






			// if(!empty($debito) && !empty($credito)){
			// 	echo $cont_linha." - DATA - <b>". $data_linha. "</b> #### DEBITO - <b>". $debito ."</b> #### CREDITO - <b>".$credito."</b><br>";
			// }
			// $cont_linha++;


	  //   	$arr_total = array();
			// $line = explode(";", $line);
			// if($titulos == false){
		 //    	for($cont = 0; $cont <= $numero_colunas; $cont++){
			// 		$arr_total[] = trim(utf8_encode($line[$cont]));
			// 	}
		 //     	$_M->diario_teste->insert($arr_total);
	  //    	}else{
			// 	$titulos = false;
	  //    	}
	    }
		fclose($f);
	}
// }

	// Pega a data da linha no formato dd/mm/YYYY
	function get_data_linha($line){
		$data_linha =  $dateArray = preg_match("/(?:\d{1,2})\/(?:\d{1,2})\/\d{4}/",  $line, $match);
    	if($data_linha == 1){
    		// echo $match[0].PHP_EOL;
    		return $match[0];
    	}
	}

	// Pega a data da linha no formato dd/mm/YYYY
	function get_debito_credito_linha($line){
		$data_linha =  $dateArray = preg_match_all("/[0-9.]*\,[0-9][0-9]/",  $line, $match);
    	if($data_linha == 2){
    		// print_r($match);
    		return $match;
    	}
	}


?>