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
var LBCloseB = Proc.LBCloseB = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};
Jools.subclass(LBCloseB, Dash.Button);

LBCloseB.prototype.canFocus = function()
	{ return true; };

LBCloseB.prototype.push = function(shift, ctrl) {
	Proc.Util.clearLogin(this.panel);
	this.panel.board.setCurPanel('MainPanel');
	shell.redraw = true;
};

})();
