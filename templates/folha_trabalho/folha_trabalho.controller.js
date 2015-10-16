var app = angular.module('app');

app.controller('folhaTrabalhoController', function($scope, $timeout) {
    var $folha_trabalho = this;
    $folha_trabalho.titulo = "Folhas de Trabalho";
    $folha_trabalho.handsontables = [];

    var container = document.getElementById('handsontable_1');
    $folha_trabalho.handsontables.push(new Handsontable(container, {
        // data: data,
        // minSpareRows: 1,
        comments: true,
        startRows: 10,
        startCols: 15,
        minSpareRows: 1,
        rowHeaders: true,
        colHeaders: true,
        contextMenu: true,
        manualColumnResize: true,
        manualRowResize: true,
        formulas: true,
        // stretchH: 'all'
    }));

    // Manipulação das Tabs
    $folha_trabalho.tab = 1;
    $folha_trabalho.tabs = [];

    $folha_trabalho.setTab = function(tabId) {
        $folha_trabalho.tab = tabId;
    };

    $folha_trabalho.isSet = function(tabId) {
        return $folha_trabalho.tab === tabId;
    };

    $folha_trabalho.addTab = function() {
        var prox = $folha_trabalho.tabs.length + 2;
        $folha_trabalho.tabs.push({
            id: prox
        });

        $timeout(function() {
            var container = document.getElementById('handsontable_' + prox);

            $folha_trabalho.handsontables.push(new Handsontable(container, {
                // data: data,
                // minSpareRows: 1,
                comments: true,
                startRows: 10,
                startCols: 15,
                minSpareRows: 1,
                rowHeaders: true,
                colHeaders: true,
                contextMenu: true,
                manualColumnResize: true,
                manualRowResize: true,
                formulas: true,
                // stretchH: 'all'
            }));
        }, 100);
    };
    // Fim Manipulação das Tabs

    $folha_trabalho.exportar_folha_trabalho = function(tab) {
    	var tab = tab - 1;
    	var instance = $folha_trabalho.handsontables[tab];
        handsontable2csv.download(instance, "filename.csv");
    };

    $folha_trabalho.salvar_folha_trabalho = function(tab) {
        var tab = tab - 1;
        var mydata = hot.getData();
        mydata = JSON.stringify(mydata);

        $.ajax({
            type: 'POST',
            data: {
                _p: mydata,
                _f: 'salva_folha_trabalho'
            },
            url: 'ws/ajax.php',
            success: function(response) {
                // alert('Nota salva com sucesso!');
            }
        });
    };
});