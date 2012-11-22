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
var shell;


/*
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }


/*
| Constructor
*/
var LoginCloseButton = Proc.LoginCloseButton = function(twig, panel, inherit, name)
{
	Dash.Button.call(this, twig, panel, inherit, name);
};

Jools.subclass(LoginCloseButton, Dash.Button);



/*
| Button is being pushed.
*/
LoginCloseButton.prototype.push = function(shift, ctrl)
{
	Proc.util.clearLogin(this.panel);
	this.panel.board.setCurPanel('MainPanel');
	shell.redraw = true;
};


})();
