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
			designFrame :
			{
				comment : 'designed frame ( using anchors )',
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
				type : 'euclid_facetRay'
			},
			font :
			{
				comment : 'font of the text',
				type : [ 'undefined', 'euclid_font' ]
			},
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'widget_widget.concernsHover( hover, path )'
			},
			iconAnchorShape :
			{
				comment : 'icon anchor shape',
				type :
					require( '../typemaps/anchorShape' )
					.concat( [ 'undefined' ] )
			},
			iconFacet :
			{
				comment : 'icon facet',
				type : [ 'undefined', 'euclid_facet' ]
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
			superFrame :
			{
				comment : 'the frame the widget resides in',
				type : [ 'undefined', 'euclid_rect' ]
			},
			text :
			{
				comment : 'the text written in the button',
				type : 'string',
				defaultValue : '""'
			},
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
				type : [ 'undefined', 'euclid_view' ]
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
	euclid_display,
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
		font,
		frame,
		fs,
		view;

	view = this.view;

	if( this.superFrame )
	{
		frame =
		this.frame =
			this.designFrame.compute( this.superFrame, view );

		this._shape = this.shape.compute( frame.zeroPnw, view );

		if( this.iconAnchorShape )
		{
			this._iconShape =
				this.iconAnchorShape.compute( frame.zeroPnw, view );
		}
	}
	else
	{
		this.frame = undefined;

		this._shape = undefined;
	}

	font = this.font;

	if( font )
	{
		if( view ) // FIXME make view required
		{
			fs = view.scale( font.size );

			if( !this._font || this._font.size !== fs )
			{
				this._font = font.create( 'size', fs );
			}
		}
		else
		{
			this._font = font;
		}
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
		|| !this.frame.within( p )
		|| !this._display.withinSketch(
			this._shape,
			p.sub( this.frame.pnw )
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
		!this.frame.within( p ) ||
		!this._display.withinSketch(
			this._shape,
			p.sub( this.frame.pnw )
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
| Draws the button.
*/
prototype.draw =
	function(
		display
	)
{
	if( !this.visible ) return;

	display.drawImage(
		'image', this._display,
		'pnw', this.frame.pnw
	);
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
| The computed position of the button text.
*/
jion.lazyValue(
	prototype,
	'textPos',
	function( )
{
	return this.textDesignPos.compute( this.frame.zeroPnw, this.view );
}
);


/*
| The button's display.
*/
jion.lazyValue(
	prototype,
	'_display',
	function( )
{
	var
		a,
		display,
		facet,
		font,
		newline,
		text,
		tZ,
		x,
		y;

	display =
		euclid_display.create(
			'width', this.frame.width,
			'height', this.frame.height
		);

	facet =
		this.facets.getFacet(
			'down', this.down,
			'hover', !!( this.hover && this.hover.equals( this.path ) ),
			'focus', !!this.mark
		);

	display.paint( facet, this._shape );

	if( this.text )
	{
		newline = this.textNewline;

		font = this._font;

		if( newline === undefined )
		{
			display.paintText(
				'text', this.text,
				'p', this.textPos,
				'font', font,
				'rotate', this.textRotation
			);
		}
		else
		{
			newline = this.view.scale( newline );

			x = this.textPos.x;

			y = this.textPos.y;

			text = this.text.split( '\n' );

			tZ = text.length;

			y -= Math.round( ( tZ - 1 ) / 2 * newline );

			for( a = 0; a < tZ; a++, y += newline )
			{
				display.paintText(
					'text', text[ a ],
					'xy', x, y,
					'font', font
				);
			}
		}
	}

	if( this._iconShape ) display.paint( this.iconFacet, this._iconShape );

	return display;
}
);



} )( );
