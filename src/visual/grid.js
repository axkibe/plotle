/*
| A snapping grid.
*/
'use strict';


tim.define( module, ( def, visual_grid ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// the grid spacing
		spacing : { type : '../gleam/point' },

		// (view) size of the grid
		size : { type : '../gleam/size' },

		// the current transform
		transform : { type : '../gleam/transform' },
	};
}


const gleam_glint_zoomGrid = require( '../gleam/glint/zoomGrid' );

const gleam_point = require( '../gleam/point' );


/*
| Normalizes the grid depending on current zoom.
*/
def.lazy._grid =
	function( )
{
	let grid = this.transform.zoom;

	while( grid > 1 ) grid /= 2;
	while( grid < 0.5 ) grid *= 2;

	return grid;
};


/*
| Snaps a point to the grid
*/
def.func.snap =
	function(
		p
	)
{
	const s = this._gSpacing;
	const sx = s.x;
	const sy = s.y;

	const o = this._offset;
	const ox = o.x;
	const oy = o.y;

	return(
		gleam_point.xy(
			Math.round( ( p.x - ox ) / sx ) * sx + ox,
			Math.round( ( p.y - oy ) / sy ) * sy + oy
		)
	);
};


/*
| Spacing wth grid factor applied
*/
def.lazy._gSpacing =
	function( )
{
	const grid = this._grid;

	const spacing = this.spacing;

	return gleam_point.xy( spacing.x * grid, spacing.y * grid );
};


/*
| Offset of the major grid.
*/
def.lazy._offset =
	function( )
{
	const o = this.transform.offset;

	const s = this._gSpacing;

	return gleam_point.xy( o.x % ( s.x * 2 ), o.y % ( s.y * 2 ) );
};


/*
| Returns a glint for this grid.
*/
def.lazy.glint =
	function( )
{
	return(
		gleam_glint_zoomGrid.create(
			'grid', this._grid,
			'offset', this._offset,
			'size', this.size,
			'spacing', this._gSpacing
		)
	);
};


} );
