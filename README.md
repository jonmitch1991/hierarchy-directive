# hierarchy-directive
This is an AngularJS Directive to allow hierarchical selection. An example of this directive can be seen [here](https://embed.plnkr.co/NxBWJWLkU3WV8N97khck/). In this example no styling has been applied except for the fadein transitions when making selections. The CSS classes are all applied in `hierarchy.html` and will work in a PAMM project as shown below:

![image](https://cloud.githubusercontent.com/assets/6545019/21315866/00e13058-c5f6-11e6-9460-e48dbf826680.png)

### Add to a PAMM project
In order to add this directive to a PAMM project the `hierarchy.js` file will need to be added either to the end of a controller or in a separate directive folder.  `hierarchy.html` and `hierarchy.css` will need adding to the project too. If the `hierarchy.js` file has not been added to the controller, then the file will need referencing either in `index.html` or in a `_package.js` file. `hierarchy.css` will also need referencing. The `templateUrl` in `hierarchy.js` should be changed to point to `hierarchy.html`.

In `hierarchy.js` ensure that the module name is changed from 'app' if necessary and set as appropriate.

Once these files have been added to the project, then add a hierarchy to a page using:
```
<hierarchy options="tree" selections="selections" max="3"></hierarchy>
```
- `options` is the JSON object the hierarchy is based on.
- `selections` is what has been selected.
- `max` is an optional attribute to set the maximum number of selections.

In the pages controller the JSON object for `tree` (the hierarchy to select from) will need setting and also `selections` needs initializing. *NOTE: if the controller is defined like `ng-controller="mainCtrl as m"` then `options` and `selections` should be set as `m.tree` and `m.selections`.*

### How it works
The directive is backed by a `templateUrl` which points to `hierarchy.html`, this has 3 sections to it. First is the list of options to be selected from, second is the current selection and third are the selections which have been made. Within this file all the necessary CSS classes are being applied, the majority of these will already exist in a standard [PAMM Seed](https://github.com/atosorigin/PAMM-SEED-QuickStart) project. The `fadein` classes are added in `hierarchy.css`.

Initially, the first section will be populated with the top level elements from `options`. Once an element is selected, then it is added to the second section (and can be deleted by clicking the X). The first section is updated to show the child elements. If there are no children, then that full selection is added to the third section (again this can be deleted by clicking the 'Remove' button) and the first section is set back to the top level elements. If the max number of selections has been reached then the first and second sections are no longer rendered. 

The directive contains the following methods:
- `memberClicked` : when an element is selected, add it to the `curentSelection` then set the child elements to `options`. If there are no child elements then push to `selections`.
- `removeCurrentSelection` : remove the chosen element from the current selection and any subsequent element e.g. if the 2nd element is being removed, then also remove the 3rd, 4th, 5th etc.
- `removeSelection` : remove the chosen selection from `selections`.

### Create JSON hierarchy
The tree has a simple structure, each node has a 'name' element and if there are any child elements a 'children' element as follows:
```
[{ 'name' : 'Option 1', 'children' : [{ 'name' : 'Child 1' }] }]
```
A [Python](https://www.python.org/) script (`hierarchy_json_create.py`) has been added to the project which will create a JSON object of the expected structure based on a spreadsheet. Also in the project is an example spreadsheet called `Book1.xlsx` *NOTE: this can be renamed to something more relevant as long as the reference is updated in `hierarchy_json_create.py`.* To run this script, add it and the associated *.xlsx* file to a folder, open a command prompt, navigate to that folder and run:
```
python hierarchy_json_create.py
```
This will print the JSON object to represent the data in the spreadsheet.

This script is based on a hierarchy that goes 3 levels deep (i.e. the spreadsheet has 3 columns). There is also an example of nodes which only go 2 levels deep, here the 1st and 2nd level are the same and this is handled within the script. The script can easily be adapted to handle this differently or to go any number of levels deeper.

### Lazy Loading
A `lazy-loading` folder has been added to the repository to allow for the hierarchy to be lazily loaded rather than having a full pre-loaded JSON object. Installation of this works in the same was as already described, replacing `hierarchy.html` with `hierarchy-lazy.html` and `hierarchy.js` with `hierarchy-lazy.js`.

Once these files have been added to the project, then add a hierarchy to a page using:
```
<hierarchy-lazy options="tree" selections="selections" max="3"></hierarchy-lazy>
```
*NOTE: The initial top level `options` should be populated in the pages controller and added to the scope of the directive*

In `hierarchy-lazy.js` there is currently an arbitrary `service` being passed into the directive with a method `findChildren(..)`. This would need updating to whatever service and method is being used.

This service is expected to return a list of elements with the following structure:
```
{id: id, title: title}
```
The recommended data model would be a table where each entry has an `id`, `parent_id` and `title`. Then the `findChildren(..)` method (or equivalent) would take an `id` and execute the following query:
```
select * from table where parent_id = :id
```
`hierarchy_lazy_sql_inserts.py` has been added to the `lazy-loading` folder also which can be used to generate SQL Insert statements for the data model described. Here the `table` name would just need updating. As with `hierarchy_json_create.py`, this script is for a hierarchy that goes 3 levels deep, but could be adapted.

### Customisation
This directive can easily be altered and customised once added to a project. For example, styling could be changed by applying different CSS classes to elements in `hierarchy.html`.
