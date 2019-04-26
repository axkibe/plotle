/*
| A snapping grid.
*/
'use strict';


tim.define( module, ( def, visual_grid ) => {


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


const gleam_glint_zoomGrid = tim.require( '../gleam/glint/zoomGrid' );

const gleam_point = tim.require( '../gleam/point' );


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
def.proto.snap =
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
		gleam_point.createXY(
			Math.round( ( p.x - ox ) / sx ) * sx + ox,
			Math.round( ( p.y - oy ) / sy ) * sy + oy
		)
	);
};


/*
| Spacing with grid factor applied.
*/
def.lazy._gSpacing =
	function( )
{
	const grid = this._grid;

	const spacing = this.spacing;

	return gleam_point.createXY( spacing.x * grid, spacing.y * grid );
};


/*
| Spacing with grid factor for visual grid.
*/
def.lazy._gVisualSpacing =
	function( )
{
	const gsp = this._gSpacing;

	return gleam_point.createXY( gsp.x * 4, gsp.y * 4 );
};


/*
| Offset of the major grid.
*/
def.lazy._offset =
	function( )
{
	const o = this.transform.offset;

	const s = this._gVisualSpacing;

	const sx = s.x * 2;
	const sy = s.y * 2;

	return gleam_point.createXY( ( ( o.x % sx ) + sx ) % sx, ( o.y % ( sy ) + sy ) % sy );
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
			'spacing', this._gVisualSpacing
		)
	);
};


} );
