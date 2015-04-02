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
	euclid_rect,
	jools,
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
		style,
		width,
		height,
		ew,
		eh,
		ny;

	style =
	this.style =
		theme.disc[ this.reflectName ],

	width = style.width,

	height = style.height,

	ew = style.ellipse.width,

	eh = style.ellipse.height,

	ny = jools.half( this.view.height - height );

	this.frame =
		euclid_rect.create(
			'pnw', euclid_point.create( 'x', 0, 'y', ny ),
			'pse', euclid_point.create( 'x', width, 'y', ny + height )
		);

	this.silhoutte =
		euclid_ellipse.create(
			'pnw',
				euclid_point.create(
					'x', width - 1 - ew,
					'y', 0 - jools.half( eh - height )
				),
			'pse',
				euclid_point.create(
					'x', width - 1,
					'y', height + jools.half( eh - height )
				),
			'gradientPC',
				euclid_point.create(
					'x', -600,
					'y', jools.half( height )
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
