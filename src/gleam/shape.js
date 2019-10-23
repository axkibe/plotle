/*
| A generic geometric shape.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// radial gradient radius
		gradientR1 : { type : [ 'undefined', 'number' ] },

		// don't do grid fitting
		nogrid : { type : [ 'undefined', 'boolean'] },

		// center point
		pc : { type : '../gleam/point' },
	};

	def.list = [ '< ./shape/section-types' ];
}


const angle = tim.require( './angle/root' );
const gleam_display_canvas = tim.require( './display/canvas' );
const gleam_shape_line = tim.require( './shape/line' );
const gleam_shape_start = tim.require( './shape/start' );
const gleam_transform = tim.require( './transform' );

const abs = Math.abs;
const atan2 = Math.atan2;
const pi = Math.PI;
const pi2 = 2 * pi;

/*
| Splits funnel dirs below this angle
*/
const SPLIT_ANGLE = 0.01;

/*
| Returns a shape funneled this shape by
| +/- distance.

| It is kind of a zoom to or from central point, but it isn't
| a real scale/zoom, since the border distance is for example
| always 1 regardless how far from central point away.
*/
def.lazyFunc.funnel =
	function(
		d // distance
	)
{
/**/if( CHECK )
/**/{
/**/	if( typeof( d ) !== 'number' ) throw new Error( );
/**/}

	if( d === 0 ) return this;

	const a = [ ];
	for( let section of this )
	{
		const p = section.p;
		if( p === 'close' )
		{
/**/		if( CHECK && section.funnelDir ) throw new Error( );
			a.push( section );
			continue;
		}

		a.push( section.create( 'p', section.funnelDir.funnelPoint( p, d ) ) );
	}

	const r = this.create( 'list:init', a );
	tim.aheadFunction( r, 'funnel', -d, this );
	return r;
};


/*
| Adds the funnel directions to a generic shape.
*/
def.lazy.addFunnelDirs =
	function( )
{
	const list = [ ];

	for( let a = 0, al = this.length - 1; a < al; a++ )
	{
		const cur = this.get( a );
		const next = this.get( a + 1 );
		const prev = this.get( a - 1 < 0 ? al - 1 : a - 1 );
		let np = next.p;
		let pp = prev.p;
		const cp = cur.p;

		if( pp === 'close' ) pp = this.get( 0 ).p;
		if( np === 'close' ) np = this.get( 0 ).p;

		let r1 = atan2( cp.y - pp.y, pp.x - cp.x );
		let r2 = atan2( cp.y - np.y, np.x - cp.x );

		r1 = ( r1 + pi2 ) % pi2;
		r2 = ( r2 + pi2 ) % pi2;

		const d = ( Math.round( ( r1 + r2 ) * 2 / pi ) + 8 ) % 8;
		let dir = angle.iDirByIndex( d );

		if( abs( r1 - r2 ) < SPLIT_ANGLE )
		{
			dir = dir.opposite;

			// split
			list.push(
				cur.create( 'funnelDir', dir.ccw ),
				gleam_shape_line.create( 'p', cur.p, 'funnelDir', dir.cw )
			);

			continue;
		}

		if( r1 < r2 ) dir = dir.opposite;

		list.push( cur.create( 'funnelDir', dir ) );
	}
	list.push( this.last );

	return this.create( 'list:init', list );
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

		if( section.p === 'close' ) { pn = pstart; pstart = undefined; }
		else { pn = section.p; }

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
