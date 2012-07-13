/**                            .----.          _..._
                              .  _   \      .-'_..._''.
 _____   _..._               /  ' '.  \   .' .'      '.\
\     |.'     '-.           .  '    \  ' / .'
 \     .'```'.   '. .-,.--. |  '     | '' '
  \   |       \   ||  .-. |\   \     ' /| |
   |  |        |  || |  | | `.  ` ..' / | |
   |   \      /  . | |  | |   '-...-'`  . '
   |  |\`'-.-'  .' | |  '-               \ '.          .
   |  | '-....-'   | |                    '. `._____.-'/
  .'  '.           | |                      `-.______./
  '----'           '-'

           ,-_/,. ,-,---. ,-_/,.     .     ,-,---.
           ' |_|/  '|___/ ' |_|/ . ,-| ,-.  '|___/
            /| |   ,|   \  /| |  | | | |-'  ,|   \
            `' `' `-^---'  `' `' ' `-^ `-' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Right Button on main panel.
 Help.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

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
var HBHideB = Proc.HBHideB = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(HBHideB, Dash.Button);

HBHideB.prototype.push = function(shift, ctrl) {
	this.panel.board.setShowHelp(false);
	shell.redraw = true;
};

})();
