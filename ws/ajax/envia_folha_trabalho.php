<?php 
	
	if ($post['tipo'] == 'mongodb') {
		// unset($post[key($post['data']['undefined'])]);
		// print_r($post);
		// print_r($post['data']);
		foreach ($post['data'] as $key => $value) {
			print_r($key);
		}
	} else {
		$_MYSQL = cria_conexao();

		$string = '[';
		foreach ($post['rows'] as $key => $value) {
			$query = query('SELECT * FROM diario WHERE id = ' . $value);
			$string .= '[';
			foreach ($query[0] as $key2 => $value2) {
				$string .= '"' . $value2 . '",';
			}
			$string = rtrim($string, ',');
			$string .= '],';
		}
		$string = rtrim($string, ',');
		$string .= ']';

		$myFile = "../rep/folhas_trabalho_id_cliente/" . $post['nome_folha_trabalho'] . ".json";
		$fh = fopen($myFile, "w") or die("can't open file");
		fwrite($fh, $string);
		fclose($fh);

		function cria_conexao(){
			$_MYSQL = mysql_connect('localhost', 'root', '');
			if (!$_MYSQL) {
			    die('Could not connect: ' . mysql_error());
			}
			$db_selected = mysql_select_db('test', $_MYSQL);
			if (!$db_selected) {
			    die('Can\'t use foo : ' . mysql_error());
			}

			return $_MYSQL;
		}

		function fecha_conexao(){
			global $_MYSQL;
			mysql_close($_MYSQL);
		}

		function query($sql){
			global $_MYSQL;
			$result = mysql_query($sql, $_MYSQL);
			while ($row = mysql_fetch_assoc($result)) {
			    $obj_return[] = $row;
			}
			return $obj_return;
		}

		function grava($sql){
			global $_MYSQL;
			$result = mysql_query($sql, $_MYSQL);
			return $result;
		}
	}

?>