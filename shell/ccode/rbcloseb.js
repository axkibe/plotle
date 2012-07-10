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

                        .-,--. ,-,---.  ,--. .              ,-,---.
                         `|__/  '|___/ | `-' |  ,-. ,-. ,-.  '|___/
                         )| \   ,|   \ |   . |  | | `-. |-'  ,|   \
                         `'  ` `-^---' `--'  `' `-' `-' `-' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 register panel, the close button

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CCode;
var CCustom;
var Jools;
var shell;

/**
| Exports
*/
var CMeth = null;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug    = Jools.debug;
var immute   = Jools.immute;
var is       = Jools.is;
var isnon    = Jools.isnon;
var log      = Jools.log;
var subclass = Jools.subclass;
var Util     = CCode.Util;

/**
| Constructor
*/
var RBCloseB = CCode.RBCloseB = function(twig, panel, inherit, name) {
	CCustom.call(this, twig, panel, inherit, name);
};
subclass(RBCloseB, CCustom);

RBCloseB.prototype.canFocus = function()
	{ return true; };

RBCloseB.prototype.push = function(shift, ctrl) {
	Util.clearRegister(this.panel);
	this.panel.cockpit.setCurPanel('MainPanel');
};

})();
