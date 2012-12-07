/*
| Second to left Button on the main panel..
| Registers.
|
| Authors: Axel Kittenberger
*/


/*
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
var MainLeft2Button = Proc.MainLeft2Button = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(MainLeft2Button, Dash.Button);

/**
| Button has been pressed.
*/
MainLeft2Button.prototype.push =
	function(
		// shift,
		// ctrl
	)
{
	this.panel.board.setCurPanel('RegPanel');
	shell.redraw = true;
};

})();
