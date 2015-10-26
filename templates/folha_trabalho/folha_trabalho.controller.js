var app = angular.module('app');

app.controller('folhaTrabalhoController', function($scope, $timeout, $http, S_vars) {
    var $folha_trabalho = this;
    $folha_trabalho.titulo = 'Folhas de Trabalho';
    $folha_trabalho.handsontables = [];
    $folha_trabalho.treeVisible = false;

    // Manipulação das Tabs
    $folha_trabalho.tab = 0;
    $folha_trabalho.tabs = [];

    // $folha_trabalho.images_folha_trabalho = [{
    //     thumb: 'thumb/image1.jpg',
    //     small: 'small/image1.jpg'
    // }, {
    //     thumb: 'thumb/image2.jpg',
    //     small: 'small/image2.jpg'
    // }, {
    //     thumb: 'thumb/image3.jpg',
    //     small: 'small/image3.jpg'
    // }, {
    //     thumb: 'thumb/image4.jpg',
    //     small: 'small/image4.jpg'
    // }, {
    //     thumb: 'thumb/image5.jpg',
    //     small: 'small/image5.jpg'
    // }];

    $folha_trabalho.setTab = function(tabId) {
        $folha_trabalho.tab = tabId;
    };

    $folha_trabalho.isSet = function(tabId) {
        return $folha_trabalho.tab === tabId;
    };

    $folha_trabalho.addTab = function() {
        var prox = $folha_trabalho.tabs.length;

        $folha_trabalho.tabs.push({
            id: prox
        });

        $timeout(function() {
            var container = document.getElementById('handsontable_' + prox);

            $folha_trabalho.handsontables.push(new Handsontable(container, {
                // data: data,
                // minSpareRows: 1,
                comments: true,
                startRows: 10,
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
        }, 100);
    };
    // Fim Manipulação das Tabs

    $folha_trabalho.setTreeVisible = function() {
        $folha_trabalho.treeVisible = !$folha_trabalho.treeVisible;
    };

    $folha_trabalho.exportar_folha_trabalho = function(tab) {
        var instance = $folha_trabalho.handsontables[tab];
        handsontable2csv.download(instance, "filename.csv");
    };

    $folha_trabalho.iniciar_folha_trabalho = function(tab) {
        $folha_trabalho.addTab();
    };

    $folha_trabalho.salvar_folha_trabalho = function(tab) {
        var nome_folha_trabalho = prompt('Insira o nome da Folha de Trabalho');

        if (nome_folha_trabalho != null) {
            var mydata = $folha_trabalho.handsontables[tab].getData();
            mydata = JSON.stringify(mydata);

            var obj_ajax = {};
            obj_ajax._f = 'salva_folha_trabalho';
            obj_ajax._p = {
                mydata: mydata,
                nome_folha_trabalho: nome_folha_trabalho
            };
            $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
                alert('Nota salva com sucesso!');
                $('#tree').jstree(true).refresh();
            });
        }
    };

    $('#tree')
        .jstree({
            'core': {
                'data': {
                    'url': 'rep/fx.php?operation=get_node',
                    'data': function(node) {
                        return {
                            'id': node.id
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
            var data = data.selected[0];

            var obj_ajax = {};
            obj_ajax._f = 'carrega_folha_trabalho';
            obj_ajax._p = data;
            $http.post(S_vars.url_ajax + 'ajax.php', obj_ajax).success(function(data, status) {
                // var data = JSON.parse(data);
                $folha_trabalho.handsontables[$folha_trabalho.tab].loadData(data);
            });

            // if (data && data.selected && data.selected.length) {
            //     $.get('rep/fx.php?operation=get_content&id=' + data.selected.join(':'), function(d) {
            //         if (d && typeof d.type !== 'undefined') {
            //             $('#data .content').hide();
            //             switch (d.type) {
            //                 case 'text':
            //                 case 'txt':
            //                 case 'md':
            //                 case 'htaccess':
            //                 case 'log':
            //                 case 'sql':
            //                 case 'php':
            //                 case 'js':
            //                 case 'json':
            //                 case 'css':
            //                 case 'html':
            //                     $('#data .code').show();
            //                     $('#code').val(d.content);
            //                     break;
            //                 case 'png':
            //                 case 'jpg':
            //                 case 'jpeg':
            //                 case 'bmp':
            //                 case 'gif':
            //                     $('#data .image img').one('load', function() {
            //                         $(this).css({
            //                             'marginTop': '-' + $(this).height() / 2 + 'px',
            //                             'marginLeft': '-' + $(this).width() / 2 + 'px'
            //                         });
            //                     }).attr('src', d.content);
            //                     $('#data .image').show();
            //                     break;
            //                 default:
            //                     $('#data .default').html(d.content).show();
            //                     break;
            //             }
            //         }
            //     });
            // } else {
            //     $('#data .content').hide();
            //     $('#data .default').html('Select a file from the tree.').show();
            // }
        });

    $folha_trabalho.iniciar_folha_trabalho();
});