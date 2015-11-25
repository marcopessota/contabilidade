<?php
set_time_limit(0);

$collection = "chart_account";

$tabela = "chart_account";


switch ($post["action"]) {
	case 'add':
		$return = add_chart_account();
		break;
	case 'edit':
		$return = edit_chart_account();
		break;
	case 'remove':
		$return = remove_chart_account();
		break;
}
// print_r($post);exit;
echo json_encode($return);


function add_chart_account(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
	global $post;

	if(CONNECTOR_DB == "MYSQL"){
		$obj_mysql = $_MY->query('SELECT * FROM '.$tabela. ' WHERE account	=' . trim($post["account"]));
		if(empty($obj_mysql)){
			$_MY->query('INSERT INTO ' . $tabela . ' VALUES (null, "'.trim($post["account"]).'", "'.trim($post["desc"]).'")');
			$return->success = "ok";
			$return->error = "no_error";
		}else{
			$return->success = "error";
			$returnrn->error = "duplicate";
		}


	}elseif(CONNECTOR_DB == "MONGODB"){
		$mongo_obj = $_M->$collection->find(array('account' => trim($post["account"])))->getNext();
		if(empty($mongo_obj)){
			$_M->$collection->insert(array("id_diario" => 1, "account" => trim($post["account"]), "desc" => trim($post["desc"])));
			$return->success = "ok";
			$return->error = "no_error";
		}else{
			$return->success = "error";
			$return->error = "duplicate";
		}
	}
	return $return;
}

function edit_chart_account(){

	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
	global $post;

	if(CONNECTOR_DB == "MYSQL"){
		$obj_mysql = $_MY->query('SELECT * FROM '.$tabela. ' WHERE id	=' . trim($post["id"]));
		if(empty($obj_mysql)){
			$return->success = "error";
			$returnrn->error = "not_exists";
		}else{
			$_MY->query('UPDATE ' . $tabela . ' SET  account = "'.trim($post["account"]).'", desc = "'.trim($post["desc"]).'"');
			$return->success = "ok";
			$return->error = "no_error";
		}

	}elseif(CONNECTOR_DB == "MONGODB"){
		$mongo_obj = $_M->$collection->find(array("_id"=> new MongoId($post["id"])))->getNext();
		if(empty($mongo_obj)){
			$return->success = "error";
			$return->error = "not_exists";
		}else{
			$_M->$collection->update(array("_id"=> new MongoId($post["id"])), array('$set' => array("account" => trim($post["account"]), "desc" => trim($post["desc"]))));
			$return->success = "ok";
			$return->error = "no_error";
		}
	}

	return $return;
}

function remove_chart_account(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
	global $post;

	if(CONNECTOR_DB == "MYSQL"){
		$obj_mysql = $_MY->query('SELECT * FROM '.$tabela. ' WHERE id	=' . trim($post["id"]));
		if(empty($obj_mysql)){
			$return->success = "error";
			$returnrn->error = "not_exists";
		}else{
			$_MY->query('DELETE FROM ' . $tabela . ' WHERE id = '. trim($post["id"]));
			$return->success = "ok";
			$return->error = "no_error";
		}

	}elseif(CONNECTOR_DB == "MONGODB"){
		$mongo_obj = $_M->$collection->find(array("_id"=> new MongoId($post["id"])))->getNext();
		if(empty($mongo_obj)){
			$return->success = "error";
			$return->error = "not_exists";
		}else{
			$_M->$collection->remove(array("_id"=> new MongoId($post["id"])));
			$return->success = "ok";
			$return->error = "no_error";
		}
	}
	return $return;
}

?>