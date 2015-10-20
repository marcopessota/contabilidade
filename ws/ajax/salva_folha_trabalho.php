<?php 

	$myFile = "../rep/folhas_trabalho_id_cliente/" . $post["nome_folha_trabalho"] . ".json";
	$fh = fopen($myFile, "w") or die("can't open file");
	$stringData = $post["mydata"];
	fwrite($fh, $stringData);
	fclose($fh);

?>