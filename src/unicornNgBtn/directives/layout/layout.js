angular.module('unicornNgBtn').directive('btnLayout', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var classes;
      classes = '';
      return attrs.$observe('btnLayout', function(value) {
        var buttonClass, newClasses;
        if (value) {
          buttonClass = function(name) {
            return "button-" + name;
          };
          newClasses = R.join(' ', ['button'].concat(R.map(buttonClass, value.split(/[\s,]+/))));
          attrs.$updateClass(newClasses, classes);
          return classes = newClasses;
        }
      });
    }
  };
});
