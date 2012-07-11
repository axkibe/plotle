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
| Export
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
var immute   = Jools.immute;
var log      = Jools.log;
var subclass = Jools.subclass;

/**
| Constructor
*/
var MBRightB = CCode.MBRightB = function(twig, panel, inherit, name) {
	Button.call(this, twig, panel, inherit, name);
};
subclass(MBRightB, Button);

/**
| TODO
*/
MBRightB.prototype.push = function(p, shift, ctrl) {
	this.panel.board.setShowHelp(!this.$active);
	shell.redraw = true;
};

})();
