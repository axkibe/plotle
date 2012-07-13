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

    ,-,-,-.   ,-,---. .-,--.       .   .  ,-,---.
    `,| | |    '|___/  `|__/ . ,-. |-. |-  '|___/
      | ; | .  ,|   \  )| \  | | | | | |   ,|   \
      '   `-' `-^---'  `'  ` ' `-| ' ' `' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ,|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                                `'
 Right Button on main panel.
 Help.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Export
*/
var Proc;

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
var MBRightB = Proc.MBRightB = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(MBRightB, Dash.Button);

/**
| TODO
*/
MBRightB.prototype.push = function(p, shift, ctrl) {
	this.panel.board.setShowHelp(!this.$active);
	shell.redraw = true;
};

})();
