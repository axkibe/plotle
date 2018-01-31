/*
| A label.
*/
'use strict';


tim.define( module, 'widget_label', ( def, widget_label ) => {


const gleam_glint_text = require( '../gleam/glint/text' );


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		hover :
		{
			// component hovered upon
			type : [ 'undefined', 'tim$path' ],
			assign : ''
		},
		font :
		{
			// font of the text
			type : [ 'undefined', 'gleam_font' ]
		},
		mark :
		{
			// the users mark
			type :
				require( '../visual/mark/typemap' )
				.concat( ['undefined' ] ),
			assign : ''
		},
		newline :
		{
			// vertical distance of newline
			type : [ 'undefined', 'number' ]
		},
		path :
		{
			// the path of the widget
			type : [ 'undefined', 'tim$path' ]
		},
		pos :
		{
			// designed position
			type : 'gleam_point'
		},
		text :
		{
			// the label text
			type : 'string'
		},
		transform :
		{
			// the transform
			type : 'gleam_transform'
		},
		visible :
		{
			// if false the button is hidden
			type : 'boolean',
			defaultValue : 'true'
		}
	};
}


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The transformed position of the label.
*/
def.lazy._pos =
	function( )
{
	return this.pos.transform( this.transform );
};


/*
| The widget's glint.
*/
def.lazy.glint =
	function( )
{
	if( !this.visible ) return undefined;

	return(
		gleam_glint_text.create(
			'font', this.font,
			'p', this._pos,
			'text', this.text
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| User clicked.
*/
def.func.click =
	function(
		p,
		shift,
		ctrl
	)
{
	return undefined;
};


/*
| Handles a potential dragStart event.
*/
def.func.dragStart =
	function(
		p,       // point where dragging starts
		shift,   // true if shift key was held down
		ctrl     // true if ctrl or meta key was held down
	)
{
	return undefined;
};


/*
| Mouse wheel is being turned.
*/
def.func.mousewheel =
	function(
		p,
		shift,
		ctrl
	)
{
	return undefined;
};


/*
| User is hovering his/her pointer ( mouse move )
*/
def.func.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	return undefined;
};



} );
