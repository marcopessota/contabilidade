<?php
   header("Content-type: application/vnd.ms-excel");
   header("Content-type: application/force-download");
   header("Content-Disposition: attachment; filename=file.xls");
   header("Pragma: no-cache");
   echo $post["html"];
?>