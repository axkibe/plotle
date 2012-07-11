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

                            ,   ,-,---.  ,--. .              ,-,---.
                            )    '|___/ | `-' |  ,-. ,-. ,-.  '|___/
                           /     ,|   \ |   . |  | | `-. |-'  ,|   \
                           `--' `-^---' `--'  `' `-' `-' `-' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 login panel, close button

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Exports
*/
var CCode;

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
| Shortcuts
*/
var Button   = Dash.Button;
var debug    = Jools.debug;
var log      = Jools.log;
var subclass = Jools.subclass;
var Util     = CCode.Util;

/**
| Constructor
*/
var LBCloseB = CCode.LBCloseB = function(twig, panel, inherit, name) {
	Button.call(this, twig, panel, inherit, name);
};
subclass(LBCloseB, Button);

LBCloseB.prototype.canFocus = function()
	{ return true; };

LBCloseB.prototype.push = function(shift, ctrl) {
	Util.clearLogin(this.panel);
	this.panel.board.setCurPanel('MainPanel');
	shell.redraw = true;
};

})();
