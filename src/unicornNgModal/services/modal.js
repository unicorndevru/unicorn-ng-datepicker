angular.module('unicornNgModal').factory('modal', function($rootScope, $q, $compile, $document, $templateCache, $timeout) {
  var Modal, modalWrapTemplate, openModals;
  var id = 0;
  openModals = {};
  modalWrapTemplate = '/src/unicornNgModal/directives/modal/modalWrap.html';
  Modal = (function() {
    Modal.animationDuration = 500;

    function Modal(layoutTemplateUrl, scope, options1) {
      this.layoutTemplateUrl = layoutTemplateUrl;
      this.options = options1;
      this.scope = scope || $rootScope;
      this.deferred = $q.defer();
      this.promise = this.deferred.promise;
      this.id = 'modal_' + ++id;
      this.scope.$on('$destroy', (function(_this) {
        return function() {
          if (openModals[_this.id]) {
            return _this.close();
          }
        };
      })(this));
      this;
    }

    Modal.prototype.isOpen = function() {
      return openModals[this.id] !== void 0;
    };

    Modal.prototype.close = function(result) {
      if (!this.isOpen()) {
        return;
      }
      this.layout.addClass('modal_closing');
      $timeout((function(_this) {
        return function() {
          openModals[_this.id] = void 0;
          if (_this.layout) {
            _this.layout.remove();
            _this.layout = void 0;
          }
          _this.modalScope.$destroy();
          _this.modalScope = void 0;
          if (R.filter(R.identity, R.values(openModals)).length === 0) {
            return $document.find('body').removeClass('modal-open');
          }
        };
      })(this), Modal.animationDuration);
      return this.deferred.resolve(result);
    };

    Modal.prototype.show = function() {
      var layout, layoutWrap, modal, modalScope;
      if (this.isOpen()) {
        close();
      }
      modal = this;
      modalScope = this.scope.$new();
      this.modalScope = modalScope;
      this.modalScope.$on('$destroy', function() {
        if (modal.isOpen()) {
          return modal.close();
        }
      });
      modalScope.modal = {
        id: this.id,
        options: this.options,
        close: function() {
          return modal.close.apply(modal, arguments);
        },
        promise: this.promise
      };
      layoutWrap = angular.element($templateCache.get(modalWrapTemplate));
      layout = $templateCache.get(this.layoutTemplateUrl);
      if (layoutWrap.length === 0) {
        throw new Error("Can't find template " + modalWrapTemplate);
      } else if (!layout) {
        throw new Error("Can't find template " + this.layoutTemplateUrl);
      }
      layoutWrap.find('section').append(layout);
      $document.find('body').append(layoutWrap);
      $compile(layoutWrap)(modalScope);
      this.layout = layoutWrap;
      openModals[this.id] = this;
      $timeout((function(_this) {
        return function() {
          if (!$document.find('body').hasClass('modal-open')) {
            return $document.find('body').addClass('modal-open');
          }
        };
      })(this), Modal.animationDuration);
      return this.promise;
    };

    return Modal;

  })();
  return function(templateUrl, scope, options) {
    var modal;
    modal = new Modal(templateUrl, scope, options);
    modal.show();
    return modal;
  };
});
