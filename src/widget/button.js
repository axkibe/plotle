/*
| A button.
*/
'use strict';


tim.define( module, ( def, widget_button ) => {


def.extend = './base';


if( TIM )
{
	def.attributes =
	{
		// true if the button is down
		down : { type : 'boolean', defaultValue : 'false' },

		// style facets
		facets : { type : '../gleam/facetList' },

		// font of the text
		font : { type : [ 'undefined', '../gleam/font/font' ] },

		// component hovered upon
		hover : { type : [ 'undefined', '< ../trace/hover-types' ] },

		// icon shape
		iconShape : { type : [ '< ../gleam/shape-types', 'undefined' ] },

		// icon facet
		iconFacet : { type : [ 'undefined', '../gleam/facet' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types' ] },

		// shape of the button
		shape : { type : [ 'string', '../gleam/ellipse' ] },

		// the text written in the button
		text : { type : 'string', defaultValue : '""' },

		// vertical distance of newline
		textNewline : { type : [ 'undefined', 'number' ] },

		// rotation of the text
		textRotation : { type : [ 'undefined', 'number' ] },

		// designed zone
		zone : { type : '../gleam/rect' },
	};
}


const action_none = tim.require( '../action/none' );

const gleam_ellipse = tim.require( '../gleam/ellipse' );

const gleam_glint_list = tim.require( '../gleam/glint/list' );

const gleam_glint_paint = tim.require( '../gleam/glint/paint' );

const gleam_glint_text = tim.require( '../gleam/glint/text' );

const gleam_glint_pane = tim.require( '../gleam/glint/pane' );

const gleam_glint_window = tim.require( '../gleam/glint/window' );

const gleam_point = tim.require( '../gleam/point' );

const gleam_transform = tim.require( '../gleam/transform' );

const layout_button = tim.require( '../layout/button' );

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
		layout,     // of type layout_label
		path,       // path of the widget
		trace,      // trace of the widget
		transform   // visual transformation
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 4 ) throw new Error( );
/**/
/**/	if( layout.timtype !== layout_button ) throw new Error( );
/**/}

	return(
		widget_button.create(
			'facets', layout.facets,
			'font', layout.font,
			'iconShape', layout.iconShape,
			'iconFacet', layout.iconFacet,
			'path', path,
			'shape', layout.shape,
			'text', layout.text,
			'textNewline', layout.textNewline,
			'textRotation', layout.textRotation,
			'trace', trace,
			'transform', transform,
			'visible', layout.visible,
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

	const zone = this._tZone.enlarge1;

	return(
		gleam_glint_window.create(
			'pane',
				gleam_glint_pane.create(
					'glint', this._glint,
					'size', zone.size
				),
			'pos', zone.pos,
		)
	);
};


/*
| The font of the button label.
*/
def.lazy._font =
	function( )
{
	return this.font.create( 'size', this.transform.scale( this.font.size ) );
};


/*
| The button's inner glint.
*/
def.lazy._glint =
	function( )
{
	const facet =
		this.facets.getFacet(
			'down', this.down,
			'hover', !!this.hover,
			'focus', !!this.mark
		);

	const arr = [ gleam_glint_paint.createFacetShape( facet, this._tzShape ) ];

	let text = this.text;

	if( text )
	{
		let newline = this.textNewline;

		const font = this._font;

		if( newline === undefined )
		{
			arr.push(
				gleam_glint_text.create(
					'align', 'center',
					'base', 'middle',
					'font', font,
					'p', this._pc,
					'rotate', this.textRotation,
					'text', text
				)
			);
		}
		else
		{
			newline = this.transform.scale( newline );

			text = text.split( '\n' );

			const tlen = text.length;

			let y = -( tlen - 1 ) / 2 * newline;

			for( let t = 0; t < tlen; t++, y += newline )
			{
				arr.push(
					gleam_glint_text.create(
						'align', 'center',
						'base', 'middle',
						'font', font,
						'p', this._pc.add( 0, y ),
						'text', text[ t ]
					)
				);
			}
		}
	}

	if( this.iconShape )
	{
		arr.push(
			gleam_glint_paint.createFacetShape( this.iconFacet, this._iconShape )
		);
	}

	return gleam_glint_list.create( 'list:init', arr );
};


/*
| The transformed zone of the button.
*/
def.lazy._tZone =
	function( )
{
	return this.zone.transform( this.transform );
};



/*
| The transformed iconShape.
*/
def.lazy._iconShape =
	function( )
{
	return(
		this.iconShape
		.transform(
			gleam_transform.create(
				'offset', this.zone.zeroPos.pc,
				'zoom', 1
			)
		)
		.transform( this.transform )
	);
};


/*
| The shape of the button
| transformed and zero positioned.
*/
def.lazy._tzShape =
	function( )
{
	switch( this.shape )
	{
		case 'ellipse' :
		{
			const tZone = this._tZone;

			return(
				gleam_ellipse.create(
					'pos', gleam_point.zero,
					'width', tZone.width - 1,
					'height', tZone.height - 1
				)
			);
		}

		default : return this.shape.transform( this.transform );
	}
};


/*
| The key of this widget.
*/
def.lazy._pc =
	function( )
{
	return this._tZone.zeroPos.pc;
};


/*
| Buttons are focusable.
*/
def.proto.focusable = true;


/*
| User clicked.
*/
def.proto.click =
	function(
		p,
		shift,
		ctrl
	)
{
	if( !this.within( p ) ) return;

	root.pushButton( this.trace );

	return false;
};


/*
| Start an operation with the poiting device button held down.
*/
def.proto.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
/**/if( CHECK )
/**/{
/**/	if( arguments.length !== 3 ) throw new Error( );
/**/}

	if( !this.within( p ) ) return;

	root.dragStartButton( this.trace );

	return true;
};


/*
| Stops an operation with the poiting device button held down.
*/
def.proto.dragStop =
	function( )
{
	root.alter( 'action', action_none.singleton );
};


/*
| Any normal key for a button having focus triggers a push.
*/
def.proto.input =
	function(
		text
	)
{
	root.pushButton( this.trace );

	return true;
};


/*
| Mouse wheel is being turned.
*/
def.proto.mousewheel =
	function(
		p,
		shift,
		ctrl
	)
{
};


/*
| Mouse hover.
*/
def.proto.pointingHover =
	function(
		p
	)
{
	if( !this.within( p ) ) return;

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

		case 'enter' : root.pushButton( this.trace ); return;
	}
};


/*
| Returns true if p is within
| the button
*/
def.proto.within =
	function(
		p
	)
{
	return(
		this.visible
		&& this._tZone.within( p )
		&& this._tzShape.within( p.sub( this._tZone.pos ) )
	);
};


} );
