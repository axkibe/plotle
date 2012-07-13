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

         ,   ,-,---.  ,                 ,-,---.
         )    '|___/  )   ,-. ,-. . ,-.  '|___/
        /     ,|   \ /    | | | | | | |  ,|   \
        `--' `-^---' `--' `-' `-| ' ' ' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~,| ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                               `'
 Login button on the login panel.
 log in

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
var LBLoginB = Proc.LBLoginB = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
};

Jools.subclass(LBLoginB, Dash.Button);

/**
| TODO
*/
LBLoginB.prototype.canFocus = function() {
	return true;
};

/**
| TODO
*/
LBLoginB.prototype.push = function(shift, ctrl) {
	Proc.Util.login(this.panel);
	shell.redraw = true;
};

})();
