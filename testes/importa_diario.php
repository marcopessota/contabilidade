<?php 

set_time_limit(0);

$m = new MongoClient();
$_M = $m->contabilidade; // selectiona o banco

$numero_colunas = 10;

// $filename = "../rep/diario/diario_full.txt";
if(empty($filename)){
	echo "Digite nome do arquivo";
}else{
	$f = @fopen($filename, "r");
	$titulos = true;
	if($f) {
	    while (($line = fgets($f)) !== false){
	    	$arr_total = array();
			$line = explode(";", $line);
			if($titulos == false){
		    	for($cont = 0; $cont <= $numero_colunas; $cont++){
					$arr_total[] = trim(utf8_encode($line[$cont]));
				}
		     	$_M->diario_teste->insert($arr_total);
	     	}else{
				$titulos = false;
	     	}
	    }
		fclose($f);
	}
}
?>