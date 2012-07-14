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
          ,-_/,.     .     .-,--.             .
          ' |_|/ ,-. |  ,-. '|__/ ,-. ,-. ,-. |
           /| |  |-' |  | | ,|    ,-| | | |-' |
           `' `' `-' `' |-' `'    `-^ ' ' `-' `'
 ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
                        '
 the help panel.

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
var config;
var Fabric;
var Jools;
var theme;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| Constructor
*/
var HelpPanel = Proc.HelpPanel = function(name, inherit, board, screensize) {
	Dash.Panel.call(this, name, inherit, board, screensize);
	this.$access = inherit ? inherit.$access : 'rw';
};
Jools.subclass(HelpPanel, Dash.Panel);

HelpPanel.prototype.setAccess = function(access) {
	if (this.$access === access) { return; }
	this.$access = access;
	if (access === 'ro') {
		this.$sub.readonly. text = 'This page is read-only!';
		this.$sub.readonly2.text = 'Click "switch" and select';
		this.$sub.readonly3.text = '"Sandbox" to play around';
	} else {
		this.$sub.readonly. text = '';
		this.$sub.readonly2.text = '';
		this.$sub.readonly3.text = '';
	}
	this.$sub.readonly. poke();
	this.$sub.readonly2.poke();
	this.$sub.readonly3.poke();
};


})();
