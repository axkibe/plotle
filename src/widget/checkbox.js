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
		hasAbstract : true,
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
				type : 'gleam_facetRay'
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
			transform :
			{
				comment : 'the transform',
				type : 'euclid_transform'
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
	euclid_view,
	gleam_glint_paint,
	gleam_glint_twig,
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
		this._area =
			this.designArea.compute(
				euclid_view.proper.create(
					'width', this.superArea.width,
					'height', this.superArea.height
				)
			);
	}
};


/*
| The check icon of the check box.
*/
jion.lazyValue(
	prototype,
	'_checkIcon',
	function( )
{
	return(
		gruga_iconCheck.shape
		.compute(
			euclid_view.proper.create(
				'width', this._area.width,
				'height', this._area.height,
				'pan', this._area.pnw
			)
		)
	);
}
);


/*
| CheckBoxes are focusable.
*/
prototype.focusable = true;


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

	if( this._area.within( p ) )
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
| The widget's glint.
*/
jion.lazyValue(
	prototype,
	'glint',
	function( )
{
	var
		facet,
		glint;

	if( !this.visible ) return undefined;

	facet =
		this.facets.getFacet(
			'hover', !!( this.hover && this.hover.equals( this.path ) ),
			'focus', !!this.mark
		);

	glint =
		gleam_glint_twig.create(
			'key', this.key,
			'twine:set+',
				gleam_glint_paint.create(
					'facet', facet,
					'key', 'box',
					'shape', this._area
				)
		);

	if( this.checked )
	{
		glint =
			glint.create(
				'twine:set+',
					gleam_glint_paint.create(
						'facet', gruga_iconCheck.facet,
						'key', 'check',
						'shape', this._checkIcon
					)
			);
	}

	return glint;
}
);


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
| Mouse hover.
*/
prototype.pointingHover =
	function(
		p
	)
{
	if( !this.visible || !this._area.within( p ) ) return undefined;

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


} )( );
