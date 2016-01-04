/*
| The alteration frame.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_frame',
		attributes :
		{
			view :
			{
				comment : 'the view',
				type : 'euclid_view',
			},
			zone :
			{
				comment : 'the zone the frame encompases',
				type : 'euclid_rect'
			}
		},
		init : [ ]
	};
}


var
	euclid_point,
	euclid_shape,
	euclid_shape_fly,
	euclid_shape_line,
	euclid_shape_start,
	gruga_frame,
	math_half,
	jion,
	visual_frame;

/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = visual_frame.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{
	var
		iDis,
		iPne,
		iPnw,
		iPse,
		iPsw,
		oDis,
		oPne,
		oPnw,
		oPse,
		oPsw,
		vZone;

	iDis = gruga_frame.distance;

	oDis = iDis + gruga_frame.width;

	vZone = this.vZone;

	oPnw = vZone.pnw.add( -oDis, -oDis );

	oPse = vZone.pse.add( +oDis, +oDis );

	oPne = euclid_point.create( 'x', oPse.x, 'y', oPnw.y );

	oPsw = euclid_point.create( 'x', oPnw.x, 'y', oPse.y );

	iPnw = vZone.pnw.add( -iDis, -iDis );

	iPse = vZone.pse.add( +iDis, +iDis );

	iPne = euclid_point.create( 'x', iPse.x, 'y', iPnw.y );

	iPsw = euclid_point.create( 'x', iPnw.x, 'y', iPse.y );

	this._shape =
		euclid_shape.create(
		'ray:init',
		[
			euclid_shape_start.create( 'p', oPnw ),
			euclid_shape_line.create( 'p', oPne ),
			euclid_shape_line.create( 'p', oPse ),
			euclid_shape_line.create( 'p', oPsw ),
			euclid_shape_line.create( 'p', oPnw ),

			euclid_shape_fly.create( 'p', iPnw ),
			euclid_shape_line.create( 'p', iPsw ),
			euclid_shape_line.create( 'p', iPse ),
			euclid_shape_line.create( 'p', iPne ),
			euclid_shape_line.create( 'p', iPnw )
		],
		'pc',
			euclid_point.create(
				'x', math_half( oPse.x + oPnw.x ) ,
				'y', math_half( oPse.y + oPnw.y )
			)
		);
};


/*
| Draws the frame.
*/
prototype.draw =
	function(
		display
	)
{
	display.paint( gruga_frame.facet, this._shape );
};


/*
| Zone in current view.
*/
jion.lazyValue(
	prototype,
	'vZone',
function( )
{
	return this.zone.inView( this.view );
}
);


} )( );
