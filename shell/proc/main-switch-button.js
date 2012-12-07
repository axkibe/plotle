/*
|
| Switch button, shows the switch panel.
|
| Authors: Axel Kittenberger
|
*/


/**
| Export
*/
var Proc;
Proc = Proc || {};

/**
| Imports
*/
var Dash;
var Jools;
var shell;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor
*/
var MainSwitchButton = Proc.MainSwitchButton = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(MainSwitchButton, Dash.Button);

MainSwitchButton.prototype.push =
	function(
		// shift,
		// ctrl
	)
{
	this.panel.toggleSwitch();
	shell.redraw = true;
};

})();
