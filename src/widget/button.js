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
			designArea :
			{
				comment : 'designed area ( using anchors )',
				type : 'euclid_anchor_rect'
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
			// XXX FIXME cal iconShape
			iconAnchorShape :
			{
				comment : 'icon anchor shape',
				type :
					require( '../euclid/anchor/typemap-shape' )
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
					require( '../typemaps/visualMark' )
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
				// FUTURE allow other types
				type : 'euclid_anchor_ellipse'
			},
			superArea :
			{
				comment : 'the area the widget resides in',
				type : [ 'undefined', 'euclid_rect' ]
			},
			text :
			{
				comment : 'the text written in the button',
				type : 'string',
				defaultValue : '""'
			},
			// FIXME simply call it testPos
			textDesignPos :
			{
				comment : 'designed position of the text',
				type : [ 'undefined', 'euclid_anchor_point' ]
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
			view :
			{
				comment : 'the view for the widget',
				type : 'euclid_view'
			},
			visible :
			{
				comment : 'if false the button is hidden',
				type : 'boolean',
				defaultValue : 'true'
			}
		},
		init : [ ]
	};
}


var
	euclid_point,
	gleam_display_canvas,
	gleam_glint_paint,
	gleam_glint_text,
	gleam_glint_twig,
	gleam_glint_disWindow,
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
| Initializes the widget.
*/
prototype._init =
	function( )
{
	var
		area,
		view;

	view = this.view;

	if( this.superArea )
	{
		// FIXME remove
		area =
		this.area =
			this.designArea.compute(
				this.view.create(
					'height', this.superArea.height,
					'width', this.superArea.width
				)
			).align;

		// XXX FIXME remove
		this._shape =
			this.shape.compute(
				view.create(
					'height', this.area.height,
					'width', this.area.width
				)
			);
	}
	else
	{
		this.area = undefined;

		this._shape = undefined;
	}
};


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
		|| !this.area.within( p )
		|| !this._display.withinSketch(
			this._shape,
			p.sub( this.area.pnw )
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
		!this.visible ||
		!this.area.within( p ) ||
		!this._display.withinSketch(
			this._shape,
			p.sub( this.area.pnw )
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
	if( !this.visible ) return undefined;

	return(
		gleam_glint_disWindow.create(
			'display', this._display,
			'key', this.key,
			'p', this.designArea.pnw
		)
	);
}
);


/*
| The key of this widget.
*/
jion.lazyValue(
	prototype,
	'key',
	function( )
{
	return this.path.get( -1 );
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
| The button's display.
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
{
	var
		facet,
		font,
		glint,
		newline,
		text,
		t,
		tZ,
		y;

	facet =
		this.facets.getFacet(
			'down', this.down,
			'hover', !!( this.hover && this.hover.equals( this.path ) ),
			'focus', !!this.mark
		);

	glint =
		gleam_glint_twig.create(
			'key', 'root',
			'twine:set+',
				gleam_glint_paint.create(
					'facet', facet,
					'key', ':paint',
					'shape', this.shape
				)
		);

	if( this.text )
	{
		newline = this.textNewline;

		font = this.font;

		if( newline === undefined )
		{
			glint =
				glint.create(
					'twine:set+',
						gleam_glint_text.create(
							'font', font,
							'key', ':text',
							'p', this.textDesignPos,
							'rotate', this.textRotation,
							'text', this.text
						)
				);
		}
		else
		{
			text = this.text.split( '\n' );

			tZ = text.length;

			y = - ( tZ - 1 ) / 2 * newline;

			for( t = 0; t < tZ; t++, y += newline )
			{
				glint =
					glint.create(
						'twine:set+',
							gleam_glint_text.create(
								'font', font,
								'key', ':text' + t,
								'p', this.textDesignPos.add( 0, y ),
								'text', text[ t ]
							)
					);
			}
		}
	}
			
	if( this.iconAnchorShape )
	{
		glint =
			glint.create(
				'twine:set+',
					gleam_glint_paint.create(
						'facet', this.iconFacet,
						'key', ':icon',
						'shape', this.iconAnchorShape
					)
			);
	}

	return(
		gleam_display_canvas.create(
			'glint', glint,
			'view',
				this.view.create(
					'pan', euclid_point.zero,
					'height', this.area.height,
					'width', this.area.width
				)
		)
	);
}
);



} )( );
