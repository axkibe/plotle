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
		scrollPos : { type : 'number' },

		// the size of the bar
		aperture : { type : 'number' },

		// maximum scroll position
		// minimum is always zero
		max : { type : 'number' },

		pos : { type : '../gleam/point' },

		size : { type : 'number' },
	};
}


const action_scrolly = tim.require( '../action/scrolly' );

const gleam_roundRect = tim.require( '../gleam/roundRect' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gruga_scrollbar = tim.require( '../gruga/scrollbar' );

const result_hover = tim.require( '../result/hover' );


/*
| The scrollbar's glint.
*/
def.lazy.glint =
	function( )
{
	return gleam_glint_paint.createFacetShape( gruga_scrollbar.facet, this.tShape );
};


/*
| Returns the transformed shape of the scrollbar.
*/
def.lazy.tShape =
	function( )
{
	const pos = this.pos;

	const size = this.size;

	const scrollPos = this.scrollPos;

	const max = this.max;

	const ap = this.aperture * size / max;

	const map = Math.max( ap, gruga_scrollbar.minHeight );

	const sy = scrollPos * ( ( size - map + ap ) / max );

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
	if( !this.tShape.within( p ) ) return;

	root.alter(
		'action',
			action_scrolly.create(
				'scrollPath', this.path.shorten,
				'startPoint', p,
				'startPos', this.scrollPos
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
	if( !this.tShape.within( p ) ) return;

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
