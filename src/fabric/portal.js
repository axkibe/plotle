/*
| A portal to another space.
*/


var
	euclid_rect,
	fabric_portal,
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
		id : 'fabric_portal',
		attributes :
		{
			path :
			{
				comment : 'the path of the doc',
				type : [ 'undefined', 'jion$path' ]
			},
			spaceUser :
			{
				comment : 'owner of the space the portal goes to',
				type : 'string',
				json : true
			},
			spaceTag :
			{
				comment : 'tag of the space the portal goes to',
				type : 'string',
				json : true
			},
			zone :
			{
				comment : 'the portals zone',
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
	fabric_portal = require( 'jion' ).this( module, 'source' );

	fabric_portal.prototype._init = function( ) { };

	return;
}


prototype = fabric_portal.prototype;


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

	minWidth = theme.portal.minWidth;

	minHeight = theme.portal.minHeight;

	if( zone.width  < minWidth || zone.height < minHeight )
	{
		zone =
		this.zone =
			euclid_rect.create(
				'pnw', zone.pnw,
				'pse',
					zone.pnw.add(
						Math.max( minWidth, zone.width ),
						Math.max( minHeight, zone.height )
					)
			);
	}
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
