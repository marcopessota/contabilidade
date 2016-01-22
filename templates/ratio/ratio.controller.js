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
    $ratio.click_mongo = function(){
        var currencyTemplate = {align: 'right', sorttype: 'number', editable: true,
        searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni']},
        formatter: function (v) {
            return Globalize.format(Number(v), "c");
        },
        unformat: function (v) {
            return Globalize.parseFloat(v);
        }};

        $("#list2").jqGrid({
            url:'templates/ratio/example.php?q=2',
            datatype: "json",
            colModel:[
                {name:"Accountt", index:"accountt", sorttype:"int"},
                {name:"Value", index:"value", sorttype: "string", formmater: "string"},
                {name:"Hist", index:"hist", sorttype: "string",  formmater: "string"}
            ],
            rowNum:30,
            rowList:[30, 50, 100, 1000],
            pager: '#pager2',
            sortname: 'accountt',
            viewrecords: true,
            multiselect: true,
            autowidth: true,
            height: 350,
            sortorder: "desc",
            caption:"Simple data manipulation"
        }).navGrid("#pager2",{edit:false,add:false,del:false});

        $('#list2').jqGrid('filterToolbar',{"stringResult":true});
    }


    $ratio.click = function(){
        var currencyTemplate = {align: 'right', sorttype: 'number', editable: true,
        searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni']},
        formatter: function (v) {
            return Globalize.format(Number(v), "c");
        },
        unformat: function (v) {
            return Globalize.parseFloat(v);
        }};

        $("#list").jqGrid({
            url:'templates/ratio/example.php?q=2',
            datatype: "json",
            colModel:[
                {name:"OrderID", index:"id", sorttype:"int",key:true,editable:true},
                {name:"OrderDate", index:"invdate", sorttype:"datetime",formatter:"date",
                    formatoptions:{srcformat:"Y-m-d H:i:s",newformat:"m/d/Y"},
                    search:false,editable:true
                },
                {name:"Amount", index:"Amount", sorttype: "string",  formmater: "string" , classes :"ui-ellipsis"}
            ],
            rowNum:10,
            rowList:[10,20,30],
            pager: '#pager',
            sortname: 'id',
            viewrecords: true,
            sortorder: "desc",
            caption:"Simple data manipulation",
            editurl:"someurl.php"
        }).navGrid("#pager",{edit:false,add:false,del:false});

        
        // Toolbar searching
        $('#list').jqGrid('filterToolbar',{"stringResult":true});

        // $("#list").jqGrid({
        //     url: "templates/ratio/example.php",
        //     datatype: "xml",
        //     mtype: "GET",
        //     colNames: ["Inv No", "Date", "Amount", "Tax", "Total", "Notes"],
        //     colModel: [
        //         { name: "invid", width: 55, "editable":true},
        //         { name: "invdate", width: 90 },
        //         { name: "amount", width: 80, align: "right" },
        //         { name: "tax", width: 80, align: "right" },
        //         { name: "total", width: 80, align: "right" },
        //         { name: "note", width: 150, sortable: false }
        //     ],
        //     pager: "#pager",
        //     rowNum: 10,
        //     height:200,
        //     autowidth:true,
        //     rowList: [10, 20, 30],
        //     sortname: "invid",
        //     sortorder: "desc",
        //     viewrecords: true,
        //     gridview: true,
        //     autoencode: true,
        //     caption: "My first grid"
        // }); 
    }

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
