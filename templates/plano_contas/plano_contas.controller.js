var app = angular.module('app');

app.controller('planoContasController', function($scope, $timeout, $http, $compile, $uibModal, S_vars, S_http_validate, ngDialog) {
    var $plano_contas = this;
    $plano_contas.data_grid;
    $plano_contas.models = {};
    $plano_contas.titulo = 'Plano de contas';
    $plano_contas.editar_registro = function(id){
        $plano_contas.modal_titulo = "Editar";
        if (S_vars.soft == true) {
            vm.itemAdd.id = vm.items[index].id;
        } else {
            $.map($plano_contas.data_grid, function( val, i ) {
                if(val.id == id){
                    $plano_contas.models.id = id;
                    $plano_contas.models.account = val.cell[1];
                    $plano_contas.models.desc = val.cell[0];
                }
            });
        }
        $plano_contas.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal_chart_account.html',
            scope: $scope
        });

        $scope.ok = function() {
            var obj_ajax = {};
            obj_ajax._f = "crud_chart_account";
            obj_ajax._p = $plano_contas.models;
            obj_ajax._p.action = "edit";
            $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                var validation = S_http_validate.validate_success(data.error, status);
                if (validation == true) {
                    $('#plano_contas_mongo').trigger( 'reloadGrid' );
                    alert("Registro alterado com sucesso");
                    $plano_contas.modalInstance.close();
                } else {
                    alert(validation);
                    $plano_contas.modalInstance.close();
                }
            });
        };
        $scope.cancel = function() {
            $plano_contas.modalInstance.dismiss('cancel');
        };
    }
    $plano_contas.excluir_registro = function(id){
        if (S_vars.soft == true) {
            vm.itemAdd.id = vm.items[index].id;
        } else {
            $plano_contas.models.id = id;
        }


        var dialog = ngDialog.open({
            template: 'templates/default/remove.html'
        });

        dialog.closePromise.then(function(data) {
            if (data.value == true) {
                var obj_ajax = {};
                obj_ajax._f = "crud_chart_account";
                obj_ajax._p = $plano_contas.models;
                obj_ajax._p.action = "remove";
                $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                    var validation = S_http_validate.validate_success(data.error, status);
                    if (validation == true) {
                        $('#plano_contas_mongo').trigger( 'reloadGrid' );
                        alert("Registro removido com sucesso");
                    } else {
                        alert(validation);
                    }
                });
            }
        });
    }
    $plano_contas.usar_plano_contas = function(){
        var currencyTemplate = {align: 'right', sorttype: 'number', editable: true,
        searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni']},
        formatter: function (v) {
            return Globalize.format(Number(v), "c");
        },
        unformat: function (v) {
            return Globalize.parseFloat(v);
        }};
        var obj_ajax = {};
        obj_ajax._f = 'get_chart_account';
        obj_ajax._p = {
            a: 1
        };
        $("#plano_contas_mongo").jqGrid({
            url: S_vars.url_ajax + 'ajax.php',
            datatype: "json",
            postData: obj_ajax,
            colModel:[
                {name:"Título", index:"desc", sorttype: "string", formmater: "string"},
                {name:"Conta", index:"account", sorttype: "string", formmater: "string"},
                {name: 'Ações', index: 'edit', align: 'center', search:false, sortable: false, width: '40px' }
            ],
            rowNum:30,
            rowList:[30, 50, 100, 1000],
            pager: '#pager_plano_contas_mongo',
            sortname: 'desc',
            viewrecords: true,
            multiselect: true,
            autowidth: true,
            height: 350,
            sortorder: "desc",
            gridview : false,
            onRightClickRow : function(rowid, iRow, iCol, e){
                // console.log(rowid);
                console.log(iRow);
                // console.log(rowid);
                // console.log(e);
            },
            afterInsertRow: function(id, currentData, jsondata){
                var button =  "<span id=\"action\" class=\"custom_buttom ui-icon ui-icon-pencil\" ng-click=\"planoContasCtrl.editar_registro('"+id+"')\"></span><span id=\"action\" class=\"custom_buttom ui-icon ui-icon-trash\" ng-click=\"planoContasCtrl.excluir_registro('"+id+"')\"></span>";
                $(this).setCell(id, "Ações",button);
            },
            loadComplete : function(data){
                $plano_contas.data_grid = data.rows;
                $compile($(".custom_buttom"))($scope);
            }
        }).navGrid("#pager2",{edit:false,add:false,del:false});

        $('#plano_contas_mongo').jqGrid('filterToolbar',{"stringResult":true});
    };

    $plano_contas.gerar_plano_contas = function(preview) {
        var obj_ajax = {};
        obj_ajax._f = "gera_plano_contas";

        $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
            var validation = S_http_validate.validate_success(data.error, status);
            // if(validation == true){
            // }else{
            // alert(validation);
            // }
        });
    }
    $plano_contas.add_chart_account = function() {
        $plano_contas.title = "Incluir";
        $plano_contas.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal_chart_account.html',
            scope: $scope
        });

        $scope.ok = function() {
            var obj_ajax = {};
            obj_ajax._f = "crud_chart_account";
            obj_ajax._p = $plano_contas.models;
            obj_ajax._p.action = "add";
            $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                var validation = S_http_validate.validate_success(data.error, status);
                if (validation == true) {
                    $('#plano_contas_mongo').trigger( 'reloadGrid' );;
                    alert("Registro inserido com sucesso");
                    $plano_contas.modalInstance.close();

                } else {
                    alert(validation);
                    $plano_contas.modalInstance.close();
                }
            });
        };
        $scope.cancel = function() {
            $plano_contas.modalInstance.dismiss('cancel');
        };

    }

});
