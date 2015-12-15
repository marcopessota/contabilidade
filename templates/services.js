var app = angular.module('app');

app.factory('S_http_validate', function(S_errors_message) {
	$http_validate = this;

	$http_validate.validate_success = function(data, status){
		if(status == 200){
			if(data == "no_error"){
				return true;
			}else{
				return S_errors_message.error(data);
			}
		}else{
			return S_errors_message.error(status);
		}
	};

	return $http_validate;
});

app.factory('S_errors_message', function() {
	$S_errors_message = this;

	$S_errors_message.e = {};
	$S_errors_message.e["500"] = "Script error (Internal Server Error)";
	$S_errors_message.e["404"] = "File not found";
	$S_errors_message.e["erro"] = "Script error";
	$S_errors_message.e["required_field"] = "Required Field";
	$S_errors_message.e["insert_DB"] = "Database command insert failed";
	$S_errors_message.e["duplicate"] = "Record duplicate";
	$S_errors_message.e["not_exists"] = "Record not exists";

	$S_errors_message.error = function(e){
		return $S_errors_message.e[e];
	}
	return $S_errors_message;
});


app.factory('S_vars', function() {
	$S_vars = this;

	$S_vars.url_ajax = "ws/";
	// $S_vars.id_business = "";
	$S_vars.id_business = "111";
	$S_vars.name_business = "";
	$S_vars.soft = false;

	return $S_vars;
});

app.factory('S_fx', function() {
	$S_fx = this;

	$S_fx.get_selection_text = function() {
      var text = "";
      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }

      return text;
    };

	return $S_fx;
});

app.factory('S_sort_table', function($filter) {
	$S_sort_table = this;

	$S_sort_table.table_obj = [];
	$S_sort_table.columns = [];
	$S_sort_table.columns_sort = [];

	$S_sort_table.init = function(){
		for(key in $S_sort_table.columns){
			$S_sort_table.columns_sort.push({column_name : $S_sort_table.columns[key], sortBy : 'sort'}); // can be, sort, sort-asc, sort-desc
		}
	};

	$S_sort_table.sort_column = function(column, table_array){
		var found_key = null;
		$.grep($S_sort_table.columns_sort, function(e, k){
			if(e.column_name == column){
				found_key = k;
			}
			return e.column_name == column;
		});

        if($S_sort_table.columns_sort[found_key]["sort"] == "sort-asc"){
        	$S_sort_table.columns_sort[found_key]["sort"] = "sort-desc";
        	return $filter('orderBy')(table_array, column, true);
        }else{
         	$S_sort_table.columns_sort[found_key]["sort"] = "sort-asc";
        	return $filter('orderBy')(table_array, column, false);
        }
	};

	$S_sort_table.get_sort = function(column){
		var found = $filter('filter')($S_sort_table.columns_sort, {'column_name' : column}, true);
		return found[0]["sort"];
	};

	return $S_sort_table;
});

app.factory('S_export', function() {
	$S_export = this;

	$S_export.do = function(id_dom, type){
		switch(type){
			case "excel":
				// var blob = new Blob([document.getElementById(id_dom).outerHTML], {type: "text/plain;charset=utf-8"});
				var blob = new Blob([document.getElementById(id_dom).outerHTML], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"});
				saveAs(blob, "Relatório.xls");
				break;
			case "txt":
				var blob = new Blob([document.getElementById(id_dom).outerHTML], {type: "text/plain;charset=utf-8"});
				saveAs(blob, "Relatório.txt");
				break;
		}
	};

	return $S_export;
});