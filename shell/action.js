/*
| An users action in the making.
|
| This overlays repository data, so for example a move is not transmitted
| with every pixel changed but when the the object is released.
|
| Authors: Axel Kittenberger
*/


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


var actionlist =
	Jools.immute(
		{
			/*
			| Panning the background.
			*/
			'Pan' :
				true,


			/*
			| Dragging one item.
			*/
			'ItemDrag' :
				true,


			/*
			| Resizing one item.
			*/
			'ItemResize' :
				true,


			/*
			| Scrolling a note
			*/
			'ScrollY' :
				true,


			/*
			| Binding a new relation
			*/
			'RelBind' :
				true,


			/*
			| Holding a button repeating its effect.
			*/
			'ReButton' :
				true,


			/*
			| Creating a new note
			*/
			'CreateNote' :
				true,


			/*
			| Creating a new label
			*/
			'CreateLabel' :
				true,


			/*
			| Creating a new portal
			*/
			'CreatePortal' :
				true

		}
	);


/*
| Constructor.
|
| type: Action type
| recv: object to receive events during action.
| + key value list for additional params
*/
Action = function( args )
{
	var type = this.type    = args[0];
	if( !actionlist[ type ] ) {
		throw new Error( 'invalid action' );
	}

	this.section = args[1];

	switch( this.section )
	{
		case 'space' :
			break;

		case 'board' :
			break;

		default :
			throw new Error( 'invalid section' );
	}

	for( var a = 2, aZ = args.length; a < aZ; a += 2 )
	{
		this[ args[ a ] ] = args[ a + 1 ];
	}
};

} )( );
