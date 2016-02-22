var app = angular.module('app');

app.controller('balanceteController', function($scope, $http, S_vars, $sce, $uibModal, S_http_validate, S_sort_table, S_export) {
    var $balancete = this;
    $balancete.titulo = "Balancete";
    $balancete.export = S_export;
    $balancete.sort = S_sort_table;
    $balancete.sort.columns = ['date', 'account', 'debt_value', 'credit_value'];
    $balancete.sort.init();

    $balancete.usar_balancete = function() {
        var currencyTemplate = {
            align: 'right',
            sorttype: 'number',
            editable: true,
            searchoptions: {
                sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni']
            },
            formatter: function(v) {
                return Globalize.format(Number(v), "c");
            },
            unformat: function(v) {
                return Globalize.parseFloat(v);
            }
        };
        var obj_ajax = {};
        obj_ajax._f = 'get_balancete';
        obj_ajax._p = {
            a: 1
        };
        $("#balancete_mongo").jqGrid({
            url: S_vars.url_ajax + 'ajax.php',
            datatype: "json",
            postData: obj_ajax,
            colModel: [{
                    name: "Título",
                    index: "title",
                    sorttype: "string",
                    formmater: "string"
                }, {
                    name: "Conta",
                    index: "account",
                    sorttype: "string",
                    formmater: "string"
                }, {
                    name: "Débito",
                    index: "debt",
                    sorttype: "string",
                    formmater: "string"
                }, {
                    name: "Crédito",
                    index: "credit",
                    sorttype: "string",
                    formmater: "string"
                }, {
                    name: "Saldo",
                    index: "outstanding_balance",
                    sorttype: "string",
                    formmater: "string"
                }

            ],
            rowNum: 30,
            rowList: [30, 50, 100, 1000],
            pager: '#pager_balancete_mongo',
            sortname: 'accountt',
            viewrecords: true,
            multiselect: true,
            autowidth: true,
            height: 350,
            sortorder: "desc",
            onSelectRow: function(ids) {
                console.log(ids);
                if(ids == null) {
                    ids = 0;
                    console.log("aaa");
                } else {
                    console.log("bbb");
                }
            }
        }).navGrid("#pager2", {
            edit: false,
            add: false,
            del: false
        });

        $('#balancete_mongo').jqGrid('filterToolbar', {
            "stringResult": true
        });
    };

    $balancete.gerar_balancete = function(preview) {
        var obj_ajax = {};
        obj_ajax._f = "gera_balancete";

        $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
            var validation = S_http_validate.validate_success(data.error, status);
            // if(validation == true){
            // }else{
            // alert(validation);
            // }
        });
    }
    $balancete.iniciar_master_detail = function() {
        var obj_ajax = {};
        obj_ajax._f = 'inicia_balancete';
        obj_ajax._p = {};
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            // console.log(data);
            $balancete.grid = $sce.trustAsHtml(data);
        });
    }

    $balancete.list_formulas = function() {

        $balancete.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal_formulas.html',
            scope: $scope,
            size: "lg"
        });

        $balancete.cancel = function() {
            $balancete.modalInstance.dismiss('cancel');
        };
    }

    $balancete.composition_balance = function() {
        waitingDialog.show('Gerando Composição de Saldo...');
        var obj_ajax = {};
        obj_ajax._f = 'gera_composicao_saldo';
        obj_ajax._p = {
            rows: $("#balancete_mongo").getGridParam('selarrrow')
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            $balancete.composition_balance_data = {};
            $balancete.composition_balance_data.title = data.title;
            $balancete.composition_balance_data.data_oks = data.data_oks;
            $balancete.composition_balance_data.data_entrys = data.data_entrys;


            $balancete.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modal_composicao_saldo.html',
                scope: $scope
            });

            $balancete.modalInstance.opened.then(function(selectedItem) {
                waitingDialog.hide();
            });
            $balancete.cancel = function() {
                $balancete.modalInstance.dismiss('cancel');
            };
        });
    }
    $balancete.exportExcel = function() {
        waitingDialog.show('Preparando dados para realizar exportação...');
        var obj_ajax = {};
        obj_ajax._f = 'exporta_excel_balancete';
        obj_ajax._p = {};
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            waitingDialog.hide();
        });
    }

    $balancete.sendData = function() {
        var nome_folha_trabalho = prompt('Insira o nome da Folha de Trabalho');

        if (nome_folha_trabalho === null || nome_folha_trabalho == '') return false;

        var rows = getSelRows();

        var obj_ajax = {};
        obj_ajax._f = 'envia_folha_trabalho';
        obj_ajax._p = {
            rows: rows,
            nome_folha_trabalho: nome_folha_trabalho
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            alert('Enviado para folha de trabalho com sucesso');
        });
    }

    if (S_vars.soft == true) {
        $balancete.iniciar_master_detail();
    } else {
        
    }

});
