/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/

var
	fabric_note,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'fabric_note',
		attributes :
		{
			doc :
			{
				comment : 'the notes document',
				type : 'fabric_doc',
				json : true
			},
			fontsize :
			{
				comment : 'the fontsize of the note',
				type : 'number',
				json : true
			},
			path :
			{
				comment : 'the path of the note',
				type : [ 'undefined', 'jion$path' ]
			},
			zone :
			{
				comment : 'the notes zone',
				type : 'euclid_rect',
				json : true
			}
		},
		init : [ ]
	};
}


var
	prototype;


/*
| Node includes.
*/
if( NODE )
{
	fabric_note = require( 'jion' ).this( module, 'source' );

	fabric_note.prototype._init = function( ) { };

	return;
}


prototype = fabric_note.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	this.doc =
		this.doc.create(
			'path', this.path && this.path.append( 'doc' )
		);
};


/*
| Forwards zone pnw.
*/
jion.lazyValue(
	prototype,
	'pnw',
	function( )
{
	return this.zone.pnw;
}
);


} )( );
