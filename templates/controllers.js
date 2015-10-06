var app = angular.module('app');

app.controller('appController', function($scope) {
    var $app = this;
    $app.titulo = "App";
    $app.selected_menu = "contabilidade";

    $app.select_menu = function(menu) {
        $app.selected_menu = menu;
    };
});

app.controller('balanceteController', function($scope) {
    var $balancete = this;
    $balancete.titulo = "Balancete";
});

app.controller('diarioController', function($scope) {
    var $diario = this;
    $diario.titulo = "Diario";

    // $diario.ServerSideProcessingCtrl = function(DTOptionsBuilder, DTColumnBuilder) {
    //     vm.dtOptions = DTOptionsBuilder.newOptions()
    //         .withOption('ajax', {
    //             // Either you specify the AjaxDataProp here
    //             // dataSrc: 'data',
    //             url: 'teste.json',
    //             type: 'POST'
    //         })
    //     // or here
    //     .withDataProp('data')
    //         .withOption('processing', true)
    //         .withOption('serverSide', true)
    //         .withPaginationType('full_numbers');
    //     vm.dtColumns = [
    //         DTColumnBuilder.newColumn('id').withTitle('ID'),
    //         DTColumnBuilder.newColumn('firstName').withTitle('First name'),
    //         DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
    //     ];
    // }
});

app.controller('folhaTrabalhoController', function($scope) {
    var $folha_trabalho = this;
    $folha_trabalho.titulo = "Folhas de Trabalho";

    var data = [
        ["", "Ford", "Volvo", "Toyota", "Honda"],
        ["2014", 10, 11, 12, 13],
        ["2015", 20, 11, 14, 13],
        ["2016", 30, 15, 12, 13]
    ];

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
});