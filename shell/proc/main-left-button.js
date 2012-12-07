/*
| Left Button on the main panel.
| Log in / Log out
|
| Authors: Axel Kittenberger
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

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor
*/
var MainLeftButton = Proc.MainLeftButton = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(MainLeftButton, Dash.Button);

/**
| Button has been pushed.
*/
MainLeftButton.prototype.push =
	function(
		// shift,
		// ctrl
	)
{
	switch (this.$captionText) {
	case 'log in'  :
		this.panel.board.setCurPanel('LoginPanel');
		break;
	case 'log out' :
		Proc.util.logout(this.panel);
		break;
	default :
		throw new Error('unknown state of leftB');
	}
};

})();
