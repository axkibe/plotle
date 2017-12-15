/*
| A button.
*/
'use strict';


// FIXME
var
	gleam_ellipse,
	gleam_glint_list,
	gleam_glint_paint,
	gleam_glint_text,
	gleam_glint_window,
	gleam_point,
	gleam_transform,
	result_hover;


tim.define( module, 'widget_button', ( def, widget_button ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.hasAbstract = true;

	def.attributes =
	{
		down :
		{
			// true if the button is down
			type : 'boolean',
			defaultValue : 'false'
		},
		facets :
		{
			// style facets
			type : 'gleam_facetList'
		},
		font :
		{
			// font of the text
			type : [ 'undefined', 'gleam_font' ]
		},
		hover :
		{
			// component hovered upon
			type : [ 'undefined', 'tim$path' ],
			prepare : 'widget_widget.concernsHover( hover, path )'
		},
		iconShape :
		{
			// icon shape
			type :
				require( '../gleam/typemap-shape' )
				.concat( [ 'undefined' ] )
		},
		iconFacet :
		{
			// icon facet
			type : [ 'undefined', 'gleam_facet' ]
		},
		mark :
		{
			// the users mark
			type :
				require( '../visual/mark/typemap' )
				.concat( [ 'undefined' ] ),
			prepare : 'widget_widget.concernsMark( mark, path )'
		},
		path :
		{
			// the path of the widget
			type : [ 'undefined', 'tim$path' ]
		},
		shape :
		{
			// shape of the button
			type : [ 'string', 'gleam_ellipse' ]
		},
		text :
		{
			// the text written in the button
			type : 'string',
			defaultValue : '""'
		},
		textNewline :
		{
			// vertical distance of newline
			type : [ 'undefined', 'number' ]
		},
		textRotation :
		{
			// rotation of the text
			type : [ 'undefined', 'number' ]
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
		},
		zone :
		{
			// designed zone
			type : 'gleam_rect'
		}
	};
}


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

	const tZone = this._tZone;

	return(
		gleam_glint_window.create(
			'glint', this._glint,
			'rect', tZone.enlarge1,
			'offset', gleam_point.zero
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

	const arr =
	[
		gleam_glint_paint.create(
			'facet', facet,
			'shape', this._tzShape
		)
	];

	let text = this.text;

	if( text )
	{
		let newline = this.textNewline;

		const font = this._font;

		if( newline === undefined )
		{
			arr.push(
				gleam_glint_text.create(
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

			const tZ = text.length;

			let y = -( tZ - 1 ) / 2 * newline;

			for( let t = 0; t < tZ; t++, y += newline )
			{
				arr.push(
					gleam_glint_text.create(
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
			gleam_glint_paint.create(
				'facet', this.iconFacet,
				'shape', this._iconShape
			)
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

			const tZone = this._tZone;

			return(
				gleam_ellipse.create(
					'pos', gleam_point.zero,
					'width', tZone.width - 1,
					'height', tZone.height - 1
				)
			);

		default :

			return this.shape.transform( this.transform );
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


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Buttons are focusable.
*/
def.func.focusable = true;


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
	if( !this.within( p ) ) return;

	root.pushButton( this.path );

	return false;
};


/*
| Start an operation with the poiting device button held down.
*/
def.func.dragStart =
	function(
		p,
		shift,
		ctrl
	)
{
	if( !this.within( p ) ) return undefined;

	root.dragStartButton( this.path );

	return true;
};


/*
| Stops an operation with the poiting device button held down.
*/
def.func.dragStop =
	function( )
{
	root.create( 'action', undefined );
};


/*
| Any normal key for a button having focus triggers a push.
*/
def.func.input =
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
| Mouse hover.
*/
def.func.pointingHover =
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
def.func.specialKey =
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
def.func.within =
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
