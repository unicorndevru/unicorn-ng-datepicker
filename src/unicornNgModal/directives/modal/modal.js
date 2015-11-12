angular.module('unicornNgModal').directive('modal', function($templateCache, $compile) {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element, attrs) {
      return {
        pre: function(scope, element) {
          var layout, modal;
          layout = angular.element($templateCache.get("/src/unicornNgModal/directives/modal/template.html"));
          modal = angular.element(element.contents());
          layout.find('section').append(modal);
          element.empty();
          element.append(layout);
          return $compile(layout)(scope);
        }
      };
    }
  };
});
