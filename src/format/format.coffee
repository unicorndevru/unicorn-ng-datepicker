angular.module('components.date').directive 'dateFormat', (moment, locale) ->

  restrict: 'E'

  templateUrl: '/components/date/directives/format/template.html'

  scope:
    value: '='
    parse: '@'
    format: '@'


  link: (scope, element, attrs) ->

    setUpValue = ->
      return if scope.value is undefined
      scope.formattedValue = moment(scope.value, scope.parse).format scope.format

    scope.$watch 'value', setUpValue
    locale.emitter.onValue setUpValue

    setUpValue()
