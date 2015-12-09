(function() {
    var app = angular.module('CotacaoBolsaApp',['ngMaterial', 'ngTouch', 'chartModule', 'toolbarModule', 'sideMenuModule']);
    
    app.controller("CotacaoController", ['$scope', '$mdSidenav', '$http', function($scope, $mdSidenav, $http) { 
        var ctrl = this;
        
        this.acoes = [];
        this.detailDivSuf = 'Details';
        
        this.IsDetailOpen = function(detailDivId) {
            return ($('#'+detailDivId.replace('.','\\.')+':visible').length > 0);
        };
        
        this.ToggleDetails = function(stockSymbol) {
            var id = stockSymbol+this.detailDivSuf;
            $('#'+id.replace('.','\\.')).slideToggle(function() {
                    if($('#'+id.replace('.','\\.')+':visible').length > 0) RenderChart(stockSymbol);
                });
        };
        
        this.ExportToCsv = function() {
            var csvSeparator = ';';
            var csvData = 'data:text/csv;charset=utf-8,';
            csvData += 'Nome' + csvSeparator + 'Simbolo' + csvSeparator + 'Valor\n'
            this.acoes.forEach(function(e, i) {
                 csvData += e.Name + csvSeparator + e.Symbol + csvSeparator + e.LastTradePriceOnly + '\n'
            });
            var encodedUri = encodeURI(csvData);
            //Black Magic - Gambi pra fazer o download do CSV com um nome específico.
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "my_stock_data.csv");

            link.click();   
        }
        
        $scope.toggleLeftMenu = function () {
            $mdSidenav("left").toggle(  );   
        }
        
        $http.get(DATAHANDLING.STOCKLIST.getStockListUrl()).success(function(data) {
            var sliceSize = 20;
            var index = 0;
            var lastIndex = 0;
            while (index != data.acoes.length) {
                lastIndex = index;
                index += sliceSize;
                
                if( index > data.acoes.length) index = data.acoes.length;
                
                var url = DATAHANDLING.STOCKDATA.getStockDataUrl(data.acoes.slice(lastIndex, index));  
                            
                $http.get(url).success(function(data) {
                    data.query.results.quote.forEach(function(e, i) {
                        ctrl.acoes.push(e);
                    });
                });
            }

        });
        
    }]);
    
    /* Directives */
    app.directive("cotacaoItem", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/template-cotacao.html'
        };
    });
    
    app.directive("cotacaoDetail", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/template-cotacao-details.html'
        };
    });
    
    app.directive("cotacaoDetailButton", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/template-cotacao-details-button.html'
        };
    });
    
    /* Config */
    app.config( function($mdThemingProvider){
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('blue-grey')
            .accentPalette('grey')
            .dark();
    });
    
})();