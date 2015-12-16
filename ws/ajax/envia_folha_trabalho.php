<?php 

	if (CONNECTOR_DB == "MYSQL") {
		$string = '[';
		foreach ($post['rows'] as $key => $value) {
			$query = $_MY->query('SELECT * FROM diario WHERE id = ' . $value);
			$string .= '[';
			foreach ($query as $key2 => $value2) {
				foreach ($value2 as $value3) {
					$string .= '"' . $value3 . '",';
				}
			}
			$string = rtrim($string, ',');
			$string .= '],';
		}
		$string = rtrim($string, ',');
		$string .= ']';
		string_contruction($string);
	} elseif (CONNECTOR_DB == "MONGODB") {

		$array_entrys = array();
		$string = '[';
		foreach ($post['rows'] as $key => $value) {
			$mongo_obj = $_M->diario_teste3->findOne(array('_id' => new MongoId($key)));
			if($post['values']["sheet_partidas"] == true){
				$mongo_entries_obj = $_M->diario_teste3->find(array('entry' => $mongo_obj["entry"]));
				foreach ($mongo_entries_obj as $k => $v) {
					$string .= '[';
					foreach ($v as $k2 => $v2) {
						$string .= '"' . $v2 . '",';
					}
					$string = rtrim($string, ',');
					$string .= '],';
				}
			}else{
				$string .= '[';
				foreach ($mongo_obj as $key2 => $value2) {
					$string .= '"' . $value2 . '",';
				}
				$string = rtrim($string, ',');
				$string .= '],';
			}
		}
		$string = rtrim($string, ',');
		$string .= ']';
		string_contruction($string);
	}

	function string_contruction ($string) {
		global $post;
		$myFile = "../rep/folhas_trabalho_id_cliente/" . $post['values']['sheet_name'] . ".json";
		$fh = fopen($myFile, "w") or die("can't open file");
		fwrite($fh, $string);
		fclose($fh);
	}

?>