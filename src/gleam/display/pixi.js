/*
| Stuff to show.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_display_pixi',
		attributes :
		{
			'container' :
			{
				comment : 'the container to display',
				type : 'gleam_container'
			},
			'height' :
			{
				comment : 'height of the display',
				type : [ 'number' ]
			},
			'width' :
			{
				comment : 'width of the display',
				type : [ 'number' ]
			},
			'_pc' :
			{
				comment : 'the pixi container',
				type : 'protean'
			},
			'_pr' :
			{
				comment : 'the pixi renderer',
				type : 'protean'
			}
		},
		init : [ 'inherit' ]
	};
}


var
	gleam_display_pixi,
	jion,
	PIXI;


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

prototype = gleam_display_pixi.prototype;


/*
| Creates a display around an existing HTML canvas.
*/
gleam_display_pixi.createAroundHTMLCanvas =
	function(
		canvas
	)
{
	var
		pc,
		pr;

	pr = new PIXI.WebGLRenderer( 0, 0, { view: canvas } );

	pc = new PIXI.Container();

	return(
		gleam_display_pixi.create(
			'_pr', pr,
			'_pc', pc,
			'width', canvas.width,
			'height', canvas.height
		)
	);
};


/*
| Initializer.
*/
prototype._init =
	function( inherit )
{
/**/if( CHECK )
/**/{
/**/	if( jion.hasLazyValueSet( inherit, 'expired' ) )
/**/    {
/**/        throw new Error( );
/**/    }
/**/
/**/    inherit.expired;
/**/}
};


/**/if( CHECK )
/**/{
/**/	jion.lazyValue(
/**/		prototype,
/**/		'expired',
/**/		function( )
/**/	{
/**/			return true;
/**/	}
/**/	);
/**/}


/*
| Draws the display.
*/
gleam_display_pixi.prototype.render =
	function( )
{
};


} )( );
