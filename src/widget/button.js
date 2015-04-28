/*
| A button.
*/


var
	euclid_display,
	euclid_view,
	jion,
	result_hover,
	root,
	widget_button;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'widget_button',
		hasAbstract : true,
		attributes :
		{
			designFrame :
			{
				comment : 'designed frame (using anchors',
				type : 'design_anchorRect'
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
				type : 'design_facetRay'
			},
			font :
			{
				comment : 'font of the text',
				// FIXME why undefined?
				type : [ 'undefined', 'euclid_font' ]
			},
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'widget_widget.concernsHover( hover, path )'
			},
			icon :
			{
				comment : 'icon to display',
				type :
					require( '../typemaps/icon' )
					.concat( [ 'undefined' ] )
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
				type : 'design_anchorEllipse'
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
				type : [ 'undefined', 'design_anchorPoint' ]
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
	if( this.superFrame )
	{
		this.frame = this.designFrame.compute( this.superFrame );

		this._shape = this.shape.compute( this.frame.zeropnw );
	}
	else
	{
		this.frame = undefined;

		this._shape = undefined;
	}

	// if true repeats the push action if held down
	// FUTURE
	this.repeating = false;
};


/*
| Buttons are focusable.
*/
prototype.focusable = true;


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
		textPos,
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

	display.paint(
		facet.fill,
		facet.border,
		this._shape,
		euclid_view.proper
	);

	if( this.text )
	{
		newline = this.textNewline;

		font = this.font;

		// FIXME put into _init
		textPos =
			this.textDesignPos.compute(
				this.frame.zeropnw
			);

		if( newline === undefined )
		{
			display.paintText(
				'text', this.text,
				'p', textPos,
				'font', font,
				'rotate', this.textRotation
			);
		}
		else
		{
			x = textPos.x;

			y = textPos.y;

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

	if( this.icon )
	{
		this.icon.draw( display, euclid_view.proper );
	}

	return display;
}
);


/*
| Mouse hover.
*/
prototype.pointingHover =
	function(
		p
	)
{
	var
		pp;

	if( !this.visible || !this.frame.within( euclid_view.proper, p ) )
	{
		return undefined;
	}

	pp = p.sub( this.frame.pnw );

	if( !this._display.withinSketch( this._shape, euclid_view.proper, pp ) )
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
	var
		pp;

	if(
		!this.visible
		||
		!this.frame.within( euclid_view.proper, p )
	)
	{
		return undefined;
	}

	pp = p.sub( this.frame.pnw );

	if(
		!this._display.withinSketch( this._shape, euclid_view.proper, pp )
	)
	{
		return undefined;
	}

	root.pushButton( this.path );

	return this.repeating ? 'drag' : false;
};


/*
| Special keys for buttons having focus
*/
prototype.specialKey =
	function(
		key,
		owner
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'down' :

			owner.cycleFocus( 1 );

			return;

		case 'up' :

			owner.cycleFocus( -1 );

			return;

		case 'enter' :

			root.pushButton( this.path );

			return;
	}
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
	if( !this.visible )
	{
		return;
	}

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


} )( );
