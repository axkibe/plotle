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
					require( '../visual/mark/typemap' )
					.concat( [ 'undefined' ] ),
				prepare : 'widget_widget.concernsMark( mark, path )'
			},
			path :
			{
				comment : 'the path of the widget',
				type : [ 'undefined', 'jion$path' ]
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
			},
			zone :
			{
				comment : 'designed zone',
				type : 'gleam_rect'
			}
		}
	};
}


var
	gleam_glint_paint,
	gleam_glint_ray,
	gleam_transform,
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
| The transformed zone.
*/
jion.lazyValue(
	prototype,
	'_tZone',
	function( )
{
	return this.zone.transform( this.transform );
}
);


/*
| The check icon of the check box.
*/
jion.lazyValue(
	prototype,
	'_checkIcon',
	function( )
{
	return(
		gruga_iconCheck.shape.transform(
			gleam_transform.create(
				'zoom', 1,
				'offset', this._tZone.pc
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

	if( this._tZone.within( p ) )
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
		gleam_glint_ray.create(
			'ray:append',
				gleam_glint_paint.create(
					'facet', facet,
					'shape', this._tZone
				)
		);

	if( this.checked )
	{
		glint =
			glint.create(
				'ray:append',
					gleam_glint_paint.create(
						'facet', gruga_iconCheck.facet,
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
| Mouse hover.
*/
prototype.pointingHover =
	function(
		p
	)
{
	if( !this.visible || !this._tZone.within( p ) ) return undefined;

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
