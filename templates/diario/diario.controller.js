var app = angular.module('app');

app.controller('diarioController', function($scope, $http, S_vars, S_http_validate, S_fx) {
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
	

	$diario.set_answer = function(question, answer, next_question){
		switch(next_question){
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
				if($diario.line_numbers_date > 0){
					$diario.import_answers[question] = $diario.line_numbers_date;
				}
				break;
			case "question3.1":
				$diario.answers = next_question;
				break;
			case "question4.1":
				$diario.answers = next_question;
				break;
		}
		switch(next_question){
			case "question1.1.1":
			case "question2.1":
			case "question3.1":
			case "question4.1":
				$diario.import_answers[next_question] = {};
				$diario.import_answers[next_question].selections = [];
				$diario.import_answers[next_question].positions = [];
				$diario.table_line = $diario.preview_import_items[$diario.table_index];
				break;
		}
		console.log($diario.answers);
	}

	$diario.select_date_row = function(){
		if($diario.selected_text == ""){
			alert("Seleção vazia");
		}else{
			console.log($diario.answers, $diario.import_answers[$diario.answers]);
			$diario.import_answers[$diario.answers].selections.push($diario.selected_text);
			$diario.import_answers[$diario.answers].positions.push($diario.get_position_string());
			$diario.selected_text = "";
			$diario.table_index += 3;
			$diario.date_selection_count_done++;
			$diario.table_line = $diario.preview_import_items[$diario.table_index];
			console.log($diario.answers, $diario.date_selection_count_done);
			if($diario.date_selection_count_done == 3){
				$diario.table_index = 0;
				$diario.date_selection_count_done = 0;
				if($diario.answers == "question1.1.1"){
					$diario.set_answer($diario.answer, '', 'question2.1');
					return;
				}
				if($diario.answers == "question2.1"){
					$diario.set_answer($diario.answer, '', 'question3.1');
					return;
				}
				if($diario.answers == "question3.1"){
					$diario.set_answer($diario.answer, '', 'question4.1');
					return;
				}
				if($diario.answers == "question4.1"){
					$diario.set_answer($diario.answer, '', 'question_end');
					return;
				}
				return;
			}
		}
	}

	$diario.get_position_string = function(){
		var obj = {};
		obj.start = $diario.table_line.indexOf($diario.selected_text);
		obj.end = obj.start + $diario.selected_text.length;
		return obj;

	}

	$diario.clear_selection_text = function(){
		$diario.table_index = 0;
		$diario.date_selection_count_done = 0;
		$diario.table_line = $diario.preview_import_items[$diario.table_index];
		$diario.import_answers[$diario.answers].selections = [];
		$diario.import_answers[$diario.answers].positions = [];
	}

	$diario.importar_diario = function(){
		console.log(S_http_validate);
		var obj_ajax = {};
		obj_ajax._f = "importar_diario";
		obj_ajax._p = {"a" : 1};
		$http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
			var validation = S_http_validate.validate_success(data.error, status);
			if(validation == true){
				$diario.preview_import_items = data.value;
				$diario.action = "import";
            }else{
            	alert(validation);
            }
        });
	}


	$diario.ServerSideProcessingCtrl = function($compile, $scope, $resource, DTOptionsBuilder, DTColumnBuilder) {
		var vm = this;
		vm.selectAll = false;
		$diario.toggleAll = toggleAll;
		$diario.toggleOne = toggleOne;

		var titleHtml = '<input type="checkbox" ng-model="diarioCtrl.selectAll" ng-click="diarioCtrl.toggleAll(diarioCtrl.selectAll, diarioCtrl.selected)">';



		vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
			return $resource('templates/diario/data.json').query().$promise;
		})
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
					$diario.selected[full.id] = false;
					return '<input type="checkbox" ng-model="diarioCtrl.selected[' + data.id + ']" ng-click="diarioCtrl.toggleOne(diarioCtrl.selected)">';
				}),
			DTColumnBuilder.newColumn('id').withTitle('ID'),
			DTColumnBuilder.newColumn('firstName').withTitle('First name'),
			DTColumnBuilder.newColumn('lastName').withTitle('Last name').notVisible()
		];
		function toggleAll (selectAll, selectedItems) {
		for (var id in selectedItems) {
			if (selectedItems.hasOwnProperty(id)) {
				selectedItems[id] = selectAll;
			}
		}
		}
		function toggleOne (selectedItems) {
			for (var id in selectedItems) {
				if (selectedItems.hasOwnProperty(id)) {
					if(!selectedItems[id]) {
						vm.selectAll = false;
						return;
					}
				}
			}
			vm.selectAll = true;
		}
	}
});