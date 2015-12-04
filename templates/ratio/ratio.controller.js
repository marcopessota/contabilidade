var app = angular.module('app');

app.controller('ratioController', function($scope, $http, S_vars, $sce, $uibModal, S_http_validate) {
    var $ratio = this;
    $ratio.titulo = "Indicador Economico Financeiro";

    $ratio.formula = "";
    $ratio.formula_preview = "";
    $ratio.arr_formula = [];
    $ratio.selected_line = {};
    // $ratio.busca = ;
    // $ratio.arr_formula.push(500);
    // $ratio.arr_formula.push("*");
    // $ratio.arr_formula.push(10);
    // $ratio.arr_formula.push("-");
    // $ratio.arr_formula.push(500);
    // $ratio.arr_formula.push("*");
    // $ratio.arr_formula.push(5);

    $ratio.add_variable = function(type, value) {
        console.log(type);

        if (type == "field") {
            // $ratio.formula += value;
            if (value == "chart_account") {
                $ratio.title = "Editar";
                $ratio.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal_chart_account.html',
                    scope: $scope,
                    size: 'lg'
                });

                $ratio.modalInstance.rendered.then(function() {
                    var obj_ajax = {};
                    obj_ajax._f = "get_balanco_modal";
                    $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
                        var validation = S_http_validate.validate_success(data.error, status);
                        if (validation == true) {
                            $ratio.itens = data.data;
                        } else {
                            alert(validation);
                        }
                    });
                });
                $scope.ok = function() {
                    $ratio.formula += $ratio.selected_line.desc_account;
                    $ratio.formula_preview += $ratio.selected_line.outstanding_balance_sum;
                    $ratio.arr_formula.push($ratio.selected_line.outstanding_balance_sum);
                    $ratio.selected_line = {};
                    $ratio.modalInstance.close();

                };
                $scope.cancel = function() {
                    $ratio.modalInstance.dismiss('cancel');
                };
            }
            if (value == "number_field") {
                $ratio.title = "Editar";
                $ratio.modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modal_chart_number.html',
                    scope: $scope
                });
                $scope.ok = function() {
                    $ratio.formula += $ratio.valor_reais;
                    $ratio.formula_preview += $ratio.valor_reais;
                    $ratio.arr_formula.push($ratio.valor_reais);
                    $ratio.valor_reais = "";
                    $ratio.selected_line = {};
                    $ratio.modalInstance.close();

                };
                $scope.cancel = function() {
                    $ratio.valor_reais = "";
                    $ratio.modalInstance.dismiss('cancel');
                };
            }
        }

        if (type == "operator") {
            $ratio.formula += " <b>" + value + "</b> ";
            $ratio.formula_preview += value;
            $ratio.arr_formula.push(value);
        }

        if (type == "clear") {
            $ratio.formula = "";
            $ratio.formula_preview = "";
            $ratio.arr_formula = [];
        }
    }

    $ratio.insert_edit_ratio = function() {
        $ratio.modalInstance2 = $uibModal.open({
            animation: true,
            templateUrl: 'insert_edit_ratio.html',
            scope: $scope,
            size: 'lg'
        });

        $ratio.ok = function() {
          	alert("halala");
            $ratio.modalInstance2.close();

        };
        $ratio.cancel = function() {
         	$ratio.modalInstance2.dismiss('cancel');
        };

    }

    $ratio.calculate = function() {
        // console.log($ratio.formula);
        $ratio.result = eval($ratio.formula_preview);
        // console.log($ratio.arr_formula);

        // for(arr_cont = $ratio.arr_formula.length; arr_cont >= 0; arr_cont--){
        // 	if($ratio.arr_formula[arr_cont] == "/"){
        // 		$ratio.arr_formula[arr_cont - 1] = $ratio.arr_formula[arr_cont - 1] / $ratio.arr_formula[arr_cont + 1];
        // 		$ratio.arr_formula.splice(arr_cont + 1, 1);
        // 		$ratio.arr_formula.splice(arr_cont, 1);
        // 	}else if($ratio.arr_formula[arr_cont] == "*"){
        // 		$ratio.arr_formula[arr_cont - 1] = $ratio.arr_formula[arr_cont - 1] * $ratio.arr_formula[arr_cont + 1];
        // 		$ratio.arr_formula.splice(arr_cont + 1, 1);
        // 		$ratio.arr_formula.splice(arr_cont, 1);
        // 	}
        // }
        // for(arr_cont = $ratio.arr_formula.length; arr_cont >= 0; arr_cont--){
        // 	if($ratio.arr_formula[arr_cont] == "+"){
        // 		$ratio.arr_formula[arr_cont - 1] = $ratio.arr_formula[arr_cont - 1] + $ratio.arr_formula[arr_cont + 1];
        // 		$ratio.arr_formula.splice(arr_cont + 1, 1);
        // 		$ratio.arr_formula.splice(arr_cont, 1);
        // 	}else if($ratio.arr_formula[arr_cont] == "-"){
        // 		$ratio.arr_formula[arr_cont - 1] = $ratio.arr_formula[arr_cont - 1] - $ratio.arr_formula[arr_cont + 1];
        // 		$ratio.arr_formula.splice(arr_cont + 1, 1);
        // 		$ratio.arr_formula.splice(arr_cont, 1);
        // 	}
        // }
        // console.log($ratio.arr_formula);
    }

});
