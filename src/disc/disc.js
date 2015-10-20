/*
| A disc panel.
*/


/*
| Export
*/
var
	disc_disc,
	euclid_ellipse,
	euclid_point,
	math_half,
	theme;

/*
| Capsule
*/
( function( ) {
'use strict';


/*
| Constructor
*/
disc_disc = { };


/*
| Common initializer.
*/
disc_disc._init =
	function(
		// inherit
	)
{
	var
		frame,
		height,
		style,
		width,
		ew,
		eh;

	style =
	this.style =
		theme.disc[ this.reflectName ];

	ew = style.ellipse.width;

	eh = style.ellipse.height;

	frame =
	this.frame =
		this.designFrame.compute( this.view.baseFrame );

	width = frame.width;

	height = frame.height;

	this.silhoutte =
		euclid_ellipse.create(
			'pnw',
				euclid_point.create(
					'x', width - 1 - ew,
					'y', 0 - math_half( eh - height )
				),
			'pse',
				euclid_point.create(
					'x', width - 1,
					'y', height + math_half( eh - height )
				),
			'gradientPC',
				euclid_point.create(
					'x', -600,
					'y', math_half( height )
				),
			'gradientR1', 650
		);
};


/*
| Returns the hover path when a disc
| is concerned about it.
*/
disc_disc.concernsHover =
	function(
		hover,  // hover path
		path    // path of the disc
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		path.get( 0 ) !== 'disc'
/**/		|| path.get( 1 ) !== 'twig'
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		(
			hover
			&& hover.length > 2
			&& hover.get( 0 ) === 'disc'
			&& hover.get( 2 ) === path.get( 2 )
		)
		? hover
		: undefined
	);
};


} )( );
