/*
|
| Zoom null button, sets zoom factor to default.
|
| Authors: Axel Kittenberger
|
*/


/*
| Export
*/
var Proc;
Proc = Proc || {};


/*
| Imports
*/
var Dash;
var Jools;
var shell;


/*
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var MainZoomNullButton = Proc.MainZoomNullButton = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(MainZoomNullButton, Dash.Button);

MainZoomNullButton.prototype.push =
	function(
		// shift,
		// ctrl
	)
{
	shell.changeSpaceZoom(0);
};

})();
