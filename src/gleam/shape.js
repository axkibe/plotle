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


const gleam_display_canvas = require( './display/canvas' );

const gleam_shape_start = require( './shape/start' );

const gleam_transform = require( './transform' );


/*
| Returns a shape bordering this shape by
| +/- distance.

| It is kind of a zoom to or from central point, but it isn't
| a real scale/zoom, since the border distance is for example
| always 1 regardless how far from central point away.
*/
def.func.border =
	function(
		d // distance to border
	)
{
	const arr = [ ];

	const pc = this.pc;

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		const section = this.get( a );

		if( section.close )
		{
			arr[ a ] = section;

			continue;
		}

		const p = section.p;

		arr[ a ] =
			section.create(
				'p', p.border( pc, d )
			);
	}

	return this.create( 'list:init', arr );
};


/*
| Gets the intersection of a projection from this central point
| to point p.
*/
def.func.getProjection =
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

	for( let r = 1, rZ = this.length; r < rZ; r++ )
	{
/**/	if( CHECK )
/**/	{
/**/		// closed prematurely
/**/		if( !pstart ) throw new Error( );
/**/	}

		const section = this.get( r );

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
def.func.transform =
	function(
		transform
	)
{
/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/}

	const arr = [ ];

	for( let a = 0, aZ = this.length; a < aZ; a++ )
	{
		arr[ a ] = this.get( a ).transform( transform );
	}

	return this.create( 'list:init', arr );
};


/*
| Returns true if p is within the shape.
*/
def.func.within =
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
