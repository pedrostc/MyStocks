var DATAHANDLING = {
    HISTORICALDATA: (function() {
        var stockNameMask = "##stock##";
        var initDateMask = "##initDate##";
        var endDateMask = "##endDate##";

        var dateInterval = 30;
        
        var historicalDataBaseUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.historicaldata%20where%20symbol%20%3D%20%22" + stockNameMask + "%22%20and%20startDate%20%3D%20%22" + initDateMask + "%22%20and%20endDate%20%3D%20%22" + endDateMask + "%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=";

        var formatDateToQuery = function(date) {
            return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        };
        
        return {
            getHistoricalDataUrl: function (stockSymbol) {
                var historicalDataUrl = historicalDataBaseUrl;

                var initDate = new Date();
                initDate.setDate(initDate.getDate() - dateInterval);

                var endDate = new Date();

                historicalDataUrl = historicalDataUrl.replace(stockNameMask, stockSymbol);
                historicalDataUrl = historicalDataUrl.replace(initDateMask, formatDateToQuery(initDate));
                historicalDataUrl = historicalDataUrl.replace(endDateMask, formatDateToQuery(endDate));

                return historicalDataUrl;
            }
        };
    })(),
    STOCKDATA: (function() {
        var queryFilterPlaceHolder = '/##/';
        var stocDataUrlBase = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quote%20where%20symbol%20in%20("+queryFilterPlaceHolder+")&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";

        return {
            getStockDataUrl: function (acoes) {
                var queryFilter = '';
                $(acoes).each(function (n, e) {
                    queryFilter += '%22' + e.key + '%22';
                    if(n < acoes.length - 1) {
                        queryFilter += '%2C';   
                    }
                });        

                return stocDataUrlBase.replace(queryFilterPlaceHolder,queryFilter); 
            }
        };
    })(),
    STOCKLIST: (function() {
        var stockListUrl = "data/data.json";

        return {
            getStockListUrl: function () {
                return stockListUrl;
            }
        }
    })()
};