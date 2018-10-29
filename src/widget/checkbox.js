/*
| A checkbox.
*/
'use strict';


tim.define( module, ( def, widget_checkbox ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// true if the checkbox is checked
		checked : { type : 'boolean', defaultValue : 'false' },

		// style facets
		facets : { type : '../gleam/facetList' },

		// component hovered upon
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// the users mark
		mark : { type : [ '< ../visual/mark/types', 'undefined' ] },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// the transform
		transform : { type : '../gleam/transform' },

		// if false the button is hidden
		visible : { type : 'boolean', defaultValue : 'true' },

		// designed zone
		zone : { type : '../gleam/rect' },
	};
}


const gleam_glint_list = require( '../gleam/glint/list' );

const gleam_glint_paint = require( '../gleam/glint/paint' );

const gleam_transform = require( '../gleam/transform' );

const gruga_iconCheck = require( '../gruga/iconCheck' );

const layout_checkbox = require( '../layout/checkbox' );

const result_hover = require( '../result/hover' );


/*
| Returns the mark if the widget with 'path' concerns about the mark.
*/
def.func.concernsMark =
def.static.concernsMark =
	function(
		mark,
		path
	)
{
	return mark && mark.containsPath( path ) ? mark : undefined;
};


/*
| Returns the hover path if the width with 'path' concerns about the hover.
*/
def.static.concernsHover =
def.func.concernsHover =
	function(
		hover,
		path
	)
{
	return hover && path.subPathOf( hover ) ? hover : undefined;
};


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,     // of type layout_label
		path,       // path of the widget
		transform   // visual transformation
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/
/**/	if( layout.timtype !== layout_checkbox ) throw new Error( );
/**/}

	return(
		widget_checkbox.create(
			'checked', layout.checked,
			'facets', layout.facets,
			'path', path,
			'transform', transform,
			'zone', layout.zone
		)
	);
};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The widget's glint.
*/
def.lazy.glint =
	function( )
{
	if( !this.visible ) return undefined;

	const facet =
		this.facets.getFacet(
			'hover', !!( this.hover && this.hover.equals( this.path ) ),
			'focus', !!this.mark
		);

	let glint =
		gleam_glint_list.create(
			'list:append',
				gleam_glint_paint.create(
					'facet', facet,
					'shape', this._tZone
				)
		);

	if( this.checked )
	{
		glint =
			glint.create(
				'list:append',
					gleam_glint_paint.create(
						'facet', gruga_iconCheck.facet,
						'shape', this._checkIcon
					)
			);
	}

	return glint;
};


/*
| The transformed zone.
*/
def.lazy._tZone =
	function( )
{
	return this.zone.transform( this.transform );
};


/*
| The check icon of the check box.
*/
def.lazy._checkIcon =
	function( )
{
	return(
		gruga_iconCheck.shape.transform(
			gleam_transform.create(
				'zoom', 1,
				'offset', this._tZone.pc
			)
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| CheckBoxes are focusable.
*/
def.func.focusable = true;


/*
| User clicked.
*/
def.func.click =
	function(
		p
		// shift,
		// ctrl
	)
{
	if( !this.visible ) return undefined;

	if( this._tZone.within( p ) )
	{
		root.setPath( this.path.append( 'checked' ), !this.checked );

		return false;
	}
	else
	{
		return undefined;
	}
};


/*
| Any normal key for a checkbox triggers it to flip
*/
def.func.input =
	function(
		text
	)
{
	console.log( 'INPUT', text );
	root.setPath( this.path.append( 'checked' ), !this.checked );

	return true;
};


/*
| Mouse hover.
*/
def.func.pointingHover =
	function(
		p
	)
{
	if( !this.visible || !this._tZone.within( p ) ) return undefined;

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'pointer'
		)
	);
};


/*
| Special keys for buttons having focus
*/
def.func.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	switch( key )
	{
		case 'down' :

			root.cycleFormFocus( this.path.get( 2 ), 1 );

			return;

		case 'up' :

			root.cycleFormFocus( this.path.get( 2 ), -1 );

			return;

		case 'enter' :

			root.setPath(
				this.path.append( 'checked' ),
				!this.checked
			);

			return;
	}
};


} );
