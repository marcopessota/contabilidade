var app = angular.module('app');

app.controller('folhaTrabalhoController', function($scope, $timeout, $http, $uibModal, S_vars) {
    var $folha_trabalho = this;
    $folha_trabalho.titulo = 'Dados da Folha de Trabalho';
    $folha_trabalho.handsontables = [];

    var container = document.getElementById('handsontable');
    $timeout(function() {
		// console.log($folha_trabalho.content_sheet);
        $folha_trabalho.handsontables.push(new Handsontable(container, {
            // data: JSON.parse($folha_trabalho.content_sheet),
            comments: true,
            startRows: 15,
            startCols: 20,
            minSpareRows: 1,
            rowHeaders: true,
            colHeaders: true,
            contextMenu: true,
            manualColumnResize: true,
            manualRowResize: true,
            formulas: true,
            // stretchH: 'all'
        }));
    }, 500);

    $folha_trabalho.tab_primario = 0;

    $folha_trabalho.setTab_primario = function(tabId) {
        $folha_trabalho.tab_primario = tabId;
    };

    $folha_trabalho.isSet_primario = function(tabId) {
        return $folha_trabalho.tab_primario === tabId;
    };

    $folha_trabalho.insert_note = function() {
        $folha_trabalho.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal_insert_note.html',
            scope: $scope
        });

        $scope.ok = function() {
            var obj_ajax = {};
            obj_ajax._f = 'cria_pasta_folha_trabalho';
            obj_ajax._p = {
            	tree_path: $folha_trabalho.tree_path,
                note_name: $folha_trabalho.note_name
            };
            $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            	$('#tree').jstree(true).refresh();
                // alert('Enviado para folha de trabalho com sucesso');
                $folha_trabalho.modalInstance.dismiss('cancel');
            });
        };
        $scope.cancel = function() {
            $folha_trabalho.modalInstance.dismiss('cancel');
        };
    };

    $folha_trabalho.salvar_folha_trabalho = function() {
    	var mydata = $folha_trabalho.handsontables[0].getData();
        mydata = JSON.stringify(mydata);

        var obj_ajax = {};
        obj_ajax._f = 'salva_folha_trabalho';
        obj_ajax._p = {
            mydata: mydata,
            tree_path: $folha_trabalho.tree_path
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            alert('Folha salva com sucesso!');
        });
    };

    $folha_trabalho.salvar_nota_trabalho = function() {
        var obj_ajax = {};
        obj_ajax._f = 'salva_nota_trabalho';
        obj_ajax._p = {
            mydata: $folha_trabalho.content_note,
            tree_path: $folha_trabalho.tree_path
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            alert('Nota salva com sucesso!');
        });
    };

    $('#tree').jstree({
	  "core" : {
	    "animation" : 0,
	    "check_callback" : true,
	    "themes" : { "stripes" : true },
	    'data': {
            'url': 'rep/fx.php?operation=get_node',
            'data': function(node) {
                return {
                    'id': node.id,
                };
            }
        }
	  },
	  "types" : {
	    "#" : {
	      "max_children" : 1, 
	      "max_depth" : 4, 
	      "valid_children" : ["root"]
	    },
	    "root" : {
	      "icon" : "/static/3.2.1/assets/images/tree_icon.png",
	      "valid_children" : ["default"]
	    },
	    "default" : {
	      "valid_children" : ["default","file"]
	    },
	    "file" : {
	      "icon" : "glyphicon glyphicon-file",
	      "valid_children" : []
	    }
	  },
	  "plugins" : [
	    "contextmenu", "dnd", "search",
	    "state", "types", "wholerow"
	  ]
	}).on('delete_node.jstree', function(e, data) {
        $.get('rep/fx.php?operation=delete_node', {
            'id': data.node.id
        })
            .fail(function() {
                data.instance.refresh();
            });
    })
    .on('create_node.jstree', function(e, data) {
        $.get('rep/fx.php?operation=create_node', {
            'type': data.node.type,
            'id': data.node.parent,
            'text': data.node.text
        })
            .done(function(d) {
                data.instance.set_id(data.node, d.id);
                // console.log(d.id);
                // $(this).jstree(true).set_id(obj.node, 42);
            })
            .fail(function() {
                data.instance.refresh();
            });
    })
    .on('rename_node.jstree', function(e, data) {
        $.get('rep/fx.php?operation=rename_node', {
            'id': data.node.id,
            'text': data.text
        })
            .done(function(d) {
                data.instance.set_id(data.node, d.id);
            })
            .fail(function() {
                data.instance.refresh();
            });
    })
    .on('move_node.jstree', function(e, data) {
        $.get('rep/fx.php?operation=move_node', {
            'id': data.node.id,
            'parent': data.parent
        })
            .done(function(d) {
                //data.instance.load_node(data.parent);
                data.instance.refresh();
            })
            .fail(function() {
                data.instance.refresh();
            });
    })
    .on('copy_node.jstree', function(e, data) {
        $.get('rep/fx.php?operation=copy_node', {
            'id': data.original.id,
            'parent': data.parent
        })
            .done(function(d) {
                //data.instance.load_node(data.parent);
                data.instance.refresh();
            })
            .fail(function() {
                data.instance.refresh();
            });
    })
    .on('changed.jstree', function(e, data) {
    	$folha_trabalho.tree_path = data.selected[0];

    	var obj_ajax = {};
        obj_ajax._f = 'get_tree_folder';
        obj_ajax._p = {
        	tree_path: $folha_trabalho.tree_path
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
        	$folha_trabalho.content_sheet = data.content_sheet;
        	$folha_trabalho.content_note = data.content_note;

        	if ($folha_trabalho.content_sheet != null) {
                $folha_trabalho.handsontables[0].loadData(JSON.parse($folha_trabalho.content_sheet));
        	}
        });
    });

});