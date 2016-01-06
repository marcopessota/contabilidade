<?php
	
	$path_dir = "../rep/tree_path/id_cliente/" . $post["tree_path"] . "/" . $post["note_name"];

	if (!file_exists($path_dir)) {
		mkdir($path_dir, 0777, true);
	}

	$path_dir = "../rep/tree_path_files/id_cliente/" . $post["tree_path"] . "/" . $post["note_name"];
	if (!file_exists($path_dir)) {
		mkdir($path_dir, 0777, true);
	}

	if (empty($post["tree_path"])) {
		$id_node = $post["note_name"];
	} else {
		$id_node = $post["tree_path"] . "/" . $post["note_name"];
	}

	$nome_nota = 'Nome nota';
	$nome_folha = 'Nome folha';
	
	$fh = fopen($path_dir . "/" . $nome_nota . ".txt", "w") or die("can't open file");
	fwrite($fh, 'Texto padrão');
	fclose($fh);

	$fh = fopen($path_dir  . "/" . $nome_folha . ".json", "w") or die("can't open file");
	fwrite($fh, '[["", "", "", "", "", "", ""],["", "", "", "", "", "", ""],["", "", "", "", "", "", ""],["", "", "", "", "", "", ""],["", "", "", "", "", "", ""]]');
	fclose($fh);

	if (CONNECTOR_DB == "MYSQL") {
		exit();
		$caminho = $myFile;
		$caminho = substr($caminho, strpos($caminho, 'rep'));
		$caminho = strtolower($caminho);
		$caminho = str_replace(' ', '_', $caminho);
		$_MY->query("INSERT INTO folha_trabalho VALUES(null, '" . $caminho . "', '" . $post["nome_folha_trabalho"] . "')");
	} elseif (CONNECTOR_DB == "MONGODB") {
		$m = new MongoClient();
		$_M = $m->contabilidade;

		$arr_folha_trabalho = array(
			"caminho" => $id_node, 
			"parent" => $post["tree_path"], 
			"arquivo" => $post["note_name"], 
			"nome" => $nome_folha,
			"tipo" => "folha_trabalho");
		$_M->folha_trabalho_teste->insert($arr_folha_trabalho);

		$arr_folha_trabalho = array(
			"caminho" => $id_node, 
			"parent" => $post["tree_path"], 
			"arquivo" => $post["note_name"], 
			"nome" => $nome_nota,
			"tipo" => "nota_trabalho");
		$_M->folha_trabalho_teste->insert($arr_folha_trabalho);
	}

?>