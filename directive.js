'use strict';

var dragula = require('dragula');

/*jshint unused: false*/
function register (angular) {
  return ['dragulaService', function angularDragula (dragulaService) {
    return {
      restrict: 'A',
      scope: {
        dragulaScope: '=',
        dragulaModel: '='
      },
      link: link
    };

    function link (scope, elem, attrs) {
      var dragulaScope = scope.dragulaScope || scope.$parent;
      var container = elem[0];
      var name = scope.$eval(attrs.dragula);
      var drake;

      var bag = dragulaService.find(dragulaScope, name);
      if (bag) {
        drake = bag.drake;
        drake.containers.push(container);
      } else {
        drake = dragula({
          containers: [container]
        });
        dragulaService.add(dragulaScope, name, drake);
      }

      scope.$on('$destroy', function() {
        var containerIndex = drake.containers.indexOf(container);
        if (containerIndex >= 0) {
          drake.containers.splice(containerIndex, 1);
          if (drake.models && drake.models[containerIndex]) {
            drake.models.splice(containerIndex, 1);
          }
        }
      });

      scope.$watch('dragulaModel', function (newValue, oldValue) {
        if (!newValue) {
          return;
        }

        if (drake.models) {
          var modelIndex = oldValue ? drake.models.indexOf(oldValue) : -1;
          if (modelIndex >= 0) {
            drake.models.splice(modelIndex, 1, newValue);
          } else {
            drake.models.push(newValue);
          }
        } else {
          drake.models = [newValue];
        }

        dragulaService.handleModels(dragulaScope, drake);
      });
    }
  }];
}

module.exports = register;
