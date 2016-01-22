var app = angular.module('app');

app.controller('diarioController', function($scope, $http, $timeout, S_vars, S_http_validate, S_fx, $uibModal) {
    var $diario = this;
    $diario.S_fx = S_fx;
    $diario.titulo = "Diario";
    $diario.action = "list";
    $diario.answers = "question";
    $diario.table_line = "";
    $diario.table_index = 0;
    $diario.date_selection_count_done = 0;
    $diario.selected = {};
    $diario.import_answers = {};
    $diario.questions = [];
    $diario.format_date = "";
    $diario.digit_cases = "";
    $diario.account_cases = "";
    $diario.case_table = "";
    $diario.active_case_table = {};

    $diario.model_range_min = 0;
    $diario.models = {};
    $diario.models.sheet_partidas = false;
    $diario.models.min = 0;
    $diario.slider_ratio = 0;

    $diario.teste= function(){
        console.log('a');
    }

    $scope.$watch('diarioCtrl.models.min', function() {
        if ($diario.case_table != "") {
            // console.log($diario.models.min, $diario.models.min * $diario.slider_ratio);
            $(".range_selected." + $diario.case_table).css("left", $diario.models.min * $diario.slider_ratio + "%");
            $diario.active_case_table[$diario.case_table] = true;
            $diario.import_answers[$diario.answers][$diario.case_table].min = $diario.models.min - 1;
        }

    });

    $scope.$watch('diarioCtrl.models.max', function() {
        if ($diario.case_table != "") {
            $(".range_selected." + $diario.case_table).css("right", ($diario.max_range_slider - $diario.models.max) * $diario.slider_ratio + "%");
            $diario.active_case_table[$diario.case_table] = true;
            $diario.import_answers[$diario.answers][$diario.case_table].max = $diario.models.max - 1;
        }
    });


    $diario.selection_remove = function() {
        $diario.active_case_table[$diario.case_table] = false;
        $diario.import_answers[$diario.answers][$diario.case_table].min = -1;
        $diario.import_answers[$diario.answers][$diario.case_table].max = -1;
        $diario.case_table = "";
    }

    $diario.set_answer = function(question, answer, next_question) {
        switch (next_question) {
            case "question0.1":
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                break;
            case "question0.1.1":
                waitingDialog.show('Aguarde um momento...');
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                $timeout(function() {
                    var holder_table_width = $(".preview_select_line.full").width();
                    $(".div_lines").css("width", holder_table_width + "px");
                    $(".preview_select_line.full").css({
                        "overflow": "auto",
                        "width": "75%"
                    });
                    waitingDialog.hide();
                }, 3000);
                break;
            case "question1.1":
                $diario.import_answers[question] = $diario.format_date;
                $diario.answers = next_question;
                break;
            case "question1.1.1":
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                break;
            case "question1.2":
                $diario.answers = next_question;
                break;
            case "question1.2.1":
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                break;
            case "question1.2.2":
                $diario.answers = next_question;
                break;
            case "question2.1":
                $diario.answers = next_question;
                if ($diario.line_numbers_date > 0) {
                    $diario.import_answers[question] = $diario.line_numbers_date;
                }
                break;
            case "question2.2":
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                break;
            case "question2.3":
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                break;
            case "question2.1.1":
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                break;
            case "question2.1.2":
                $diario.import_answers[question] = answer;
                $diario.answers = next_question;
                break;
            case "question3.1":
                if ($diario.digit_cases != "") {
                    $diario.import_answers[question] = $diario.digit_cases;
                }
                if ($diario.account_cases != "") {
                    $diario.import_answers[question] = $diario.account_cases;
                }

                $diario.answers = next_question;
                break;
            case "question4.1":
                $diario.answers = next_question;
                break;
            case "question_end":
                $diario.answers = next_question;
                break;
        }
        switch (next_question) {
            case "question0.1.1":
                $diario.import_answers[next_question] = {};
                $diario.import_answers[next_question].date = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].entry = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].account = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].debt_account = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].credit_account = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].value = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].debt_value = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].credit_value = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].concept = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].title = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].doc1 = {
                    "min": 0,
                    "max": 0
                };
                $diario.import_answers[next_question].doc2 = {
                    "min": 0,
                    "max": 0
                };
                break;
            case "question1.1.1":
            case "question2.3":
            case "question3.1":
            case "question4.1":
                $diario.import_answers[next_question] = {};
                $diario.import_answers[next_question].selections = [];
                $diario.import_answers[next_question].positions = [];
                $diario.table_line = $diario.preview_import_items[$diario.table_index];
                break;
        }
    }

    $diario.select_date_row = function() {
        if ($diario.selected_text == "") {
            alert("Seleção vazia");
        } else {
            console.log($diario.answers, $diario.import_answers[$diario.answers]);
            $diario.import_answers[$diario.answers].selections.push($diario.selected_text);
            $diario.import_answers[$diario.answers].positions.push($diario.get_position_string());
            $diario.selected_text = "";
            $diario.table_index += 3;
            $diario.date_selection_count_done++;
            $diario.table_line = $diario.preview_import_items[$diario.table_index];
            console.log($diario.answers, $diario.date_selection_count_done);
            if ($diario.date_selection_count_done == 3) {
                $diario.table_index = 0;
                $diario.date_selection_count_done = 0;
                if ($diario.answers == "question1.1.1") {
                    $diario.set_answer($diario.answer, '', 'question2.1');
                    return;
                }
                if ($diario.answers == "question2.3") {
                    $diario.set_answer($diario.answer, '', 'question3.1');
                    return;
                }
                if ($diario.answers == "question3.1") {
                    $diario.set_answer($diario.answer, '', 'question4.1');
                    return;
                }
                if ($diario.answers == "question4.1") {
                    $diario.set_answer($diario.answer, '', 'question_end');
                    return;
                }
                return;
            }
        }
    }

    $diario.get_position_string = function() {
        var obj = {};
        obj.start = $diario.table_line.indexOf($diario.selected_text);
        obj.end = obj.start + $diario.selected_text.length;
        return obj;

    }

    $diario.clear_selection_text = function() {
        $diario.table_index = 0;
        $diario.date_selection_count_done = 0;
        $diario.table_line = $diario.preview_import_items[$diario.table_index];
        $diario.import_answers[$diario.answers].selections = [];
        $diario.import_answers[$diario.answers].positions = [];
    }

    $diario.importar_diario = function(preview) {
        // console.log(S_http_validate);
        var obj_ajax = {};
        obj_ajax._f = "importar_diario";
        obj_ajax._p = {
            "answers": $diario.import_answers,
            "preview": preview
        };
        $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
            var validation = S_http_validate.validate_success(data.error, status);
            // if(validation == true){
            if (preview == true) {
                $diario.preview_import_items = data.value;
                $diario.max_range_slider = parseInt(data.range);
                $diario.models.max = parseInt(data.range);
                $diario.slider_ratio = 100 / $diario.models.max;
                $diario.action = "import";
            } else {
                alert(data.linhas + " importadas com sucesso");
            }
            // }else{
            // alert(validation);
            // }
        });
    }


    $diario.get_questions = function() {
        $diario.questions.push('A data do lançamento aparece em todas as linhas?');
        $diario.questions.push('Selecione na linha abaixo onde está o campo <b>data</b> e pressione "OK"? (Será necessário fazer essa ação 3 vezes)');
        $diario.questions.push('A data do lançamento aparece acima ou abaixo das linhas de registros?');
        $diario.questions.push('Quantas linhas a data está Acima/Abaixo dos registros?');
        $diario.questions.push('Selecione na linha abaixo onde está o campo <b>conta</b> e pressione "OK"? (Será necessário fazer essa ação 3 vezes)');
        $diario.questions.push('Selecione na linha abaixo onde está o campo <b>débito</b> e pressione "OK"? (Será necessário fazer essa ação 3 veze)');
        $diario.questions.push('Selecione na linha abaixo onde está o campo <b>crédito</b> e pressione "OK"? (Será necessário fazer essa ação 3 veze)');
    }

    $diario.usar_diario = function(){
        var currencyTemplate = {align: 'right', sorttype: 'number', editable: true,
        searchoptions: { sopt: ['eq', 'ne', 'lt', 'le', 'gt', 'ge', 'nu', 'nn', 'in', 'ni']},
        formatter: function (v) {
            return Globalize.format(Number(v), "c");
        },
        unformat: function (v) {
            return Globalize.parseFloat(v);
        }};
        var obj_ajax = {};
        obj_ajax._f = 'get_diario';
        obj_ajax._p = {
            a: 1
        };
        $("#diario_mongo").jqGrid({
            url: S_vars.url_ajax + 'ajax.php',
            datatype: "json",
            postData: obj_ajax,
            colModel:[
                {name:"Data", index:"date_alias", sorttype:"string"},
                {name:"Lançamento", index:"entry", sorttype:"int"},
                {name:"Conta", index:"account", sorttype: "string", formmater: "string"},
                {name:"Título", index:"entry", sorttype:"string"},
                {name:"Débito", index:"debt_value_alias", sorttype: "string",  formmater: "string"},
                {name:"Crédito", index:"credit_value_alias", sorttype: "string",  formmater: "string"},
                {name:"Conceito", index:"concept", sorttype:"string"}

            ],
            rowNum:30,
            rowList:[30, 50, 100, 1000],
            pager: '#pager_diario_mongo',
            sortname: 'accountt',
            viewrecords: true,
            multiselect: true,
            autowidth: true,
            height: 350,
            sortorder: "desc"
        }).navGrid("#pager2",{edit:false,add:false,del:false});

        $('#diario_mongo').jqGrid('filterToolbar',{"stringResult":true});
    };

    $diario.sendData = function() {
        $diario.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal_exporta_work_sheet.html',
            scope: $scope
        });

        $scope.ok = function() {
            var obj_ajax = {};
            obj_ajax._f = 'envia_folha_trabalho';
            obj_ajax._p = {
                rows: $diario.selected,
                values: $diario.models,

            };
            $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
                alert('Enviado para folha de trabalho com sucesso');
                $diario.modalInstance.dismiss('cancel');
            });
        };
        $scope.cancel = function() {
            $diario.modalInstance.dismiss('cancel');
        };

    }

    $diario.sped_import = function() {
        var obj_ajax = {};
        obj_ajax._f = "importar_sped";
        $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
            var validation = S_http_validate.validate_success(data.error, status);
            if (validation == true) {
                console.log(data);
            } else {
                alert(validation);
            }
        });
    }
});
