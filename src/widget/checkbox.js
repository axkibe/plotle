/*
| A checkbox.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		// true if the checkbox is checked
		checked : { type : 'boolean', defaultValue : 'false' },

		// style facets
		facets : { type : '../gleam/facetList' },

		// component hovered upon
		hover :
		{
			type : [ 'undefined', 'tim.js/path' ],

			prepare : 'self.concernsHover( hover, path )'
		},

		// the users mark
		mark :
		{
			type : tim.typemap( module, '../visual/mark/mark' ).concat( [ 'undefined' ] ),

			prepare : 'self.concernsMark( mark, path )'
		},

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

const result_hover = require( '../result/hover' );

const widget_widget = require( './widget' );


/*::::::::::::::::::.
:: Static functions
':::::::::::::::::::*/


/*
| Deriving concerns stuff.
*/
def.static.concernsHover = widget_widget.concernsHover;

def.static.concernsMark = widget_widget.concernsMark;


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
| checkbox is being changed.
*/
def.func.change =
	function(
		// shift,
		// ctrl
	)
{
	console.log( 'FIXME is this ever used?' );
	// no default
};


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
