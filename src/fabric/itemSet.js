/*
| A set of items.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.set = [ '< ./item-types' ];
}


const gleam_point = tim.require( '../gleam/point' );
const gleam_rect = tim.require( '../gleam/rect' );
const gleam_rectGroup = tim.require( '../gleam/rectGroup' );


/*
| Returns the all encompassing zone.
*/
def.lazy.zone =
	function( )
{
	const size = this.size;

/**/if( CHECK )
/**/{
/**/	if ( !( size > 0 ) ) throw new Error( );
/**/}

	let z, ny, wx, sy, ex;

	for( let item of this )
	{
		if( !z )
		{
			// first iteration
			z = item.zone;

			if( size === 1 ) return z;

			const pos = z.pos;

			ny = pos.y;
			wx = pos.x;
			sy = ny + z.height;
			ex = wx + z.width;

			continue;
		}

		z = item.zone;

		const pos = z.pos;

		const zex = pos.x + z.width;
		const zsy = pos.y + z.height;

		if( pos.x < wx ) wx = pos.x;
		if( zex > ex ) ex = zex;
		if( pos.y < ny ) ny = pos.y;
		if( zsy > sy ) sy = zsy;
	}

	return(
		gleam_rect.create(
			'pos', gleam_point.createXY( wx, ny ),
			'width', ex - wx,
			'height', sy - ny
		)
	);
};


/*
| Returns the group of zones of the items.
*/
def.lazy.zones =
	function( )
{
	const group = { };

	for( let item of this )
	{
		const key = item.trace.key;

/**/	if( CHECK )
/**/	{
/**/		if( group[ key ] ) throw new Error( );
/**/	}

		group[ key ] = item.zone;
	}

	return gleam_rectGroup.create( 'group:init', group );
};


} );
