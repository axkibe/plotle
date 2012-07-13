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
var RBCloseB = Proc.RBCloseB = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(RBCloseB, Dash.Button);

RBCloseB.prototype.canFocus = function()
	{ return true; };

RBCloseB.prototype.push = function(shift, ctrl) {
	Proc.Util.clearRegister(this.panel);
	this.panel.board.setCurPanel('MainPanel');
};

})();
