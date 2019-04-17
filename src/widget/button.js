/*
| A button.
*/
'use strict';


tim.define( module, ( def, widget_button ) => {


def.extend = './widget';


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
		hover : { type : [ 'undefined', 'tim.js/path' ] },

		// icon shape
		iconShape : { type : [ '< ../gleam/shape-types', 'undefined' ] },

		// icon facet
		iconFacet : { type : [ 'undefined', '../gleam/facet' ] },

		// the users mark
		mark : { type : [ 'undefined', '< ../mark/visual-types' ] },

		// the path of the widget
		path : { type : [ 'undefined', 'tim.js/path' ] },

		// shape of the button
		shape : { type : [ 'string', '../gleam/ellipse' ] },

		// the text written in the button
		text : { type : 'string', defaultValue : '""' },

		// vertical distance of newline
		textNewline : { type : [ 'undefined', 'number' ] },

		// rotation of the text
		textRotation : { type : [ 'undefined', 'number' ] },

		// the transform
		transform : { type : '../gleam/transform' },

		// if false the button is hidden
		visible : { type : 'boolean', defaultValue : 'true' },

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
| Returns the mark if the widget with 'path' concerns about the mark.
*/
def.static.concernsMark =
def.proto.concernsMark =
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
def.proto.concernsHover =
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
	if( !this.visible ) return undefined;

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
			'hover', !!( this.hover && this.hover.equals( this.path ) ),
			'focus', !!this.mark
		);

	const arr = [ gleam_glint_paint.createFS( facet, this._tzShape ) ];

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
			gleam_glint_paint.createFS( this.iconFacet, this._iconShape )
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

	root.pushButton( this.path );

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

	if( !this.within( p ) ) return undefined;

	root.dragStartButton( this.path );

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
	root.pushButton( this.path );

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
	return undefined;
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
def.proto.specialKey =
	function(
		key,
		shift,
		ctrl
	)
{
	switch( key )
	{
		case 'down' : root.cycleFormFocus( this.path.get( 2 ), 1 ); return;

		case 'up' : root.cycleFormFocus( this.path.get( 2 ), -1 ); return;

		case 'enter' : root.pushButton( this.path ); return;
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
