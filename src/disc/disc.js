/*
| A disc panel.
*/


/*
| Export
*/
var
	disc_disc,
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
		frame;

	frame =
	this.frame =
		this.designFrame.compute( this.view.baseFrame );

	this.silhoutte = this.shape.compute( frame.zeropnw );
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
