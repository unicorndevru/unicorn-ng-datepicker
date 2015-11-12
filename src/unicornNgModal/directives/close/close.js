angular.module('unicornNgModal').directive('modalClose', function() {
  return {
    restrict: 'E',
    templateUrl: '/src/unicornNgModal/directives/close/template.html',
    scope: {
      close: '&'
    }
  };
});
