/*
| Displays stuff using a HTML5 canvas renderer.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'gleam_display_canvas',
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
			'_cv' :
			{
				comment : 'the html canvas',
				type : [ 'undefined', 'protean' ]
			},
			'_cx' :
			{
				comment : 'the html canvas context',
				type : [ 'undefined', 'protean' ]
			}
		},
		init : [ 'inherit' ]
	};
}


var
	gleam_container,
	gleam_display_canvas,
	jion;


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

prototype = gleam_display_canvas.prototype;


/*
| Creates a display around an existing HTML canvas.
*/
gleam_display_canvas.createAroundHTMLCanvas =
	function(
		canvas
	)
{
	var
		cx;

	cx = canvas.getContext( '2d' );

/**/if( CHECK )
/**/{
/**/	if( cx._clip !== undefined )
/**/	{
/**/		// canvas is already wrapped
/**/		throw new Error( );
/**/	}
/**/}

	return(
		gleam_display_canvas.create(
			'_cv', canvas,
			'_cx', cx,
			'container', gleam_container.create( ),
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
/**/	if( inherit )
/**/	{
/**/		if( jion.hasLazyValueSet( inherit, 'expired' ) )
/**/    	{
/**/        	throw new Error( );
/**/    	}
/**/
/**/    	inherit.expired;
/**/	}
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
| Renders the display.
*/
prototype.render =
	function( )
{
	this._cx.clearRect( 0, 0, this.width, this.height );

	this._renderContainer( this.container );
};


/*
| Renders a container.
*/
prototype._renderContainer =
	function( co )
{
	var
		r,
		rZ,
		cx,
		p,
		d;

	cx = this._cx;

	for( r = 0, rZ = co.length; r < rZ; r++ )
	{
		d = co.atRank( r );

		switch( d.reflect )
		{
			case 'gleam_container' :

				this._renderContainer( d );

				break;

			case 'gleam_container_window' :

				p = d.p;

				cx.drawImage( d.display._cv, p.x, p.y );

				break;

			default : throw new Error( );
		}
	}
};


} )( );
