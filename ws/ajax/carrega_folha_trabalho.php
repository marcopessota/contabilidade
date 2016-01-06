<?php

	$fh = fopen("../rep/folhas_trabalho_id_cliente/" . $post, "r") or die("Não foi possivel abrir o arquivo");
	$string = '';
	while (!feof($fh)) {
		$texto = fgets($fh);
		$string .= $texto;
	}
	fclose($fh);
	echo $string;

?>