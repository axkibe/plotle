/*
| An arrow is a line with arrow heads.
*/
'use strict';


tim.define( module, ( def, gleam_arrow ) => {


const gleam_connect = tim.require( './connect' );

const gleam_shape = tim.require( './shape' );

const gleam_shape_line = tim.require( './shape/line' );

const gleam_shape_start = tim.require( './shape/start' );

const gruga_relation = tim.require( '../gruga/relation' );


if( TIM )
{
	def.attributes =
	{
		// "none" or "arrow"
		end1 : { type : 'string' },

		// "none" or "arrow"
		end2 : { type : 'string' },

		// connect to this point or shape
		joint1 : { type : [ '< ./shape-types', './point' ] },

		// connect to this point or shape
		joint2 : { type : [ '< ./shape-types', './point' ] },
	};
}


/*
| Returns a shape of an arrow
| going from joint1 to joint2.
|
| A joint is either a point or an shape.
*/
def.static.getArrowShape =
	function(
		joint1,  // point/shape for the arrow to go from
		end1,    // 'none' or 'arrow'
		joint2,  // point/shape for the arrow to go to
		end2     // 'none' or 'arrow'
	)
{
	const line = gleam_connect.line( joint1, joint2 );

	const p1 = line.p1;

	const p2 = line.p2;

	const sections = [ ];

	// FUTURE, allow arrows on p1.
	switch( end1 )
	{
		case 'none':

			sections.push( gleam_shape_start.create( 'p', p1 ) );

			break;

		default :

			// unknown arrow end
			throw new Error( );
	}

	switch( end2 )
	{
		case 'none' :

			sections.push( gleam_shape_line.create( 'p', p2 ) );

			break;

		case 'arrow' :
		{
			// degree of arrow tail
			const d = Math.atan2( p2.y - p1.y, p2.x - p1.x );

			// degree of arrow head
			const ad = Math.PI / 12;

			// arrow span
			// the arrow is formed as hexagon piece
			const ms = 2 / Math.sqrt(3) * gruga_relation.arrowSize;

			const arrowBase =
				p2.add(
					-ms * Math.cos( d ),
					-ms * Math.sin( d )
				);

			sections.push(
				gleam_shape_line.create( 'p', arrowBase ),
				gleam_shape_line.create(
					'p',
						p2.add(
							-gruga_relation.arrowSize * Math.cos( d + ad ),
							-gruga_relation.arrowSize * Math.sin( d + ad )
						)
				),
				gleam_shape_line.create( 'p', p2 ),
				gleam_shape_line.create(
					'p',
						p2.add(
							-gruga_relation.arrowSize * Math.cos( d - ad ),
							-gruga_relation.arrowSize * Math.sin( d - ad )
						)
				),
				gleam_shape_line.create( 'p', arrowBase )
			);

			break;
		}

		// unknown arrow end
		default : throw new Error( );
	}

	sections.push(
		gleam_shape_line.create(
			'close', true,
			'fly', true
		)
	);

	return(
		gleam_shape.create(
			'list:init', sections,
			'pc', line.pc
		)
	);
};


/*
| Returns the arrow shape.
*/
def.lazy.shape =
	function( )
{
	return	gleam_arrow.getArrowShape( this.joint1, this.end1, this.joint2, this.end2 );
};


} );
