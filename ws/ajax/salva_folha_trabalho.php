<?php

	mkdir("../rep/folhas_trabalho_id_cliente/" . $post["nome_folha_trabalho"]);
	$myFile = "../rep/folhas_trabalho_id_cliente/" . $post["nome_folha_trabalho"] . "/" . $post["nome_folha_trabalho"];
	$fh = fopen($myFile, "w") or die("can't open file");
	$stringData = $post["mydata"];
	fwrite($fh, $stringData);
	fclose($fh);

	if (CONNECTOR_DB == "MYSQL") {
		$caminho = $myFile;
		$caminho = substr($caminho, strpos($caminho, 'rep'));
		$caminho = strtolower($caminho);
		$caminho = str_replace(' ', '_', $caminho);
		$_MY->query("INSERT INTO folha_trabalho VALUES(null, '" . $caminho . "', '" . $post["nome_folha_trabalho"] . "')");
		echo $caminho;
	} elseif (CONNECTOR_DB == "MONGODB") {
		$m = new MongoClient();
		$_M = $m->contabilidade;

		$arr_folha_trabalho = ["caminho" => $caminho, "arquivo" => $post["nome_folha_trabalho"]];
		$_M->folha_trabalho_teste->insert($arr_folha_trabalho);
	}

?>