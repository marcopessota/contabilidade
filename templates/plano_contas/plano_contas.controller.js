var app = angular.module('app');

app.controller('planoContasController', function($scope, $timeout, $http, S_vars) {
    var $plano_contas = this;
    $plano_contas.titulo = 'Plano de contas';

    $plano_contas.angularWayChangeDataCtrl = function($scope, ngDialog, S_http_validate, $http, $resource, DTOptionsBuilder, DTColumnDefBuilder, $uibModal, $log) {
        var vm = this;

        get_chart_account();

        // vm.persons = $resource('templates/plano_contas/data1.json').query();


        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notVisible()
        ];

        vm.dtInstance = {};

        vm.itemAdd = {};
        vm.itemAdd.account = "";
        vm.itemAdd.desc = "";

        function get_chart_account() {
            var obj_ajax = {};
            obj_ajax._f = "get_chart_account";
            $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                var validation = S_http_validate.validate_success(data.error, status);
                // if(validation == true){
                vm.items = data;
                // }
            });
        }

        vm.add_chart_account = function() {
            vm.title = "Incluir";
            vm.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modal_chart_account.html',
                scope: $scope
            });

            $scope.ok = function() {
                var obj_ajax = {};
                obj_ajax._f = "crud_chart_account";
                obj_ajax._p = vm.itemAdd;
                obj_ajax._p.action = "add";
                $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                    var validation = S_http_validate.validate_success(data.error, status);
                    if (validation == true) {
                        get_chart_account();
                        alert("Registro inserido com sucesso");
                        vm.modalInstance.close();

                    } else {
                        alert(validation);
                        vm.modalInstance.close();
                    }
                });
            };
            $scope.cancel = function() {
                vm.modalInstance.dismiss('cancel');
            };

        }

        vm.modify_chart_account = function(index) {
            vm.title = "Editar";
            vm.itemAdd = {};
            vm.itemAdd.account = vm.items[index].account;
            vm.itemAdd.desc = vm.items[index].desc;
            if (S_vars.soft == true) {
                vm.itemAdd.id = vm.items[index].id;
            } else {
                vm.itemAdd.id = vm.items[index]._id.$id;
            }
            vm.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modal_chart_account.html',
                scope: $scope
            });

            $scope.ok = function() {
                var obj_ajax = {};
                obj_ajax._f = "crud_chart_account";
                obj_ajax._p = vm.itemAdd;
                obj_ajax._p.action = "edit";
                $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                    var validation = S_http_validate.validate_success(data.error, status);
                    if (validation == true) {
                        get_chart_account()
                        alert("Registro alterado com sucesso");
                        vm.modalInstance.close();
                    } else {
                        vm.dtInstance.rerender();
                        alert(validation);
                        vm.modalInstance.close();
                    }
                });
            };
            $scope.cancel = function() {
                vm.modalInstance.dismiss('cancel');
            };
        }

        vm.remove_chart_account = function(index) {
            vm.itemAdd = {};
            if (S_vars.soft == true) {
                vm.itemAdd.id = vm.items[index].id;
            } else {
                vm.itemAdd.id = vm.items[index]._id.$id;
            }


            var dialog = ngDialog.open({
                template: 'templates/default/remove.html'
            });

            dialog.closePromise.then(function(data) {
                if (data.value == true) {
                    var obj_ajax = {};
                    obj_ajax._f = "crud_chart_account";
                    obj_ajax._p = vm.itemAdd;
                    obj_ajax._p.action = "remove";
                    $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                        var validation = S_http_validate.validate_success(data.error, status);
                        if (validation == true) {
                            get_chart_account()
                            alert("Registro removido com sucesso");
                        } else {
                            vm.dtInstance.rerender();
                            alert(validation);
                        }
                    });
                }
            });

        }
    };



});
