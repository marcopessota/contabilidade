<?php 

	$myFile = 'arquivo_teste.json';
	$fh = fopen($myFile, "w") or die("can't open file");
	$stringData = $post;
	fwrite($fh, $stringData);
	fclose($fh);

?>