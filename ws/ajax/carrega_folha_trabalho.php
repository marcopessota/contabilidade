<?php
	
	$fh = fopen("../rep/folhas_trabalho_id_cliente/" . $_POST["_p"], 'r') or die("can't open file");
	$string = '';
	while (!feof($fh)) {
		$texto = fgets($fh);
		$string .= $texto;
	}
	fclose($fh);
	echo $string;

?>