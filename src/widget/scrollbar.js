/*
| A scrollbar.
|
| Used by note and scrollbox.
|
| Currently there are only vertical scrollbars.
*/
'use strict';


tim.define( module, ( def ) => {


def.extend = './widget';


if( TIM )
{
	def.attributes =
	{
		// scroll position
		scrollpos : { type : 'number' },

		// the size of the bar
		aperture : { type : 'number' },

		// maximum scroll position
		// minimum is always zero
		max : { type : 'number' },

		path : { type : [ 'undefined', 'tim.js/src/path/path' ] },

		pos : { type : '../gleam/point' },

		size : { type : 'number' },

		transform : { type : '../gleam/transform' }
	};
}


const action_scrolly = require( '../action/scrolly' );

const gleam_roundRect = require( '../gleam/roundRect' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gruga_scrollbar = require( '../gruga/scrollbar' );

const result_hover = require( '../result/hover' );


/*
| The scrollbar's glint.
*/
def.lazy.glint =
	function( )
{
	return gleam_glint_paint.createFS( gruga_scrollbar.facet, this._tShape );
};


/*
| Returns the transformed shape of the scrollbar.
*/
def.lazy._tShape =
	function( )
{
	const pos = this.pos;

	const size = this.size;

	const scrollpos = this.scrollpos;

	const max = this.max;

	const ap = this.aperture * size / max;

	const map = Math.max( ap, gruga_scrollbar.minHeight );

	const sy = scrollpos * ( ( size - map + ap ) / max );

	const st = gruga_scrollbar.strength;

	const transform = this.transform;

	return(
		gleam_roundRect.create(
			'pos',
				pos
				.transform( transform )
				.add( -st / 2, transform.scale( sy ) ),
			'width', st,
			'height', transform.scale( map ),
			'a', gruga_scrollbar.ellipseA,
			'b', gruga_scrollbar.ellipseB
		)
	);
};


/*
| Handles a potential dragStart event.
*/
def.proto.dragStart =
	function(
		p          // point where dragging starts
		//shift,   // true if shift key was held down
		//ctrl     // true if ctrl or meta key was held down
	)
{
	if( !this._tShape.within( p ) ) return undefined;

	root.create(
		'action',
			action_scrolly.create(
				'scrollPath', this.path.shorten,
				'startPoint', p,
				'startPos', this.scrollpos
			)
	);

	return true;
};


/*
| User is hovering his/her pointing device.
*/
def.proto.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	if( !this._tShape.within( p ) ) return undefined;

	return result_hover.cursorNSResize.create( 'path', this.path );
};


/*
| Returns the value of pos change for d pixels in the current zone.
*/
def.proto.scale =
	function(
		d
	)
{
	return d * this.max / this.size;
};


} );
