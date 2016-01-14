/*
| A checkbox.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'widget_checkbox',
		attributes :
		{
			checked :
			{
				comment : 'true if the checkbox is checked',
				type : 'boolean',
				defaultValue : 'false'
			},
			designArea :
			{
				comment : 'designed area (using anchors)',
				type : 'euclid_anchor_rect'
			},
			facets :
			{
				comment : 'style facets',
				type : 'euclid_facetRay'
			},
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'widget_widget.concernsHover( hover, path )'
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
			superArea :
			{
				comment : 'the area the widget resides in',
				type : [ 'undefined', 'euclid_rect' ]
			},
			visible :
			{
				comment : 'if false the button is hidden',
				type : 'boolean',
				defaultValue : 'true'
			},
			view :
			{
				comment : 'the view for the widget',
				type : [ 'undefined', 'euclid_view' ]
			}
		},
		init : [ ]
	};
}


var
	gruga_iconCheck,
	jion,
	result_hover,
	root,
	widget_checkbox;


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

prototype = widget_checkbox.prototype;


/*
| Initializes the widget.
*/
prototype._init =
	function( )
{
	if( this.superArea )
	{
		this.area = this.designArea.compute( this.superArea );
	}
	else
	{
		this.area = undefined;
	}

};


/*
| The check icon of the check box.
*/
jion.lazyValue(
	prototype,
	'checkIcon',
	function( )
{
	return gruga_iconCheck.shape.compute( this.area, this.view );
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
	if( !this.visible || !this.area.within( p ) ) return undefined;

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
	if( !this.visible ) return undefined;

	if( this.area.within( p ) )
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
		key
		// shift
		// ctrl
	)
{
	switch( key )
	{
		case 'down' :

			root.cycleFormFocus( this.path.get( 2 ), 1 );

			return;

		case 'up' :

			root.cycleFormFocus( this.path.get( 2 ), -1 );

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

	display.paint( facet, this.area );

	if( this.checked ) display.paint( gruga_iconCheck.facet, this.checkIcon );
};



} )( );
