<?php 

	foreach ($post["data"] as $key => $value) {
		if ($value == 1) {
			print_r($key . " - ");
		}
	}
	exit();
	$myFile = "../rep/folhas_trabalho_id_cliente/aaaaa.json";
	$fh = fopen($myFile, "w") or die("can't open file");
	$stringData = $post["mydata"];
	fwrite($fh, $stringData);
	fclose($fh);

?>