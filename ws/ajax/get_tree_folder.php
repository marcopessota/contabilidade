<?php
	
	if (CONNECTOR_DB == "MYSQL") {

	} elseif (CONNECTOR_DB == "MONGODB") {
		$or_query = array(array("tipo" => "nota_trabalho"), array("tipo" => "folha_trabalho"));
		$tree_path = $_M->folha_trabalho_teste->find(array("caminho" => $post["tree_path"], '$or' => $or_query));
	}

	foreach ($tree_path as $key => $value) {
		switch ($value["tipo"]) {
			case "nota_trabalho":
				$myFile = "../rep/tree_path_files/id_cliente/" . $value["caminho"] . "/" . $value["nome"] . ".txt";
				$fh = fopen($myFile, "r") or die("can't open file");
				$return->content_note = fread($fh, filesize($myFile));
				fclose($fh);
				break;
			case "folha_trabalho":
				$myFile = "../rep/tree_path_files/id_cliente/" . $value["caminho"] . "/" . $value["nome"] . ".json";
				$fh = fopen($myFile, "r") or die("can't open file");
				$return->content_sheet = fread($fh, filesize($myFile));
				fclose($fh);
				break;
		}
	}

	echo json_encode($return);

?>