var app = angular.module('app');

app.controller('tipologiaController', function($scope, $http, S_vars, $sce, $uibModal, S_http_validate, DTOptionsBuilder, DTColumnDefBuilder) {
    var $tipologia = this;
    $tipologia.titulo = "Tipologia";


    $tipologia.datatables = this;
 	$tipologia.datatables.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withDisplayLength(2)
        .withDOM('pitrfl');

        $tipologia.datatables.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0).notSortable(),
        DTColumnDefBuilder.newColumnDef(1).notSortable(),
        DTColumnDefBuilder.newColumnDef(2).notSortable(),
        DTColumnDefBuilder.newColumnDef(3).notSortable(),
        DTColumnDefBuilder.newColumnDef(4).notSortable()
    ];


    $tipologia.calculate = function() {
        var obj_ajax = {};
        obj_ajax._f = "get_tipologia";
		obj_ajax._p = {'digits' : $tipologia.digits};
        $http.post(S_vars.url_ajax + "ajax.php", obj_ajax).success(function(data, status) {
            var validation = S_http_validate.validate_success(data.error, status);
            if (validation == true) {
            	$tipologia.data = data.data;
                $tipologia.chartConfig = {
                    options: {
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Teste'
                        },
                        subtitle: {
                            text: document.ontouchstart === undefined ?
                                'TClick and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                        },
                        xAxis: {
                            type: 'datetime'
                        },
                        yAxis: {
                            title: {
                                text: 'Exchange rate'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            area: {
                                fillColor: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, Highcharts.getOptions().colors[0]],
                                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                    ]
                                },
                                marker: {
                                    radius: 2
                                },
                                lineWidth: 1,
                                states: {
                                    hover: {
                                        lineWidth: 1
                                    }
                                },
                                threshold: null
                            }
                        }
                    },
                    series: [{
                        type: 'area',
                        name: 'USD to EUR',
                        data: $tipologia.data
                    }]
                };
            } else {
                alert(validation);
            }
        });

        console.log($tipologia.data);
    }
    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=usdeur.json&callback=?', function(data) {
        
    });
});
