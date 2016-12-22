angular.module('app')
    .directive('hierarchyLazy', ['service', function(service) {
        return {
            restrict: "E",
            scope: {
                selections: '=',
                options: '=',
                max: '='
            },
            templateUrl: "hierarchy-lazy.html",
            link: function($scope, elem, attrs) {
                /**
                 * Add element with id and title to current selection.
                 * Make service call to populate options. If there are no children then
                 * add to selections, set option back to initialHierarchy and clear the
                 * current selection.
                 * @param id
                 * @param title
                 */
                $scope.memberClicked = function(id, title) {
                    // create a copy of options if there isn't already one and set this as
                    // the initial hierarchy
                    if (!$scope.initialHierarchy)
                        $scope.initialHierarchy = angular.copy($scope.options);
                    // initialize currentSelection if necessary and add the selection to it
                    if (!$scope.currentSelection)
                        $scope.currentSelection = [];
                    $scope.currentSelection.push({id: id, title: title});
                    // find children and populate options
                    service.findChildren(id).then(
                        function (options) {
                            $scope.options = options;
                            // if options is empty (i.e. there are no more children) then add the
                            // current selection to selections, clear current selection and set
                            // options back to the initial hierarchy.
                            if (!$scope.options || $scope.options.length < 1) {
                                $scope.selections.push($scope.currentSelection);
                                $scope.options = angular.copy($scope.initialHierarchy);
                                $scope.currentSelection = [];
                            }
                        },
                        function (error) {
                            $log.error(JSON.stringify(error));
                        }
                    );
                };

                /**
                 * Remove the member of the current selection at the given index and all
                 * selections of a higher index, then reset the options as appropriate
                 * @param selection
                 */
                $scope.removeCurrentSelection = function(selection) {
                    // make a cope of currentSelection and then reset currentSelection
                    var newSelections = angular.copy($scope.currentSelection);
                    $scope.currentSelection = [];
                    // re-select each selection until reaching the selection being removed.
                    // if the first selection is being removed then set options back to
                    // the initial hierarchy
                    for (var i = 0; i < newSelections.length; i++) {
                        if (newSelections[i].id != selection.id) {
                            $scope.memberClicked(newSelections[i].id, newSelections[i].title);
                        } else if (i == 0) {
                            $scope.options = angular.copy($scope.initialHierarchy);
                            break;
                        } else {
                            break;
                        }
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
    }]);