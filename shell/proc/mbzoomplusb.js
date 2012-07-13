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

 ,-,-,-.   ,-,---. ,-_/              .-,--. .          ,-,---.
 `,| | |    '|___/   /  ,-. ,-. ,-,-. '|__/ |  . . ,-.  '|___/
   | ; | .  ,|   \  /   | | | | | | | ,|    |  | | `-.  ,|   \
   '   `-' `-^---' /--, `-' `-' ' ' ' `'    `' `-^ `-' `-^---'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 Zoom Plus Button on the main panel.

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
var MBZoomPlusB = Proc.MBZoomPlusB = function(twig, panel, inherit, name) {
	Dash.Button.call(this, twig, panel, inherit, name);
	this.repeat = true;
};
Jools.subclass(MBZoomPlusB, Dash.Button);

/**
| TODO
*/
MBZoomPlusB.prototype.push = function(shift, ctrl) {
	shell.changeSpaceZoom(1);
};

})();
