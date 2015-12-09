(function() {
    var tbModule = angular.module("toolbarModule",[]);
    
    tbModule.controller("SideBarController", function($mdSidenav) {
        
    });
    
    tbModule.directive("elToolbar", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/template-toolbar.html'
        }
    });
})();