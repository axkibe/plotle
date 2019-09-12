/*
| A checkbox.
*/
'use strict';


tim.define( module, ( def, widget_checkbox ) => {


def.extend = './base';

if( TIM )
{
	def.attributes =
	{
		// true if the checkbox is checked
		checked : { type : 'boolean', defaultValue : 'false' },

		// style facets
		facets : { type : '../gleam/facetList' },

		// component hovered upon
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types' ] },

		// designed zone
		zone : { type : '../gleam/rect' },
	};
}

const gleam_glint_list = tim.require( '../gleam/glint/list' );
const gleam_glint_paint = tim.require( '../gleam/glint/paint' );
const gleam_transform = tim.require( '../gleam/transform' );
const gruga_iconCheck = tim.require( '../gruga/icons/check' );
const layout_checkbox = tim.require( '../layout/checkbox' );
const result_hover = tim.require( '../result/hover' );


/*
| Returns the hover if a 'trace'd button concerns about it.
*/
def.static.concernsHover =
def.proto.concernsHover =
	function(
		hover,
		trace
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 2 ) throw new Error( );
/**/}

	if( hover && hover.hasTrace( trace ) ) return hover;
};


/*
| Creates an actual widget from a layout.
*/
def.static.createFromLayout =
	function(
		layout,           // of type layout_label
		trace,            // trace of the widget
		transform,        // visual transformation
		devicePixelRatio  // display's device pixel ratio
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/	if( layout.timtype !== layout_checkbox ) throw new Error( );
/**/	if( typeof( devicePixelRatio ) !== 'number' ) throw new Error( );
/**/}

	return(
		widget_checkbox.create(
			'checked', layout.checked,
			'devicePixelRatio', devicePixelRatio,
			'facets', layout.facets,
			'trace', trace,
			'transform', transform,
			'zone', layout.zone
		)
	);
};


/*
| The widget's glint.
*/
def.lazy.glint =
	function( )
{
	if( !this.visible ) return;

	const facet =
		this.facets.getFacet(
			'hover', !!this.hover,
			'focus', !!this.mark
		);

	let glint =
		gleam_glint_list.create(
			'list:append', gleam_glint_paint.createFacetShape( facet, this._tZone )
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


/*
| CheckBoxes are focusable.
*/
def.proto.focusable = true;


/*
| Toggles the checkbox.
*/
def.proto.toggle =
	function( )
{
	root.toggleCheckbox( this.trace );
};


/*
| User clicked.
*/
def.proto.click =
	function(
		p
		// shift,
		// ctrl
	)
{
	if( !this.visible ) return;

	if( this._tZone.within( p ) )
	{
		this.toggle( );

		return false;
	}
};


/*
| Any normal key for a checkbox triggers it to flip
*/
def.proto.input =
	function(
		text
	)
{
	this.toggle( );

	return true;
};


/*
| Mouse hover.
*/
def.proto.pointingHover =
	function(
		p
	)
{
	if( !this.visible || !this._tZone.within( p ) ) return;

	return result_hover.cursorPointer.create( 'trace', this.trace );
};


/*
| Special keys for buttons having focus
*/
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	switch( key )
	{
		case 'down' : root.cycleFormFocus( this.trace.traceForm.key, 1 ); return;

		case 'up' : root.cycleFormFocus( this.trace.traceForm.key, -1 ); return;

		case 'enter' : this.toggle( ); return;
	}
};


} );
