/*                             .----.          _..._
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
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 register button, register/sign up

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


/*
| Export
*/
var Proc;
Proc = Proc || {};


/*
| Imports
*/
var Dash;
var Jools;


/*
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var RegRegisterButton = Proc.RegRegisterButton = function(twig, panel, inherit, name)
{
	Dash.Button.call(this, twig, panel, inherit, name);
};

Jools.subclass(RegRegisterButton, Dash.Button);


/*
| Button is being pushed.
*/
RegRegisterButton.prototype.push = function(shift, ctrl)
	{ Proc.Util.register(this.panel); };


})();
