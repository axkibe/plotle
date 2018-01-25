/*
| A scrollbar.
|
| Used by note and scrollbox.
|
| Currently there are only vertical scrollbars.
*/
'use strict';


// FIXME;
var
	action_scrolly,
	gleam_roundRect,
	gleam_glint_paint,
	gruga_scrollbar,
	result_hover;


tim.define( module, 'widget_scrollbar', ( def, widget_scrollbar ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		scrollpos :
		{
			// scroll position
			type : 'number'
		},
		aperture :
		{
			// the size of the bar
			type : 'number'
		},
		max :
		{
			// maximum scroll position
			// minimum is always zero
			type : 'number'
		},
		path :
		{
			type : [ 'undefined', 'tim$path' ]
		},
		pos :
		{
			type : 'gleam_point'
		},
		size :
		{
			type : 'number'
		},
		transform :
		{
			type : 'gleam_transform'
		}
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The scrollbar's glint.
*/
def.lazy.glint =
	function( )
{
	return(
		gleam_glint_paint.create(
			'facet', gruga_scrollbar.facet,
			'shape', this._tShape
		)
	);
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
def.func.dragStart =
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
def.func.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	if( !this._tShape.within( p ) ) return undefined;

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'ns-resize'
		)
	);
};


/*
| Returns the value of pos change for d pixels in the current zone.
*/
def.func.scale =
	function(
		d
	)
{
	return d * this.max / this.size;
};


} );