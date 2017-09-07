/*
| An arrow is a line with arrow heads.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_arrow',
		attributes :
		{
			end1 :
			{
				comment : '"normal" or "arrow"',
				type : 'string'
			},
			end2 :
			{
				comment : '"normal" or "arrow"',
				type : 'string'
			},
			joint1 :
			{
				comment : 'connect to this point or shape',
				type :
					require( './typemap-shape' )
					.concat( [ 'gleam_point' ] )
			},
			joint2 :
			{
				comment : 'connect to this point or shape',
				type :
					require( './typemap-shape' )
					.concat( [ 'gleam_point' ] )
			}
		}
	};
}


var
	gleam_arrow,
	gleam_connect,
	gleam_shape,
	gleam_shape_line,
	gleam_shape_start,
	gruga_relation,
	jion;


/*
| Capsule
*/
(function(){
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;


prototype = gleam_arrow.prototype;

/*
| Returns a shape of an arrow
| going from/to joint1
| from/to joint2.
|
| A joint is either a point or an shape.
*/
gleam_arrow.getArrowShape =
	function(
		joint1,
		end1,
		joint2,
		end2
	)
{
	var
		ad,
		arrowBase,
		d,
		line,
		ms,
		p1,
		p2,
		round,
		sections;

	line = gleam_connect.line( joint1, joint2 );

	p1 = line.p1;

	p2 = line.p2;

	sections = [ ];

	// FUTURE, allow arrows on p1.
	switch( end1 )
	{
		case 'normal':

			sections.push(
				gleam_shape_start.create( 'p', p1 )
			);

			break;

		default :

			// unknown arrow end
			throw new Error( );
	}

	switch( end2 )
	{
		case 'normal' :

			sections.push(
				gleam_shape_line.create( 'p', p2 )
			);

			break;

		case 'arrow' :

			round = Math.round;

			// degree of arrow tail
			d = Math.atan2( p2.y - p1.y, p2.x - p1.x );

			// degree of arrow head
			ad = Math.PI / 12;

			// arrow span
			// the arrow is formed as hexagon piece
			ms = 2 / Math.sqrt(3) * gruga_relation.arrowSize;

			arrowBase =
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
jion.lazyValue(
	prototype,
	'shape',
	function( )
{
	return(
		gleam_arrow.getArrowShape(
			this.joint1,
			this.end1,
			this.joint2,
			this.end2
		)
	);
}
);


} )( );
