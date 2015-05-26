/*
| A fix sized text item.
|
| Has potentionaly a scrollbar.
*/

var
	euclid_rect,
	fabric_note,
	jion,
	theme;


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
	var
		minHeight,
		minWidth,
		zone;

	zone = this.zone;

	minWidth = theme.note.minWidth;

	minHeight = theme.note.minHeight;

	// FIXME modifying the zone here is not
	//       nice since it could destroy change data.

	if(
		zone.width  < minWidth ||
		zone.height < minHeight
	)
	{
		zone =
		this.zone =
			euclid_rect.create(
				'pnw',
					zone.pnw,
				'pse',
					zone.pnw.add(
						Math.max( minWidth, zone.width ),
						Math.max( minHeight, zone.height )
					)
			);
	}

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
