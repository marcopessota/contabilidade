var app = angular.module('app');

app.controller('folhaTrabalhoController', function($scope) {
    var $folha_trabalho = this;
    $folha_trabalho.titulo = "Folhas de Trabalho";

    // var data = [
    //     ["", "Ford", "Volvo", "Toyota", "Honda"],
    //     ["2014", 10, 11, 12, 13],
    //     ["2015", 20, 11, 14, 13],
    //     ["2016", 30, 15, 12, 13]
    // ];

    var container = document.getElementById('example');
    var hot = new Handsontable(container, {
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
        stretchH: 'all'
    });

    $folha_trabalho.salvar_folha_trabalho = function() {
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
    }
});