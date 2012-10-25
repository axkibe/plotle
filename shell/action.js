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

 This overlays repository data, so for example a move is not transmitted
 with every pixel changed but when the the object is released.

 Authors: Axel Kittenberger
 License: MIT(Expat), see accompanying 'License'-file

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

/*
| Export
*/
var Action;


/*
| Imports
*/
var Jools;


/*
| Capsule
*/
( function( ) {
'use strict';

if( typeof( window ) === 'undefined' )
	{ throw new Error('this code needs a browser!'); }


var actionlist = Jools.immute({
	'PAN'        : true,  // panning the background
	'ITEMDRAG'   : true,  // dragging one item
	'ITEMRESIZE' : true,  // resizing one item
	'SCROLLY'    : true,  // scrolling a note
	'RELBIND'    : true,  // binding a new relation
	'REBUTTON'   : true   // holding a button repeating its effect
});


/*
| Constructor.
|
| type: Action type
| recv: object to receive events during action.
| + key value list for additional params
*/
Action = function(args)
{
	var type = this.type    = args[0];
	if( !actionlist[ type ] ) {
		throw new Error( 'invalid action' );
	}

	this.section = args[1];

	switch( this.section )
	{
		case 'space' : break;
		case 'board' : break;
		default      : throw new Error( 'invalid section' );
	}

	for( var a = 2, aZ = args.length; a < aZ; a += 2 )
	{
		this[ args[ a ] ] = args[ a + 1 ];
	}
};

} )( );
