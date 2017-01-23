/*
| A button.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'widget_button',
		hasAbstract : true,
		attributes :
		{
			area :
			{
				comment : 'designed area',
				type : 'gleam_rect'
			},
			down :
			{
				comment : 'true if the button is down',
				type : 'boolean',
				defaultValue : 'false'
			},
			facets :
			{
				comment : 'style facets',
				type : 'gleam_facetRay'
			},
			font :
			{
				comment : 'font of the text',
				type : [ 'undefined', 'gleam_font' ]
			},
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'widget_widget.concernsHover( hover, path )'
			},
			iconShape :
			{
				comment : 'icon shape',
				type :
					require( '../gleam/typemap-shape' )
					.concat( [ 'undefined' ] )
			},
			iconFacet :
			{
				comment : 'icon facet',
				type : [ 'undefined', 'gleam_facet' ]
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../visual/mark/typemap' )
					.concat( [ 'undefined' ] ),
				prepare : 'widget_widget.concernsMark( mark, path )'
			},
			path :
			{
				comment : 'the path of the widget',
				type : [ 'undefined', 'jion$path' ]
			},
			shape :
			{
				comment : 'shape of the button',
				type : [ 'string', 'gleam_ellipse' ]
			},
			text :
			{
				comment : 'the text written in the button',
				type : 'string',
				defaultValue : '""'
			},
			textNewline :
			{
				comment : 'vertical distance of newline',
				type : [ 'undefined', 'number' ]
			},
			textRotation :
			{
				comment : 'rotation of the text',
				type : [ 'undefined', 'number' ]
			},
			transform :
			{
				comment : 'the transform',
				type : 'gleam_transform'
			},
			visible :
			{
				comment : 'if false the button is hidden',
				type : 'boolean',
				defaultValue : 'true'
			}
		}
	};
}


var
	gleam_ellipse,
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_glint_text,
	gleam_glint_window,
	gleam_point,
	gleam_transform,
	jion,
	result_hover,
	root,
	widget_button;


/*
| Capsule
*/
( function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = widget_button.prototype;


/*
| Buttons are focusable.
*/
prototype.focusable = true;


/*
| Mouse hover.
*/
prototype.pointingHover =
	function(
		p
	)
{
	if(
		!this.visible
		|| !this._area.within( p )
		|| !this._glintPaintShape.within(
			p.sub( this._area.pnw )
		)
	)
	{
		return undefined;
	}

	return(
		result_hover.create(
			'path', this.path,
			'cursor', 'pointer'
		)
	);
};


/*
| User clicked.
*/
prototype.click =
	function(
		p
		// shift,
		// ctrl
	)
{
	if(
		!this.visible
		|| !this._area.within( p )
		|| !this._glintPaintShape.within(
			p.sub( this._area.pnw )
		)
	)
	{
		return undefined;
	}

	root.pushButton( this.path );

	return false;
};


/*
| Any normal key for a button having focus triggers a push.
*/
prototype.input =
	function(
		// text
	)
{
	root.pushButton( this.path );

	return true;
};


/*
| Stops a ReButton action.
*/
prototype.dragStop =
	function( )
{
	root.create( 'action', undefined );
};


/*
| The widget's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		area;

	if( !this.visible ) return undefined;

	area = this._area;

	return(
		gleam_glint_window.create(
			'glint', this._glint,
			'p', area.pnw,
			'size', area.size
		)
	);
}
);


/*
| Special keys for buttons having focus
*/
prototype.specialKey =
	function(
		key
		// shift
		// ctrl
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
| The transformed area of the button.
*/
jion.lazyValue(
	prototype,
	'_area',
	function( )
{
	return this.area.transform( this.transform ).align;
}
);


/*
| The font of the button label.
*/
jion.lazyValue(
	prototype,
	'_font',
	function( )
{
	return(
		this.font.create( 'size', this.transform.scale( this.font.size ) )
	);
}
);


/*
| The button's inner glint.
*/
jion.lazyValue(
	prototype,
	'_glint',
	function( )
{
	var
		font,
		gLen,
		gRay,
		newline,
		text,
		t,
		tZ,
		y;

	gRay = [ this._glintPaintShape ];

	gLen = 1;

	if( this.text )
	{
		newline = this.textNewline;

		font = this._font;

		if( newline === undefined )
		{
			gRay[ gLen++ ] =
				gleam_glint_text.create(
					'font', font,
					'p', this._pc,
					'rotate', this.textRotation,
					'text', this.text
				);
		}
		else
		{
			newline = this.transform.scale( newline );

			text = this.text.split( '\n' );

			tZ = text.length;

			y = - ( tZ - 1 ) / 2 * newline;

			for( t = 0; t < tZ; t++, y += newline )
			{
				gRay[ gLen++ ] =
					gleam_glint_text.create(
						'font', font,
						'p', this._pc.add( 0, y ),
						'text', text[ t ]
					);
			}
		}
	}

	if( this.iconShape )
	{
		gRay[ gLen++ ] =
			gleam_glint_paint.create(
				'facet', this.iconFacet,
				'shape', this._iconShape
			);
	}

	return gleam_glint_ray.create( 'ray:init', gRay );
}
);


/*
| The shape glint.
*/
jion.lazyValue(
	prototype,
	'_glintPaintShape',
	function( )
{
	var
		facet;

	facet =
		this.facets.getFacet(
			'down', this.down,
			'hover', !!( this.hover && this.hover.equals( this.path ) ),
			'focus', !!this.mark
		);

	return(
		gleam_glint_paint.create(
			'facet', facet,
			'shape', this._shape
		)
	);
}
);


/*
| The transformed iconShape.
*/
jion.lazyValue(
	prototype,
	'_iconShape',
	function( )
{
	return(
		this.iconShape
		.transform(
			gleam_transform.create(
				'offset', this.area.zeroPnw.pc,
				'zoom', 1
			)
		)
		.transform( this.transform )
	);
}
);


/*
| The shape of the button.
*/
jion.lazyValue(
	prototype,
	'_shape',
	function( )
{
	var
		area;

	switch( this.shape )
	{
		case 'ellipse' :

			area = this._area;

			return(
				gleam_ellipse.create(
					'pnw', gleam_point.zero,
					'pse',
						gleam_point.xy(
							area.width - 1,
							area.height - 1
						)
				)
			);

		default :

			return this.shape.transform( this.transform );
	}
}
);


/*
| The key of this widget.
*/
jion.lazyValue(
	prototype,
	'_pc',
	function( )
{
	return this._area.zeroPnw.pc;
}
);



} )( );
