<?php
set_time_limit(0);

$collection = "business";

$tabela = "business";


switch ($post["action"]) {
	case 'add':
		$return = add_business();
		break;
	case 'edit':
		$return = edit_business();
		break;
	case 'remove':
		$return = remove_business();
		break;
}
// print_r($post);exit;
echo json_encode($return);


function add_business(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
	global $post;

	if(CONNECTOR_DB == "MYSQL"){
		$obj_mysql = $_MY->query('SELECT * FROM '.$tabela. ' WHERE nome	=' . trim($post["nome"]));
		$obj_mysql = $obj_mysql->fetch_all();
		if(empty($obj_mysql)){
			$_MY->query('INSERT INTO ' . $tabela . ' VALUES (null, "'.trim($post["nome"]).'")');
			$return->success = "ok";
			$return->error = "no_error";
		}else{
			$return->success = "error";
			$returnrn->error = "duplicate";
		}


	}elseif(CONNECTOR_DB == "MONGODB"){
		$mongo_obj = $_M->$collection->find(array('nome' => trim($post["nome"])))->getNext();
		if(empty($mongo_obj)){
			$_M->$collection->insert(array("nome" => trim($post["nome"])));
			$return->success = "ok";
			$return->error = "no_error";
		}else{
			$return->success = "error";
			$return->error = "duplicate";
		}
	}
	return $return;
}

function edit_business(){

	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
	global $post;

	if(CONNECTOR_DB == "MYSQL"){
		$obj_mysql = $_MY->query('SELECT * FROM '.$tabela. ' WHERE id	=' . trim($post["id"]));
		$obj_mysql = $obj_mysql->fetch_all();

		if(empty($obj_mysql)){
			$return->success = "error";
			$return->error = "not_exists";
		}else{
			$_MY->query('UPDATE ' . $tabela . ' SET  nome = "'.trim($post["nome"]).'"  WHERE id	=' . trim($post["id"]));
			$return->success = "ok";
			$return->error = "no_error";
		}

	}elseif(CONNECTOR_DB == "MONGODB"){
		$mongo_obj = $_M->$collection->find(array("_id"=> new MongoId($post["id"])))->getNext();
		if(empty($mongo_obj)){
			$return->success = "error";
			$return->error = "not_exists";
		}else{
			$_M->$collection->update(array("_id"=> new MongoId($post["id"])), array('$set' => array("nome" => trim($post["nome"]))));
			$return->success = "ok";
			$return->error = "no_error";
		}
	}

	return $return;
}

function remove_business(){
	global $_M;
	global $_MY;
	global $collection;
	global $tabela;
	global $post;

	if(CONNECTOR_DB == "MYSQL"){
		$obj_mysql = $_MY->query('SELECT * FROM '.$tabela. ' WHERE id	=' . trim($post["id"]));
		$obj_mysql = $obj_mysql->fetch_all();

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