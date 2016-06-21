/*
| Stuff to show.
|
| FUTURE call schematics
|   createAroundHTMLCanvas
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
			'glint' :
			{
				comment : 'the glint twig to display',
				type : 'gleam_glint_twig'
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
			'_cv' :
			{
				comment : 'the html canvas',
				type : [ 'undefined', 'protean' ]
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
	gleam_glint_twig,
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

	pr =
		new PIXI.WebGLRenderer(
//		new PIXI.CanvasRenderer(
			canvas.width,
			canvas.height,
			{
				antialias : false,
				view: canvas
			}
		);

	pr.backgroundColor = 0xeeeeee;

	pr.autoResize = true;

	pc = new PIXI.Container( );

	return(
		gleam_display_pixi.create(
			'_cv', canvas,
			'_pr', pr,
			'_pc', pc,
			'glint', gleam_glint_twig.create( ),
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
	var
		cv;

/**/if( CHECK )
/**/{
/**/	if( inherit )
/**/	{
/**/		if( jion.hasLazyValueSet( inherit, 'expired' ) )
/**/	    {
/**/    	    throw new Error( );
/**/    	}
/**/
/**/    	inherit.expired;
/**/	}
/**/}

	cv = this._cv;

	if( inherit )
	{
		if( jion.hasLazyValueSet( inherit, '_renderedGlint' ) )
		{
			this._inheritedRenderedGlint =
				inherit._renderedGlint;
		}
		else
		{
			this._inheritedRenderedGlint =
				inherit._inheritedRenderedGlint;
		}
	}

	if( cv.width !== this.width )
	{
		cv.width = this.width;
	}

	if( cv.height !== this.height )
	{
		cv.height = this.height;
	}
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



jion.lazyValue(
	prototype,
	'_renderedGlint',
function( )
{
	return this.glint;
}
);


/*
| Draws the display.
*/
gleam_display_pixi.prototype.render =
	function( )
{
	var
		a,
		aZ,
		g,
		cs,
		pc,
		pcl;

	this._renderedGlint;

	cs = this.glint.get( 'screen' );

	pc = this._pc;

	pcl = pc.children.length;

//		pc.removeChildren( 0, pcl - 1 );

	for( a = 0, aZ = cs.length; a < aZ; a++ )
	{
		g = cs.atRank( a );
		g.sprite;
		if( g.reflect === 'gleam_glint_window' )
		{
			if( pcl === 0 )
			pc.addChild( g.sprite );
		}
	}

	this._pr.render( pc );
};


} )( );
