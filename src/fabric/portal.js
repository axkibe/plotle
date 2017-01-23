/*
| A portal to another space.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
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
				type : 'gleam_rect',
				json : true
			}
		}
	};
}


var
	fabric_portal,
	jion;


/*
| Capsule
*/
( function( ) {
'use strict';


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
