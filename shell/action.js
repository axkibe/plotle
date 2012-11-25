/*
|
| An users action in the making.
|
| This overlays repository data, so for example a move is not transmitted
| with every pixel changed but when the the object is released.
|
| Authors: Axel Kittenberger
|
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


var actionlist = Jools.immute( {
	/*
	| Panning the background.
	*/
	'PAN'         : true,


	/*
	| Dragging one item.
	*/
	'ITEMDRAG'    : true,


	/*
	| Resizing one item.
	*/
	'ITEMRESIZE'  : true,


	/*
	| Scrolling a note
	*/
	'SCROLLY'     : true,


	/*
	| Binding a new relation
	*/
	'RELBIND'     : true,


	/*
	| Holding a button repeating its effect.
	*/
	'REBUTTON'    : true,


	/*
	| Creating a new note
	*/
	'CREATE-NOTE' : true,


	/*
	| Creating a new label
	*/
	'CREATE-LABEL' : true

} );


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
