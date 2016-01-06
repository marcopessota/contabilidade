<?php

	if (CONNECTOR_DB == "MYSQL") {

	} elseif (CONNECTOR_DB == "MONGODB") {
		$tree_path = $_M->folha_trabalho_teste->find(array("caminho" => $post["tree_path"], "tipo" => "folha_trabalho"))->getNext();
	}
	
	$myFile = "../rep/tree_path_files/id_cliente/" . $tree_path["caminho"] . "/" . $tree_path["nome"] . ".json";
	$fh = fopen($myFile, "w") or die("can't open file");
	fwrite($fh, $post["mydata"]);
	fclose($fh);

?>