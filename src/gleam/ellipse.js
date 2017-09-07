/*
| An ellipse.
*/


/*
| The jion definition
*/
if( JION )
{
	throw{
		id : 'gleam_ellipse',
		attributes :
		{
			pos :
			{
				comment : 'position',
				type : 'gleam_point'
			},
			width :
			{
				comment : 'width',
				type : 'number'
			},
			height :
			{
				comment : 'height',
				type : 'number'
			},
			gradientPC :
			{
				comment : 'center for gradient',
				type : [ 'undefined', 'gleam_point' ],
				assign : '_gradientPC'
			},
			gradientR0 :
			{
				comment : 'inner radius for circle gradients',
				type : [ 'undefined', 'number' ],
				assign : '_gradientR0'
			},
			gradientR1 :
			{
				comment : 'outer radius for circle gradients',
				type : [ 'undefined', 'number' ],
				assign : '_gradientR1'
			}
		}
	};
}


var
	gleam_ellipse,
	gleam_point,
	gleam_shape_round,
	gleam_shape,
	gleam_shape_start,
	jion,
	swatch;


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

prototype = gleam_ellipse.prototype;


/*
| Shortcut to create an ellipse by specifying p and size.
*/
gleam_ellipse.posSize =
	function(
		pos,
		size
	)
{
	return(
		gleam_ellipse.create(
			'pos', pos,
			'width', size.width,
			'height', size.height
		)
	);
};


/*
| Returns a moved ellipse.
*/
prototype.add =
	function(
		p
	)
{
	return(
		( p.x === 0 && p.y === 0 )
		? this
		: this.create( 'pos', this.pos.add( p.x, p.y ) )
	);
};


/*
| Returns a shape bordering this shape by d.
*/
prototype.border =
	function(
		d // distance to border
	)
{
	return this.shape.border( d );
};


/*
| Gets the source of a projection to p.
*/
prototype.getProjection =
	function
	(
		// ...
	)
{
	return this.shape.getProjection.apply( this.shape, arguments );
};


/*
| The shape of the ellipse.
*/
jion.lazyValue(
	prototype,
	'shape',
function( )
{
	return(
		gleam_shape.create(
			'list:init',
			[
				gleam_shape_start.create( 'p', this.pw ),
				gleam_shape_round.create( 'p', this.pn ),
				gleam_shape_round.create( 'p', this.pe ),
				gleam_shape_round.create( 'p', this.ps ),
				gleam_shape_round.create( 'close', true )
			],
			'pc', this.pc
		)
	);
}
);


/*
| The center point.
*/
jion.lazyValue(
	prototype,
	'gradientPC',
function( )
{
	if( this._gradientPC ) return this._gradientPC;

	return this.pc;
}
);


/*
| Gradient inner radius.
*/
jion.lazyValue(
	prototype,
	'gradientR1',
	function( )
{
	if( this._gradientR1 ) { return this._gradientR1; }

	return Math.max( this.width, this.height );
}
);


/*
| Gradient inner radius.
*/
jion.lazyValue(
	prototype,
	'gradientR0',
	function( )
{
	if( this._gradientR0 ) return this._gradientR0;

	return 0;
}
);


/*
| Returns a transformed roundRect.
*/
prototype.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.reflect !== 'gleam_transform' ) throw new Error( );
/**/}

	return(
		transform.zoom === 1
		? this.add( transform.offset )
		: this.create(
			'pos', this.pos.transform( transform ),
			'width', transform.scale( this.width ),
			'height', transform.scale( this.height ),
			'gradientPC',
				this.gradientPC !== undefined
				? this.gradientPC.transform( transform )
				: pass,
			'gradientR0',
				this.gradientR0 !== undefined
				? transform.scale( this.gradientR0 )
				: pass,
			'gradientR1',
				this.gradientR1 !== undefined
				? transform.scale( this.gradientR1 )
				: pass
		)
	);
};


/*
| Center point of an ellipse.
*/
jion.lazyValue(
	prototype,
	'pc',
	function( )
{
	return(
		gleam_point.create(
			'x', this.pos.x + this.width / 2,
			'y', this.pos.y + this.height / 2
		)
	);
}
);


/*
| East point.
*/
jion.lazyValue(
	prototype,
	'pe',
	function( )
{
	return this.pos.add( this.width, this.height / 2 );
}
);


/*
| North point.
*/
jion.lazyValue(
	prototype,
	'pn',
	function( )
{
	return this.pos.add( this.width / 2, 0 );
}
);


/*
| South point.
*/
jion.lazyValue(
	prototype,
	'ps',
	function( )
{
	return this.pos.add( this.width / 2, this.height );
}
);


/*
| West point.
*/
jion.lazyValue(
	prototype,
	'pw',
	function( )
{
	var
		pos;

	pos = this.pos;

	return gleam_point.xy( pos.x, pos.y + this.height / 2 );
}
);


/*
| Returns true if p is within the ellipse.
*/
prototype.within =
	function(
		p
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return swatch.within( p, this );
};



} )( );

