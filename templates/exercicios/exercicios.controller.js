var app = angular.module('app');

app.controller('exerciciosController', function($scope, $timeout, $http, S_vars) {
    var $exercicios = this;
    $exercicios.titulo = "Exercícios";

    $exercicios.angularWayChangeDataCtrl = function($scope, ngDialog, S_http_validate, $http, $resource, DTOptionsBuilder, DTColumnDefBuilder, $uibModal, $log) {
        var vm = this;

        get_exercicio();

        vm.dtOptions = DTOptionsBuilder.newOptions().withPaginationType('full_numbers').withLanguageSource('lib/js/pt-br.json');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0).withOption('width', '10%'),
            DTColumnDefBuilder.newColumnDef(1).notSortable().withOption('width', '90%'),
            DTColumnDefBuilder.newColumnDef(2).notVisible()
        ];

        vm.dtInstance = {};

        vm.itemAdd = {};
        vm.itemAdd.account = "";
        vm.itemAdd.desc = "";

        function get_exercicio() {
            var obj_ajax = {};
            obj_ajax._f = "get_exercicio";
            $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                var validation = S_http_validate.validate_success(data.error, status);
                // if(validation == true){
                vm.items = data;
                // }
            });
        }

        vm.add_exercicio = function() {
            vm.title = "Incluir";
            vm.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modal_exercicio.html',
                scope: $scope
            });

            $scope.ok = function() {
                var obj_ajax = {};
                obj_ajax._f = "crud_exercicio";
                obj_ajax._p = vm.itemAdd;
                obj_ajax._p.action = "add";
                $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                    var validation = S_http_validate.validate_success(data.error, status);
                    if (validation == true) {
                        get_exercicio();
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

        vm.modify_exercicio = function(index) {
            vm.title = "Editar";
            vm.itemAdd = {};
            vm.itemAdd.nome = vm.items[index].nome;
            if (S_vars.soft == true) {
                vm.itemAdd.id = vm.items[index].id;
            } else {
                vm.itemAdd.id = vm.items[index]._id.$id;
            }
            vm.modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modal_exercicio.html',
                scope: $scope
            });

            $scope.ok = function() {
                var obj_ajax = {};
                obj_ajax._f = "crud_exercicio";
                obj_ajax._p = vm.itemAdd;
                obj_ajax._p.action = "edit";
                $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                    var validation = S_http_validate.validate_success(data.error, status);
                    if (validation == true) {
                        get_exercicio()
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

        vm.remove_exercicio = function(index) {
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
                    obj_ajax._f = "crud_exercicio";
                    obj_ajax._p = vm.itemAdd;
                    obj_ajax._p.action = "remove";
                    $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                        var validation = S_http_validate.validate_success(data.error, status);
                        if (validation == true) {
                            get_exercicio()
                            alert("Registro removido com sucesso");
                        } else {
                            vm.dtInstance.rerender();
                            alert(validation);
                        }
                    });
                }
            });
        }

        vm.select_exercicio = function(index) {
            S_vars.id_business = vm.items[index]._id.$id;
            S_vars.name_business = vm.items[index].nome;
        }
    };

});