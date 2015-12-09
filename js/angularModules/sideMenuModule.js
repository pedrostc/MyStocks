(function() {
    var smModule = angular.module("sideMenuModule",["ngMaterial"]);
    
    smModule.directive("sideMenu", function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/template-side-menu.html'
        }
    });
})();