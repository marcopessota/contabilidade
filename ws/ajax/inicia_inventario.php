<?php
    require_once("phpGrid/conf.php"); // relative path to conf.php without leading slash

    $dg = new C_DataGrid("SELECT * FROM inventario", "id", "inventario");

    // enable edit
    $dg->enable_edit("INLINE", "CRUD");
    
    $dg->set_col_hidden("id");
    
    $dg->set_col_title("referencia", "Referência");
    $dg->set_col_title("descricao", "Descrição");
    $dg->set_col_title("total_entradas", "Total Entradas");
    $dg->set_col_title("total_saidas", "Total Saídas");
    $dg->set_col_title("saldo_final", "Saldo Final");
    $dg->set_col_title("rotacao", "Rotação");
    $dg->set_col_title("preco", "Preço");
    $dg->set_col_title("total_valor", "Total Valor");

    $dg->set_dimension(1200, 200);

    $dg->enable_search(true);

    $dg->set_multiselect(true);

    $dg->display();
?>