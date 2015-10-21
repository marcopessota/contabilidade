<?php 
$time_start = microtime(true); 
error_reporting(0);
set_time_limit(0);

$m = new MongoClient();
$_M = $m->contabilidade; // selectiona o banco

$numero_colunas = 10;

// echo is_numeric("21");exit();

$nome_cmapos = array("lancamento", "anotacao", "conceito", "data", "conta", "numero_doc_1", "numero_doc_2", "debito", "credito");

$filename = "../rep/diario/diario_linhas.txt";
// if(empty($_GET["n"])){
// 	echo "Digite nome do arquivo";
// }else{
	$f = @fopen($filename, "r");
	$titulos = true;
	$cont_linha = 0;


	$objetao = array();
	$objetao[$cont_linha] = new stdClass();
	if($f) {
	    while (($line = fgets($f)) !== false){
	    	if(!empty($line)){
	    		// echo trim($line).PHP_EOL;
		    	if(empty($objetao[$cont_linha]->lancamento)){
			  		$objetao[$cont_linha]->lancamento = get_lancamento(trim($line));
			  		$objetao[$cont_linha]->anotacao = get_anotacao(trim($line));
			  		$objetao[$cont_linha]->conta = get_numero_conta(trim($line));
			  		$objetao[$cont_linha]->data = get_data_linha(trim($line));
			  		$objetao[$cont_linha]->doc_1 = "doc1";
			  		$objetao[$cont_linha]->doc_2 = "doc2";
			  		$valores = get_debito_credito_linha($line);
					$objetao[$cont_linha]->debito = $valores[0][0];
					$objetao[$cont_linha]->credito = $valores[0][1];
		    	}elseif(empty($objetao[$cont_linha]->anotacao)){
			  		$objetao[$cont_linha]->anotacao = get_anotacao(trim($line));
		    	}elseif(empty($objetao[$cont_linha]->conceito)){
			  		$objetao[$cont_linha]->conceito = get_conceito(trim($line));
		    	}elseif(empty($objetao[$cont_linha]->data)){
			  		$objetao[$cont_linha]->data = get_data_linha($line);
			  		$objetao[$cont_linha]->conta = get_numero_conta(trim($line));
			  		$objetao[$cont_linha]->doc_1 = "doc1";
			  		$objetao[$cont_linha]->doc_2 = "doc2";
			  		$valores = get_debito_credito_linha($line);
					$objetao[$cont_linha]->debito = $valores[0][0];
					$objetao[$cont_linha]->credito = $valores[0][1];
		    	}elseif(empty($objetao[$cont_linha]->conta)){
			  		$objetao[$cont_linha]->conta = get_numero_conta(trim($line));
			  		$objetao[$cont_linha]->doc_1 = "doc1";
			  		$objetao[$cont_linha]->doc_2 = "doc2";
			  		$valores = get_debito_credito_linha($line);
					$objetao[$cont_linha]->debito = $valores[0][0];
					$objetao[$cont_linha]->credito = $valores[0][1];
		    	}elseif(empty($objetao[$cont_linha]->debito)){
			  		$valores = get_debito_credito_linha($line);
					$objetao[$cont_linha]->debito = $valores[0][0];
					if(!empty($valores[0][1])){
						$objetao[$cont_linha]->credito = $valores[0][1];
					}
		    	}elseif(empty($objetao[$cont_linha]->credito)){
			  		$valores = get_debito_credito_linha($line);
					$objetao[$cont_linha]->credito = $valores[0][0];
		    	}

		    	
		    	if( !empty($objetao[$cont_linha]->lancamento) &&
		    		!empty($objetao[$cont_linha]->anotacao) &&
		    		!empty($objetao[$cont_linha]->conceito) &&
		    		!empty($objetao[$cont_linha]->data) &&
		    		!empty($objetao[$cont_linha]->conta) &&
		    		!empty($objetao[$cont_linha]->doc_1) &&
		    		!empty($objetao[$cont_linha]->doc_2) &&
		    		!empty($objetao[$cont_linha]->debito) &&
		    		!empty($objetao[$cont_linha]->credito)
		    		)
		    	{
		    		$_M->diario_teste->insert($objetao[$cont_linha]);
		    		// if($cont_linha > 13570){
		    			// print_r($objetao[$cont_linha]);
		    			// exit(0);
		    		// }
		    		$cont_linha++;
		    	}
			}
	    }
		fclose($f);
	}
	$time_end = microtime(true);

//dividing with 60 will give the execution time in minutes other wise seconds
$execution_time = date("H:i:s", $time_end-$time_start);
//execution time of the script
echo '<b>Total Execution Time:</b> '.$execution_time.' Mins';
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

	// Pega a data da linha no formato dd/mm/YYYY
	function get_debito_credito_linha($line){
		$data_linha =  $dateArray = preg_match_all("/[0-9.]*\,[0-9][0-9]/",  $line, $match);
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
    	if(!empty($match[0][2])){
    		return $match[0][2];
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