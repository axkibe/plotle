/*
| A button.
*/


var
	euclid_display,
	euclid_view,
	jools,
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
				type : 'euclid_font',
				defaultValue : 'undefined'  // FIXME why?
			},
			hover :
			{
				comment : 'component hovered upon',
				type : 'jion_path',
				defaultValue : 'undefined',
				prepare : 'widget_widget.concernsHover( hover, path )'
			},
			icon :
			{
				comment : 'icon to display',
				type : '->icon',
				defaultValue : 'undefined'
			},
			mark :
			{
				comment : 'the users mark',
				type : '->mark',
				prepare : 'widget_widget.concernsMark( mark, path )',
				defaultValue : 'undefined'
			},
			path :
			{
				comment : 'the path of the widget',
				type : 'jion_path',
				defaultValue : 'undefined'
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
				type : 'euclid_rect',
				defaultValue : 'undefined'
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
				type : 'design_anchorPoint',
				defaultValue : 'undefined' // FIXME why?
			},
			textNewline :
			{
				comment : 'vertical distance of newline',
				type : 'number',
				defaultValue : 'undefined'
			},
			textRotation :
			{
				comment : 'rotation of the text',
				type : 'number',
				defaultValue : 'undefined'
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


/*
| Initializes the widget.
*/
widget_button.prototype._init =
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
widget_button.prototype.focusable = true;


/*
| The button's display.
*/
jools.lazyValue(
	widget_button.prototype,
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
widget_button.prototype.pointingHover =
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
widget_button.prototype.click =
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
widget_button.prototype.specialKey =
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
widget_button.prototype.input =
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
widget_button.prototype.draw =
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
widget_button.prototype.dragStop =
	function( )
{
	root.create( 'action', undefined );
};


} )( );
