 /**____
 \  ___ `'.                          .
  ' |--.\  \                       .'|
  | |    \  '                     <  |
  | |     |  '    __               | |
  | |     |  | .:--.'.         _   | | .'''-.
  | |     ' .'/ |   \ |      .' |  | |/.'''. \
  | |___.' /' `" __ | |     .   | /|  /    | |
 /_______.'/   .'.''| |   .'.'| |//| |     | |
 \_______|/   / /   | |_.'.'.-'  / | |     | |
              \ \._,\ '/.'   \_.'  | '.    | '.
               `--'  `"            '---'   '---'
        ,---.      .  .---. .      .
        |  -'  ,-. |- \___  |- . . |  ,-.
        |  ,-' |-' |      \ |  | | |  |-'
        `---|  `-' `' `---' `' `-| `' `-'
~ ~ ~ ~ ~,-.| ~ ~ ~ ~ ~ ~ ~ ~ ~ /|~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
         `-+'                  `-'
 Gets styles by a tagname.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Export
*/
var Dash;
Dash = Dash || {};

/**
| Imports
*/
var theme;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('this code needs a browser!'); }

/**
| List of tagnames.
*/
var styles = {
	boxes       : { edge : [ { border: 0, width : 1, color : 'black' } ] },
	panel       : theme.dash.style, // TODO
	help        : theme.dash.help,
	button      : theme.dash.button,
	buttonHover : theme.dash.buttonHover,
	buttonFocus : theme.dash.buttonFocus,
	buttonHofoc : theme.dash.buttonHofoc,
	chat        : theme.dash.chat,
	highlight   : theme.dash.highlight,
	input       : theme.dash.input,
	inputFocus  : theme.dash.inputFocus,
	sides       : theme.dash.sides
};

/**
| Gets a style by its tagname.
*/
Dash.getStyle = function(tagname) {
	var style = styles[tagname];
	if (!style) { throw new Error('Invalid style tagname: ' + tagname); }
	return style;
};

})();
