/*
| A checkbox.
*/


var
	euclid_color,
	euclid_view,
	icon_check,
	jion,
	result_hover,
	root,
	widget_checkbox;


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
		id : 'widget_checkbox',
		attributes :
		{
			checked :
			{
				comment : 'true if the checkbox is checked',
				type : 'boolean',
				defaultValue : 'false'
			},
			designFrame :
			{
				comment : 'designed frame (using anchors)',
				type : 'design_anchorRect'
			},
			facets :
			{
				comment : 'style facets',
				type : 'design_facetRay'
			},
			hover :
			{
				comment : 'component hovered upon',
				type : 'jion_path',
				defaultValue : 'undefined',
				prepare : 'widget_widget.concernsHover( hover, path )'
			},
			mark :
			{
				comment : 'the users mark',
				type : require( '../typemaps/mark' ),
				defaultValue : 'undefined',
				prepare : 'widget_widget.concernsMark( mark, path )',
				allowsNull : true // FIXME
			},
			path :
			{
				comment : 'the path of the widget',
				type : 'jion_path',
				defaultValue : 'undefined'
			},
			superFrame :
			{
				comment : 'the frame the widget resides in',
				type : 'euclid_rect',
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = widget_checkbox.prototype;


/*
| Initializes the widget.
*/
prototype._init =
	function( )
{
	if( this.superFrame )
	{
		this.frame = this.designFrame.compute( this.superFrame );
	}
	else
	{
		this.frame = undefined;
	}

};


/*
| The check icon of the check box
*/
jion.lazyValue(
	prototype,
	'checkIcon',
	function( )
	{
		return(
			icon_check.create(
				'fill', euclid_color.black,
				'pc', this.frame.pc
			)
		);
	}
);


/*
| CheckBoxes are focusable.
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
	if( !this.visible || !this.frame.within( euclid_view.proper, p ) )
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
| checkbox is being changed.
*/
prototype.change =
	function(
		// shift,
		// ctrl
	)
{
	// no default
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
	if( !this.visible )
	{
		return undefined;
	}

	if( this.frame.within( euclid_view.proper, p ) )
	{
		root.setPath( this.path.append( 'checked' ), !this.checked );

		return false;
	}
	else
	{
		return undefined;
	}
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

			owner.cycleFocus( +1 );

			return;

		case 'up' :

			owner.cycleFocus( -1 );

			return;

		case 'enter' :

			root.setPath(
				this.path.append( 'checked' ),
				!this.checked
			);

			return;
	}
};


/*
| Any normal key for a checkbox triggers it to flip
*/
prototype.input =
	function(
		// text
	)
{
	root.setPath( this.path.append( 'checked' ), !this.checked );

	return true;
};


/*
| Draws the checkbox.
*/
prototype.draw =
	function(
		display
	)
{
	var
		facet;

	if( !this.visible )
	{
		return;
	}

	facet =
		this.facets.getFacet(
			'hover', !!( this.hover && this.hover.equals( this.path ) ),
			'focus', !!this.mark
		);

	display.paint( facet.fill, facet.border, this.frame, euclid_view.proper );

	if( this.checked )
	{
		this.checkIcon.draw( display, euclid_view.proper );
	}
};



} )( );
