/*
|
| Close button, closes the register panel.
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


/*
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var RegCloseButton = Proc.RegCloseButton = function(twig, panel, inherit, name)
{
	Dash.Button.call(this, twig, panel, inherit, name);
};

Jools.subclass(RegCloseButton, Dash.Button);


/*
| Button is being pushed.
*/
RegCloseButton.prototype.push =
	function(
		// shift,
		// ctrl
	)
{
	Proc.util.clearRegister(this.panel);

	this.panel.board.setCurPanel('MainPanel');
};


})();
