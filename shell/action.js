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
{
	throw new Error(
		'this code needs a browser!'
	);
}


var actionList =

	Jools.immute(
		{
			/*
			| Panning the background.
			*/
			'Pan' :
				true,

			/*
			| The finger of item destruction
			| hovering around.
			*/
			'Remove' :
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
			'createNote' :
				true,


			/*
			| Creating a new label
			*/
			'createLabel' :
				true,


			/*
			| Creating a new relation
			*/
			'createRelation' :
				true,


			/*
			| Creating a new portal
			*/
			'createPortal' :
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
Action =
	function(
		args
	)
{
	var
		type =
		this.type =
			args[0];

	if( !actionList[ type ] )
	{
		throw new Error( 'invalid action' );
	}

	for(
		var a = 1, aZ = args.length;
		a < aZ;
		a += 2
	)
	{
		this[ args[ a ] ] =
			args[ a + 1 ];
	}
};

} )( );
