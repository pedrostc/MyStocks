(function() {
    var chartModule = angular.module("chartModule",[]);
    
    chartModule.controller("chartController", ["$scope", "$http",  function($scope, $http) {
        var chartCtrl = this;
        this.data = [];
    }]);
                                               
    chartModule.directive("cotacaoDetailChart", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/template-cotacao-chart.html'
        };
    });
    
})();

/* Model */
function ChartData() {
    this.labels = [];
    this.series = [];
    
    this.getSeriesQt = function () {
        return this.series.length;  
    };
    
    this.getLastSerieIndex = function () {
        if(this.getSeriesQt() === 0) throw "There are no series here.";
        
        var index = this.getSeriesQt();
        index--;
        
        return index;
    }
    
    this.addLabel = function(labelToAdd) {
        this.labels.push(labelToAdd);  
    };
    
    this.addItemToLastSerie = function(valueToAdd) {
        this.series[this.series.length - 1].push(valueToAdd);
    }
    
    this.createNewSerie = function() {
        this.series[this.series.length] = [];   
    }
}

function ChartSourceData() {
    var sData = this;    
    this.data = [];
    this.symbol = '';
    
    this.ConvertFromYQLHistData = function (rawData) {
        rawData.forEach(function (e, i) {
            sData.data.push(new ChartDataProto(e.Date.slice(5), e.Close));  
        });
        this.symbol = rawData[0].Symbol;
    };
}

function ChartDataProto(l, v) {
    this.label = l;
    this.value = v;
}
/* End Model */

function drawChart(sourceData) {
    if(sourceData == undefined || sourceData.symbol == undefined) return;
        
    var chartData = new ChartData();
    chartData.createNewSerie();
    
    $(sourceData.data.sort(ChartDataProtComparator)).each(function (n, e) {
        chartData.addLabel(e.label);
        chartData.addItemToLastSerie(e.value);
    });
    
    new Chartist.Line('#chart_div' + sourceData.symbol.replace('.','\\.'), chartData, {
      fullWidth: true,  
      chartPadding: {
        right: 40
      }
    });
    
    var $chart = $('#chart_div' + sourceData.symbol.replace('.','\\.'));
        
    var $toolTip = $chart
      .append('<div class="tooltip"></div>')
      .find('.tooltip')
      .hide();

    $chart.on('mouseenter', '.ct-point', function() {
      var $point = $(this),
        value = $point.attr('ct:value');
      $toolTip.html(value).show();
    });

    $chart.on('mouseleave', '.ct-point', function() {
      $toolTip.hide();
    });

    $chart.on('mousemove', function(event) {
      $toolTip.css({
        left: event.originalEvent.layerX - $toolTip.width()/1.6,
        top: event.originalEvent.layerY - $toolTip.height() * 2.6
      });
    });
}

function RenderChart(stockSymbol) {
    $.get(DATAHANDLING.HISTORICALDATA.getHistoricalDataUrl(stockSymbol)).done(function (data) {
        if(data.query.count === 0) return;
        $(data).each(function(n, e) {
            var sourceData = new ChartSourceData();
            sourceData.ConvertFromYQLHistData(data.query.results.quote);
            
            drawChart(sourceData);
        });
    });
}