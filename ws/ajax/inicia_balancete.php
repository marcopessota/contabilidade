<?php
    require_once("phpGrid/conf.php"); // relative path to conf.php without leading slash

    $dg = new C_DataGrid("SELECT * FROM diario2", "id", "diario2");
    // $sdg = new C_DataGrid("SELECT * FROM teste_details", "id", "teste_details");
    // $sdgg = new C_DataGrid("SELECT * FROM teste_teste_details", "id", "teste_teste_details");

    // enable edit
    $dg->enable_edit("INLINE", "CRUD");
    $dg->set_multiselect(true);
    // $sdg->enable_edit("INLINE", "CRUD");
    // $sdgg->enable_edit("INLINE", "CRUD");
    
    // $dg->set_masterdetail($sdg, "testeId");
    // $sdg->set_masterdetail($sdgg, "id");
    $dg->display();
?>
