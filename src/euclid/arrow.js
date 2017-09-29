/*
| An arrow is a line with arrow heads.
*/


var
	euclid_arrow,
	euclid_shape,
	euclid_shape_line,
	euclid_shape_start;


/*
| Capsule
*/
(function(){
'use strict';


var
	arrowSize,
	cos,
	sin;

euclid_arrow = { };

arrowSize = 12;

cos = Math.cos;

sin = Math.sin;


/*
| Returns an arrow shape for a line.
*/
euclid_arrow.shape =
	function(
		line,    // the line
		end1,    // 'normal' or 'arrow'
		end2     // 'normal' or 'arrow'
	)
{
	var
		ad,
		arrowBase,
		d,
		p1,
		p2,
		ms,
		round,
		sections;

	p1 = line.p1;

	p2 = line.p2;

	sections = [ ];

	// FUTURE, allow arrows on p1.
	switch( end1 )
	{
		case 'normal':

			sections.push(
				euclid_shape_start.create( 'p', p1 )
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
				euclid_shape_line.create( 'p', p2 )
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
			ms = 2 / Math.sqrt(3) * arrowSize;

			arrowBase =
				p2.fixPoint(
					-round( ms * cos( d ) ),
					-round( ms * sin( d ) )
				);

			sections.push(
				euclid_shape_line.create( 'p', arrowBase ),
				euclid_shape_line.create(
					'p',
						p2.fixPoint(
							-round( arrowSize * cos( d + ad ) ),
							-round( arrowSize * sin( d + ad ) )
						)
				),
				euclid_shape_line.create( 'p', p2 ),
				euclid_shape_line.create(
					'p',
						p2.fixPoint(
							-round( arrowSize * cos( d - ad ) ),
							-round( arrowSize * sin( d - ad ) )
						)
				),
				euclid_shape_line.create( 'p', arrowBase )
			);


			break;

		// unknown arrow end
		default : throw new Error( );
	}

	sections.push(
		euclid_shape_line.create(
			'close', true,
			'fly', true
		)
	);

	return(
		euclid_shape.create(
			'ray:init', sections,
			'pc', line.pc
		)
	);
};


/**/if( FREEZE )
/**/{
/**/	Object.freeze( euclid_arrow );
/**/}


} )( );
