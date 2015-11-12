angular.module('unicornNgIcons').directive('icons', function ($templateCache) {
  var wrap = R.curry(function (tagName, content) {
    return ["<", tagName, ">", content, "</", tagName, ">"].join('')
  })

  var iconTemplate = function(path){
    return $templateCache.get('/src/unicornNgIcons/directives/icons/' + path + '.svg')
  }

  return {
    restrict: 'E',

    link: function(scope, element, attrs){

      attrs.$observe('name', function(name) {
        if (name) {
          element.empty()
          var iconsMarkup = R.compose(R.map(wrap('i')), R.map(iconTemplate))(name.split(/\s*,\s*/))
          element.append(wrap('span', iconsMarkup.join('')))
        }
      })
    }
  }
})
