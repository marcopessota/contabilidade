var app = angular.module('app');

app.factory('S_http_validate', ['S_errors_message', function(S_errors_message) {
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
}]);

app.factory('S_errors_message', [function() {
	$S_errors_message = this;

	$S_errors_message.e = {};
	$S_errors_message.e["500"] = "Script error (Internal Server Error)";
	$S_errors_message.e["404"] = "File not found";
	$S_errors_message.e["erro"] = "Script error";
	$S_errors_message.e["required_field"] = "Required Field";

	$S_errors_message.error = function(e){
		return $S_errors_message.e[e];
	}
	return $S_errors_message;
}]);



app.factory('S_vars', [function() {
	$S_vars = this;

	$S_vars.url_ajax = "ws/";

	return $S_vars;
}]);