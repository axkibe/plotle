/*
| A generic geometric shape.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// don't do grid fitting
		nogrid : { type : [ 'undefined', 'boolean'] },

		// center point
		pc : { type : '../gleam/point' },

		// radial gradient radius
		gradientR1 : { type : [ 'undefined', 'number' ] },
	};

	def.list = [ '< ./shape/section-types' ];
}


const gleam_display_canvas = tim.require( './display/canvas' );
const gleam_shape_start = tim.require( './shape/start' );
const gleam_transform = tim.require( './transform' );


/*
| Returns a shape bordering this shape by
| +/- distance.

| It is kind of a zoom to or from central point, but it isn't
| a real scale/zoom, since the border distance is for example
| always 1 regardless how far from central point away.
*/
def.proto.border =
	function(
		d // distance to border
	)
{
	const a = [ ];

	const pc = this.pc;

	for( let section of this )
	{
		if( section.close ) { a.push( section ); continue; }

		a.push(
			section.create( 'p', section.p.border( pc, d ) )
		);
	}

	return this.create( 'list:init', a );
};


/*
| Gets the intersection of a projection from this central point
| to point p.
*/
def.proto.getProjection =
	function(
		p
	)
{
	const pc = this.pc;

/**/if( CHECK )
/**/{
/**/	// must have start at [0]
/**/	if( this.get( 0 ).timtype !== gleam_shape_start ) throw new Error( );
/**/}

	let pstart = this.get( 0 ).p;

	let pp = pstart;

	let pn;

	let first = true;

	for( let section of this )
	{
/**/	if( CHECK )
/**/	{
/**/		// closed prematurely
/**/		if( !pstart ) throw new Error( );
/**/	}

		if( first ) { first = false; continue; }

		if( section.close )
		{
			pn = pstart;

			pstart = undefined;
		}
		else
		{
			pn = section.p;
		}

		const pi = section.getProjection( p, pn, pp, pc );

		if( pi ) return pi;

		pp = pn;
	}

	console.log( 'no section created a projection.' );

	return pc;
};


/*
| Returns a transformed shape.
*/
def.proto.transform =
	function(
		transform
	)
{
/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/}

	const a = [ ];

	for( let section of this )
	{
		a.push( section.transform( transform ) );
	}

	return this.create( 'list:init', a );
};


/*
| Returns true if p is within the shape.
*/
def.proto.within =
	function(
		p
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 1 ) throw new Error( );
/**/}

	return gleam_display_canvas.helper.within( p, this );
};


} );
