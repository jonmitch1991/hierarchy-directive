angular.module('app')
  .directive('hierarchy', function() {
    return {
      restrict: "E",
      scope: {
        selections: '=',
        options: '=',
        max: '='
      },
      templateUrl: "hierarchy.html",
      link: function($scope, elem, attrs) {
        /**
         * Select the item with the label of name and set it into current selection.
         * If there are no more children then add the current selection to selections
         * and clear the current selection. 
         * @param name
         */
        $scope.memberClicked = function(name) {
          // create a copy of options if there isn't already one and set this as
          // the initial hierarchy
          if (!$scope.initialHierarchy)
            $scope.initialHierarchy = angular.copy($scope.options);
          // iterate through options until reaching the one which match the given name
          // then set options to this members children and add the member to the
          // current selection
          for (var memberIndex in $scope.options) {
            var member = $scope.options[memberIndex];
            if (member.name == name) {
              $scope.options = $scope.options[memberIndex].children;
              if (!$scope.currentSelection)
                $scope.currentSelection = [];
              $scope.currentSelection.push(member.name)
              break;
            }
          }
          // if options is empty (i.e. there are no more children) then add the
          // current selection to selections, clear current selection and set
          // options back to the initial hierarchy.
          if (!$scope.options) {
            $scope.options = angular.copy($scope.initialHierarchy);
            $scope.selections.push($scope.currentSelection);
            $scope.currentSelection = [];
          }
        };

        /**
         * Remove the member of the current selection at the given index and all
         * selections of a higher index, then reset the options as appropriate
         * @param index
         */
        $scope.removeCurrentSelection = function(index) {
          // create a temporary array of selections
          var newSelections = [];
          // iterate through current selections and add them to the temporary
          // array until reaching the given index
          for (var i = 0; i < $scope.currentSelection.length; i++) {
            if (index === i) {
              break;
            } else {
              newSelections.push($scope.currentSelection[i]);
            }
          }
          // repopulate options back to the initial list and then repopulate
          // current selection based on new selections using memberClicked
          // to ensure the choice of options are correct
          $scope.options = angular.copy($scope.initialHierarchy);
          $scope.currentSelection = [];
          for (var i = 0; i < newSelections.length; i++) {
            $scope.memberClicked(newSelections[i]);
          }
        };

        /**
         * Remove the selection of the given index from the selections list
         * @param index
         */
        $scope.removeSelection = function(index) {
          $scope.selections.splice(index, 1);
        }
      }
    }
  });