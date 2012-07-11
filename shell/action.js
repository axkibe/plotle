/**                                                      _.._
                                                      .-'_.._''.
 __  __   ___       _....._              .          .' .'     '.\
|  |/  `.'   `.   .'       '.          .'|         / .'                                _.._
|   .-.  .-.   ' /   .-'"'.  \        (  |        . '            .-,.-~.             .' .._|    .|
|  |  |  |  |  |/   /______\  |        | |        | |            |  .-. |    __      | '      .' |_
|  |  |  |  |  ||   __________|    _   | | .'''-. | |            | |  | | .:-`.'.  __| |__  .'     |
|  |  |  |  |  |\  (          '  .' |  | |/.'''. \. '            | |  | |/ |   \ ||__   __|'-..  .-'
|  |  |  |  |  | \  '-.___..-~. .   | /|  /    | | \ '.         .| |  '- `" __ | |   | |      |  |
|__|  |__|  |__|  `         .'.'.'| |//| |     | |  '. `.____.-'/| |      .'.''| |   | |      |  |
                   `'-.....-.'.'.-'  / | |     | |    `-._____ / | |     / /   | |_  | |      |  '.'
                                 \_.'  | '.    | '.           `  |_|     \ \._,\ '/  | |      |   /
                                       '___)   '___)                      `~~'  `"   |_|      `--'

                                        ,.       .
                                       / |   ,-. |- . ,-. ,-.
                                      /~~|-. |   |  | | | | |
                                    ,'   `-' `-' `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An users action in the making.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/**
| Imports
*/
var Jools;
var Action;

/**
| Capsule
*/
(function(){
'use strict';
if (typeof(window) === 'undefined') { throw new Error('shell.js needs a browser!'); }

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 .---. .           .          .
 \___  |-. ,-. ,-. |- ,-. . . |- ,-.
     \ | | | | |   |  |   | | |  `-.
 `---' ' ' `-' '   `' `-' `-^ `' `-'
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
var debug         = Jools.debug;
var immute        = Jools.immute;
var is            = Jools.is;
var isnon         = Jools.isnon;
var isArray       = Jools.isArray;
var limit         = Jools.limit;
var log           = Jools.log;
var subclass      = Jools.subclass;

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
     ,.       .
    / |   ,-. |- . ,-. ,-.
   /~~|-. |   |  | | | | |
 ,'   `-' `-' `' ' `-' ' '
~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

 An action in the making.

 This overlays repository data, so for example a move is not transmitted
 with every pixel changed but when the the object is released.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/**
| Constructor.
|
| type: Action type
| recv: object to receive events during action.
| + key value list for additional params
*/
Action = function(args) {
	this.type  = args[0];
	this.visec = args[1];

	switch (this.visec) {
	case 'space' : break;
	case 'dash'  : break;
	default      : throw new Error('invalid visec');
	}

	for(var a = 2, aZ = args.length; a < aZ; a += 2) {
		this[args[a]] = args[a + 1];
	}
};

/**
| Action enums.
*/
Action.PAN        = 1; // panning the background
Action.ITEMDRAG   = 2; // dragging one item
Action.ITEMRESIZE = 3; // resizing one item
Action.ITEMMENU   = 4; // clicked one item menu
Action.SCROLLY    = 5; // scrolling a note
Action.RELBIND    = 6; // binding a new relation
Action.REBUTTON   = 7; // holding a button repeating its effect
immute(Action);

})();
