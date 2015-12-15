<?php


require_once("config.php");

// $obj->nome = 3;
// $obj->valor = 4;
// $d = '2015-01-15';
// $date = new DateTime($d, new DateTimeZone('UTC'));
// $obj->ts =  new MongoDate($date->format("U"));
// $obj->data = $d;

// $_M->diario_teste5->insert($obj);


// 		$balance_sheet_obj = $_M->diario_teste5->aggregate(array(
// 			array(
// 				'$project' => array(
// 					'month' => array('$month' => '$ts'),
// 				    "nome" => 1,
// 				    "valor" => 1
// 				)
// 			),
// 			array('$group' => array('_id' => array('month' => '$month'),
// 								'valor_s' => array('$sum' => '$valor'),
// 								 "nome" => array('$addToSet' => '$nome'),
// 			)
// 			)
// 		));
// 		print_r($balance_sheet_obj);



$a = $_M->diario_teste5->find(array("account" => "11302002"));
$aaaa = 0;
foreach ($a as $key => $value) {
	echo $value["credit_value"].PHP_EOL;
	$aaaa += $value["credit_value"];
}

echo "dasdasdasda - ". $aaaa;
?>