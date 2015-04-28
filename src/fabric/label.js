/*
| An item with resizing text.
*/


var
	fabric_label,
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
	return {
		id : 'fabric_label',
		attributes :
		{
			doc :
			{
				comment : 'the labels document',
				type : 'fabric_doc',
				json : true
			},
			fontsize :
			{
				comment : 'the fontsize of the label',
				type : 'number',
				json : true
			},
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			pnw :
			{
				comment : 'point in the north-west',
				type : 'euclid_point',
				json : true
			}
		},
		init : [ ]
	};
}


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	fabric_label = jion.this( module, 'source' );

	fabric_label.prototype._init = function( ) { };

	return;
}


prototype = fabric_label.prototype;



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

} )( );
