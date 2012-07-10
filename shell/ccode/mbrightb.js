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

                    ,-,-,-.   ,-,---. .-,--.       .   .  ,-,---.
                    `,| | |    '|___/  `|__/ . ,-. |-. |-  '|___/
                      | ; | .  ,|   \  )| \  | | | | | |   ,|   \
                      '   `-' `-^---'  `'  ` ' `-| ' ' `' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                                `'
 Right Button on main panel.
 Help.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var CCustom;
var Jools;
var shell;

/**
| Exports
*/
var CCode;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var log           = Jools.log;
var subclass      = Jools.subclass;

/**
| Constructor
*/
var MBRightB = CCode.MBRightB = function(twig, panel, inherit, name) {
	CCustom.call(this, twig, panel, inherit, name);
};
subclass(MBRightB, CCustom);

MBRightB.prototype.push = function(p, shift, ctrl) {
	this.panel.cockpit.setShowHelp(!this.$active);
	shell.redraw = true;
};

})();
