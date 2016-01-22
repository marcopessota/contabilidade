var app = angular.module('app');

app.controller('balancoController', function($scope, $http, S_vars, $sce, S_http_validate) {
    var $balanco = this;
    $balanco.titulo = "Balanço Patrimonial";

    $balanco.usar_balanco = function(){
        var currencyTemplate = {align: 'right', sorttype: 'number', editable: true,
        searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni']},
        formatter: function (v) {
            return Globalize.format(Number(v), "c");
        },
        unformat: function (v) {
            return Globalize.parseFloat(v);
        }};
        var obj_ajax = {};
        obj_ajax._f = 'get_balanco';
        obj_ajax._p = {
            a: 1
        };
        $("#balanco_mongo").jqGrid({
            url: S_vars.url_ajax + 'ajax.php',
            datatype: "json",
            postData: obj_ajax,
            colModel:[
                {name:"Título", index:"desc_account", sorttype: "string", formmater: "string"},
                {name:"Conta", index:"chart_account", sorttype: "string", formmater: "string"},
                {name:"Débito", index:"debt_sum", sorttype: "string",  formmater: "string"},
                {name:"Crédito", index:"credit_sum", sorttype: "string",  formmater: "string"},
                {name:"Saldo", index:"outstanding_balance_sum", sorttype: "string",  formmater: "string"}

            ],
            rowNum:30,
            rowList:[30, 50, 100, 1000],
            pager: '#pager_balanco_mongo',
            sortname: 'accountt',
            viewrecords: true,
            multiselect: true,
            autowidth: true,
            height: 350,
            sortorder: "desc"
        }).navGrid("#pager2",{edit:false,add:false,del:false});

        $('#balanco_mongo').jqGrid('filterToolbar',{"stringResult":true});
    };

    $balanco.gerar_balanco = function(preview) {
        var obj_ajax = {};
        obj_ajax._f = "gera_balanco_patrimonial";

        $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
            var validation = S_http_validate.validate_success(data.error, status);
            // if(validation == true){
            // }else{
            // alert(validation);
            // }
        });
    }
    $balanco.iniciar_master_detail = function() {
        var obj_ajax = {};
        obj_ajax._f = 'inicia_balanco';
        obj_ajax._p = {};
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            // console.log(data);
            $balanco.grid = $sce.trustAsHtml(data);
        });
    }

    if (S_vars.soft == true) {
        $balanco.iniciar_master_detail();
    } else {
        $balanco.datatables = function($filter, $compile, $scope, $resource, DTOptionsBuilder, DTColumnBuilder) {
            var vm = this;
            vm.selectAll = false;
            $balanco.selected = {};
            $balanco.toggleAll = toggleAll;
            $balanco.toggleOne = toggleOne;

            var titleHtml = '<input type="checkbox" ng-model="balancoCtrl.selectAll" ng-click="balancoCtrl.toggleAll(balancoCtrl.selectAll, balancoCtrl.selected)">';

            vm.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('ajax', {
                    url: S_vars.url_ajax + "ajax/get_balanco.php",
                    type: 'POST'
                })
                .withLanguage({
                        "sEmptyTable": "Nenhum registro encontrado",
                        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ registros",
                        "sInfoEmpty": "Mostrando 0 até 0 de 0 registros",
                        "sInfoFiltered": "(Filtrados de _MAX_ registros)",
                        "sInfoPostFix": "",
                        "sInfoThousands": ".",
                        "sLengthMenu": "_MENU_ resultados por página",
                        "sLoadingRecords": "Carregando...",
                        "sProcessing": "Processando...",
                        "sZeroRecords": "Nenhum registro encontrado",
                        "sSearch": "Pesquisar (Conta/Titulo)",
                        "oPaginate": {
                            "sNext": "Próximo",
                            "sPrevious": "Anterior",
                            "sFirst": "Primeiro",
                            "sLast": "Último"
                        },
                        "oAria": {
                            "sSortAscending": ": Ordenar colunas de forma ascendente",
                            "sSortDescending": ": Ordenar colunas de forma descendente"
                        }
                })
                .withDataProp('data')
                .withOption('processing', true)
                .withOption('serverSide', true)
                .withOption('createdRow', function(row, data, dataIndex) {
                    // Recompiling so we can bind Angular directive to the DT
                    $compile(angular.element(row).contents())($scope);
                })
                .withOption('headerCallback', function(header) {
                    if (!vm.headerCompiled) {
                        // Use this headerCompiled field to only compile header once
                        vm.headerCompiled = true;
                        $compile(angular.element(header).contents())($scope);
                    }
                })
                .withPaginationType('full_numbers');

            vm.dtColumns = [
                DTColumnBuilder.newColumn(null).withTitle(titleHtml).notSortable()
                .renderWith(function(data, type, full, meta) {
                    // $balanco.selected[full.id] = false;
                    // console.log(full.id);
                    return '<input type="checkbox" ng-model="balancoCtrl.selected[\'' + data._id.$id + '\']" ng-click="balancoCtrl.toggleOne(balancoCtrl.selected)">';
                }),
                DTColumnBuilder.newColumn('_id').notVisible(),
                DTColumnBuilder.newColumn('id_diario').notVisible(),
                DTColumnBuilder.newColumn('chart_account').withTitle('Conta').withOption('width', '20%'),
                DTColumnBuilder.newColumn('desc_account').withTitle('Titulo').withOption('width', '20%'),
                DTColumnBuilder.newColumn('debt_sum').withTitle('Débito').withOption('width', '20%').renderWith(function(data, type, full) {
                    return $filter('currency')(data, 'R$', 2);
                }),
                DTColumnBuilder.newColumn('credit_sum').withTitle('Crédito').withOption('width', '20%').renderWith(function(data, type, full) {
                    return $filter('currency')(data, 'R$', 2);
                }),
                DTColumnBuilder.newColumn('outstanding_balance_sum').withTitle('Saldo').withOption('width', '20%').renderWith(function(data, type, full) {
                    return $filter('currency')(data, 'R$', 2);
                })
            ];

            function toggleAll(selectAll, selectedItems) {
                for (var id in selectedItems) {
                    if (selectedItems.hasOwnProperty(id)) {
                        selectedItems[id] = selectAll;
                    }
                }
            }

            function toggleOne(selectedItems) {
                for (var id in selectedItems) {
                    if (selectedItems.hasOwnProperty(id)) {
                        if (!selectedItems[id]) {
                            vm.selectAll = false;
                            return;
                        }
                    }
                }
                vm.selectAll = true;
            }
        }

    }
});
