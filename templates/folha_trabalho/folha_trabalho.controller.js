var app = angular.module('app');

app.controller('folhaTrabalhoController', function($scope, $timeout, $http, $uibModal, S_vars) {
    var $folha_trabalho = this;
    $folha_trabalho.titulo = 'Dados da Folha de Trabalho';
    $folha_trabalho.handsontables = [];
    $folha_trabalho.handsontable_selected = [];

    // Manipulação das Tabs Primário
    $folha_trabalho.tab_primario = 0;

    $folha_trabalho.setTab_primario = function(tabId) {
        $folha_trabalho.tab_primario = tabId;
    };

    $folha_trabalho.isSet_primario = function(tabId) {
        return $folha_trabalho.tab_primario === tabId;
    };

    // Manipulação das Tabs
    $folha_trabalho.tab = 0;
    $folha_trabalho.tabs = [];
    $folha_trabalho.first_tab = true;
    $folha_trabalho.textAngular = '<ul><ul>';

    $folha_trabalho.setTab = function(tabId) {
        $folha_trabalho.tab = tabId;
    };

    $folha_trabalho.isSet = function(tabId) {
        return $folha_trabalho.tab === tabId;
    };

    $folha_trabalho.addTab = function() {
        var prox = $folha_trabalho.tabs.length;

        if ($folha_trabalho.first_tab == true) {
            nome_folha_trabalho = 'Folha de Trabalho 1';
            $folha_trabalho.first_tab = false;
        } else {
            var nome_folha_trabalho = prompt('Insira o nome da Folha de Trabalho:');
        }

        mydata = '[[]]';

        var obj_ajax = {};
        obj_ajax._f = 'salva_folha_trabalho';
        obj_ajax._p = {
            mydata: mydata,
            nome_folha_trabalho: nome_folha_trabalho
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            $('#tree').jstree(true).refresh();

            $folha_trabalho.tabs.push({
                id: prox,
                id_caminho: data,
                nome_folha_trabalho: nome_folha_trabalho
            });

            $timeout(function() {
                var container = document.getElementById('handsontable_' + data);

                $folha_trabalho.handsontables.push(new Handsontable(container, {
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

                $folha_trabalho.handsontables[$folha_trabalho.handsontables.length - 1].updateSettings({
                    beforeKeyDown: function(e) {
                        // $folha_trabalho.textAngular += String.fromCharCode(e.keyCode);
                        // console.log(this.getDataAtCell($folha_trabalho.handsontable_selected_row, $folha_trabalho.handsontable_selected_column));
                        // console.log($folha_trabalho.handsontable_selected_row);
                    },
                    afterSelection: function(row, column) {
                        // if (column == 0) {
                        //     var texto = this.getDataAtCell($folha_trabalho.handsontable_selected_row, $folha_trabalho.handsontable_selected_column);
                        //     $folha_trabalho.handsontable_selected_row = row;
                        //     $folha_trabalho.handsontable_selected_column = column;
                        // }
                        // // console.log(texto);
                        // if (texto != null) {
                        //     // $('#' + row).remove();
                        //     var text_edit_html_obj = $.parseHTML($folha_trabalho.textAngular);
                        //     $(text_edit_html_obj).append('<li id="' + $folha_trabalho.handsontable_selected_row + '">' + texto + '</li>');
                        //     $folha_trabalho.textAngular = $(text_edit_html_obj).prop('outerHTML');
                        // }
                        // $folha_trabalho.insert_note(row, column);
                        $folha_trabalho.selected_row = row;
                        $folha_trabalho.selected_column = column;
                    },
                    afterChange: function(changes, source) {
                        // if (changes[0][1] == 0) {
                        //     var text_edit_html_obj = $.parseHTML($folha_trabalho.textAngular);
                        //     $(text_edit_html_obj).find('#' + changes[0][0]).remove();
                        //     $(text_edit_html_obj).append('<li id="' + changes[0][0] + '">' + changes[0][3] + '</li>');
                        //     $folha_trabalho.textAngular = $(text_edit_html_obj).prop('outerHTML');
                        // }
                    }
                });
            }, 500);
        });
    };
    // Fim Manipulação das Tabs

    $folha_trabalho.insert_note = function(row, column) {
        var texto = $folha_trabalho.handsontables[$folha_trabalho.tab].getDataAtCell(row, column);
        $folha_trabalho.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal_textAngular.html',
            scope: $scope,
            size: 'lg'
        });

        $folha_trabalho.modalInstance.rendered.then(function() {
            return false;
            var obj_ajax = {};
            obj_ajax._f = 'busca_nota_folha_trabalho';
            obj_ajax._p = {
                row: row,
                column: column
            };
            $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
                alert('Sucesso!!!');
            });
        });
        $scope.ok = function() {
            $folha_trabalho.modalInstance.close();

        };
        $scope.cancel = function() {
            $folha_trabalho.modalInstance.dismiss('cancel');
        };
    };

    $folha_trabalho.inserir_nota_folha = function(id_caminho) {
        console.log($folha_trabalho.selected_row);
        console.log($folha_trabalho.selected_column);
        // var texto = $folha_trabalho.handsontables[$folha_trabalho.tab].getDataAtCell(row, column);
        $folha_trabalho.modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'modal_textAngular.html',
            scope: $scope,
            size: 'lg'
        });

        $folha_trabalho.modalInstance.rendered.then(function() {
            var container = document.getElementById('handsontable__');

            $folha_trabalho.handsontables.push(new Handsontable(container, {
                comments: true,
                startRows: 15,
                startCols: 10,
                minSpareRows: 1,
                rowHeaders: true,
                colHeaders: true,
                contextMenu: true,
                manualColumnResize: true,
                manualRowResize: true,
                formulas: true,
                // stretchH: 'all'
            }));
            return false;
            var obj_ajax = {};
            obj_ajax._f = 'busca_nota_folha_trabalho';
            obj_ajax._p = {
                row: row,
                column: column
            };
            $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
                alert('Sucesso!!!');
            });
        });
        $scope.ok = function() {
            $folha_trabalho.modalInstance.close();

        };
        $scope.cancel = function() {
            $folha_trabalho.modalInstance.dismiss('cancel');
        };
    };

    $folha_trabalho.exportar_folha_trabalho = function(tab) {
        var instance = $folha_trabalho.handsontables[tab];
        handsontable2csv.download(instance, "filename.csv");
    };

    $folha_trabalho.iniciar_folha_trabalho = function(tab) {
        $folha_trabalho.addTab();
    };

    $folha_trabalho.salvar_folha_trabalho = function(tab, nome) {
        var mydata = $folha_trabalho.handsontables[tab].getData();
        mydata = JSON.stringify(mydata);

        var obj_ajax = {};
        obj_ajax._f = 'salva_folha_trabalho';
        obj_ajax._p = {
            mydata: mydata,
            nome_folha_trabalho: nome
        };
        $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
            alert('Nota salva com sucesso!');
            $('#tree').jstree(true).refresh();
        });
    };

    $('#tree')
        .jstree({
            'core': {
                'data': {
                    'url': 'rep/fx.php?operation=get_node',
                    'data': function(node) {
                        return {
                            'id': node.id,
                        };
                    }
                },
                'check_callback': function(o, n, p, i, m) {
                    if (m && m.dnd && m.pos !== 'i') {
                        return false;
                    }
                    if (o === "move_node" || o === "copy_node") {
                        if (this.get_node(n).parent === this.get_node(p).id) {
                            return false;
                        }
                    }
                    return true;
                },
                'force_text': true,
                'themes': {
                    'responsive': false,
                    'variant': 'small',
                    'stripes': true
                }
            },
            'sort': function(a, b) {
                return this.get_type(a) === this.get_type(b) ? (this.get_text(a) > this.get_text(b) ? 1 : -1) : (this.get_type(a) >= this.get_type(b) ? 1 : -1);
            },
            'contextmenu': {
                'items': function(node) {
                    var tmp = $.jstree.defaults.contextmenu.items();
                    delete tmp.create.action;
                    tmp.create.label = "New";
                    tmp.create.submenu = {
                        "create_folder": {
                            "separator_after": true,
                            "label": "Folder",
                            "action": function(data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, {
                                    type: "default"
                                }, "last", function(new_node) {
                                    setTimeout(function() {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                            }
                        },
                        "create_file": {
                            "label": "File",
                            "action": function(data) {
                                var inst = $.jstree.reference(data.reference),
                                    obj = inst.get_node(data.reference);
                                inst.create_node(obj, {
                                    type: "file"
                                }, "last", function(new_node) {
                                    setTimeout(function() {
                                        inst.edit(new_node);
                                    }, 0);
                                });
                            }
                        }
                    };
                    if (this.get_type(node) === "file") {
                        delete tmp.create;
                    }
                    return tmp;
                }
            },
            'types': {
                'default': {
                    'icon': 'folder'
                },
                'file': {
                    'valid_children': [],
                    'icon': 'file'
                }
            },
            'unique': {
                'duplicate': function(name, counter) {
                    return name + ' ' + counter;
                }
            },
            'plugins': ['state', 'dnd', 'sort', 'types', 'contextmenu', 'unique']
        })
        .on('delete_node.jstree', function(e, data) {
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
            if (data.node) {
                var id_caminho = data.node.original.id_caminho;
            }
            var nome_arquivo = data.selected[0];

            var obj_ajax = {};
            obj_ajax._f = 'carrega_folha_trabalho';
            obj_ajax._p = {nome_arquivo: nome_arquivo, id_caminho: id_caminho};
            $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
                if (data != "can't open file") {
                    var prox = $folha_trabalho.tabs.length;

                    // Variável para mostrar ou não a reticências
                    if (obj_ajax._p.length > 15) {
                        var mostra_reticencias = true;
                    } else {
                        var mostra_reticencias = false;
                    }

                    // Verifica se existe a folha de trabalho já aberta
                    for (var i = 0; i < $folha_trabalho.tabs.length; i++) {
                        if ($folha_trabalho.tabs[i].nome == obj_ajax._p) {
                            alert('Folha de Trabalho já aberta');
                            return false;
                        }
                    }

                    // Senão abre esta folha
                    $folha_trabalho.tabs.push({
                        id: prox,
                        id_caminho: data.caminho,
                        nome: obj_ajax._p.nome_arquivo,
                        mostra_reticencias: mostra_reticencias
                    });

                    $timeout(function() {
                        var container = document.getElementById('handsontable_' + data.caminho);

                        $folha_trabalho.handsontables.push(new Handsontable(container, {
                            // data: data,
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

                        $folha_trabalho.handsontables[$folha_trabalho.handsontables.length - 1].updateSettings({
                            afterSelection: function(row, column) {
                                $folha_trabalho.selected_row = row;
                                $folha_trabalho.selected_column = column;
                            }
                        });

                        var data_handsontable = JSON.parse(data.data);
                        $folha_trabalho.handsontables[$folha_trabalho.tabs.length - 1].loadData(data_handsontable);
                        $folha_trabalho.setTab($folha_trabalho.tabs.length - 1);
                    }, 100);
                }
            });
        });

    $folha_trabalho.iniciar_folha_trabalho();
});