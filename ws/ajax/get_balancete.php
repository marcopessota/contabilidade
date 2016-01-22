<?php

error_reporting(0);


$SOFT = false;

$page = $_GET['page']; // get the requested page
$limit = $_GET['rows']; // get how many rows we want to have into the grid
$sidx = $_GET['sidx']; // get index row - i.e. user click to sort
$sord = $_GET['sord']; // get the direction



$filterResultsJSON = json_decode($_REQUEST['filters']);
$filterArray = get_object_vars($filterResultsJSON);

if(!empty($_GET['filters'])){
	$counter = 0;
	$sql_filter ='';
	while($counter < count($filterArray['rules']))
		{
		$filterRules = get_object_vars($filterArray['rules'][$counter]);

		if($counter == 0){
		$sql_filter .= ' WHERE ' . $filterRules['field'] . ' LIKE "%' . $filterRules['data'] . '%"';
		}
		else {
		$sql_filter .= ' AND ' . $filterRules['field'] . ' LIKE "%' . $filterRules['data'] . '%"';
		}
		$counter++;
	}
}
if(!$sidx) $sidx = 1;

if($SOFT){

	// connect to the database
	$db = mysql_connect('localhost', 'root', '')
	or die("Connection Error: " . mysql_error());

	mysql_select_db('test') or die("Error conecting to db.");
	$result = mysql_query("SELECT COUNT(*) AS count FROM invheader a ".$sql_filter);
	$row = mysql_fetch_array($result,MYSQL_ASSOC);
	$count = $row['count'];

	if( $count >0 ) {
		$total_pages = ceil($count/$limit);
	} else {
		$total_pages = 0;
	}

	if ($page > $total_pages) $page = $total_pages;
	$start = $limit * $page - $limit; // do not put $limit*($page - 1)

	if($start < 0){
		$start = 0;
	}

	$SQL = "SELECT * FROM invheader a " . $sql_filter . " ORDER BY $sidx $sord LIMIT $start , $limit";

	$result = mysql_query( $SQL ) or die("Couldn t execute query.".mysql_error());

	$response->page = $page;
	$response->total = $total_pages;
	$response->records = $count;
	$i=0;
	while($row = mysql_fetch_array($result,MYSQL_ASSOC)) {
		$response->rows[$i]['id'] = $row[id];
		$response->rows[$i]['cell'] = array($row[id],$row[invdate], $row[amount],$row[tax],$row[total],$row[note]);
		$i++;
	}
}else{
	if(empty($_GET["sord"])){
		$sort = array('_id' =>1);
	}
	if($_GET["sord"] == "asc"){
		$sort = array($_GET["sidx"] => 1);
	}else{
		$sort = array($_GET["sidx"] => -1);
	}



	$regexs = array();
	if(!empty($_GET['filters'])){
		$counter = 0;
		$sql_filter ='';
		while($counter < count($filterArray['rules'])){
			$filterRules = get_object_vars($filterArray['rules'][$counter]);
			// $regexs[] = array($filterRules['field'] => new MongoRegex("/".$filterRules['data']."/i"));
			$regexs[$filterRules['field']] = trim($filterRules['data']);
			$counter++;
		}
	}

	$count = $_M->trial_balance->count($regexs);
	if( $count >0 ) {
		$total_pages = ceil($count/$limit);
	} else {
		$total_pages = 0;
	}

	if ($page > $total_pages) $page = $total_pages;
	$start = $limit * $page - $limit; // do not put $limit*($page - 1)

	if($start < 0){
		$start = 0;
	}
	$result = $_M->trial_balance->find($regexs)->skip($start)->limit($limit)->sort($sort);

	$i = 0;
	foreach($result as $k => $v){
		$response->rows[$i]['id'] = (string) $v["_id"];
		$response->rows[$i]['cell'] = array($v['title'], $v['account'], $v['debt'], $v['credit'], $v['outstanding_balance']);
		$i++;
	}

	$response->page = $page;
	$response->total = $total_pages;
	$response->records = $count;
}


echo json_encode($response);
?>