/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'


                             ,-_/,.     .     .-,--.             .
                             ' |_|/ ,-. |  ,-. '|__/ ,-. ,-. ,-. |
                              /| |  |-' |  | | ,|    ,-| | | |-' |
                              `' `' `-' `' |-' `'    `-^ ' ' `-' `'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                           '
 the help panel.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Dash;
var config;
var Fabric;
var Jools;
var theme;

/**
| Exports
*/
var HelpPanel = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Shortcuts
*/
var Panel    = Dash.Panel;
var debug    = Jools.debug;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var subclass = Jools.subclass;

/**
| Constructor
*/
HelpPanel = function(name, inherit, board, screensize) {
	Panel.call(this, name, inherit, board, screensize);
	this.$access = inherit ? inherit.$access : 'rw';
};
subclass(HelpPanel, Panel);

HelpPanel.prototype.setAccess = function(access) {
	if (this.$access === access) { return; }
	this.$access = access;
	if (access === 'ro') {
		this.cc.readonly. text = 'This page is read-only!';
		this.cc.readonly2.text = 'Click "switch" and select';
		this.cc.readonly3.text = '"Sandbox" to play around';
	} else {
		this.cc.readonly. text = '';
		this.cc.readonly2.text = '';
		this.cc.readonly3.text = '';
	}
	this.cc.readonly. poke();
	this.cc.readonly2.poke();
	this.cc.readonly3.poke();
};


})();
