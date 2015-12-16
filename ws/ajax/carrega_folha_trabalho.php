<?php
	
	$post["id_caminho"] = str_replace('\\', '/', $post["id_caminho"]);
	$query = $_MY->query("SELECT * FROM folha_trabalho WHERE caminho = '" . $post["id_caminho"] . "'");
	foreach ($query as $key => $value) {
		$string["caminho"] = $value["caminho"];
	}
	$fh = fopen("../rep/folhas_trabalho_id_cliente/" . $post["nome_arquivo"], "r") or die("can't open file");
	$string["data"] = '';
	while (!feof($fh)) {
		$texto = fgets($fh);
		$string["data"] .= $texto;
	}
	fclose($fh);
	echo json_encode($string);

?>