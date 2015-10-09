var app = angular.module('app');

app.controller('diarioController', function($scope) {
    var $diario = this;
    $diario.titulo = "Diario";
    $diario.selected = {};

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