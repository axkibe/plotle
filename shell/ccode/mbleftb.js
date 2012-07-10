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

                       ,-,-,-.   ,-,---.  ,          .  ,-,---.
                       `,| | |    '|___/  )   ,-. ," |-  '|___/
                         | ; | .  ,|   \ /    |-' |- |   ,|   \
                         '   `-' `-^---' `--' `-' |  `' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ' ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Left Button on the main panel.
 Log in / Log out

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
var log           = Jools.log;
var subclass      = Jools.subclass;

/**
| Constructor
*/
var MBLeftB = CCode.MBLeftB = function(twig, panel, inherit, name) {
	CCustom.call(this, twig, panel, inherit, name);
};
subclass(MBLeftB, CCustom);

MBLeftB.prototype.push = function(shift, ctrl) {
	switch (this.$captionText) {
	case 'log in'  : this.panel.cockpit.setCurPanel('LoginPanel'); break;
	case 'log out' : CCode.Util.logout(this.panel); break;
	default : throw new Error('unknown state of leftB');
	}
	shell.redraw = true;
};

})();
