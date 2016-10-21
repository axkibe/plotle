/*
| A label.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'widget_label',
		hasAbstract : true,
		attributes :
		{
			designPos :
			{
				comment : 'designed position of the text',
				type : 'euclid_anchor_point'
			},
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				assign : ''
			},
			font :
			{
				comment : 'font of the text',
				type : [ 'undefined', 'gleam_font' ]
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/visualMark' )
					.concat( ['undefined' ] ),
				assign : ''
			},
			newline :
			{
				comment : 'vertical distance of newline',
				type : [ 'undefined', 'number' ]
			},
			path :
			{
				comment : 'the path of the widget',
				type : [ 'undefined', 'jion$path' ]
			},
			// FIXME remove?
			superArea :
			{
				comment : 'the area the widget resides in',
				type : [ 'undefined', 'euclid_rect' ]
			},
			text :
			{
				comment : 'the label text',
				type : 'string'
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
			}
		}
	};
}


var
	euclid_point,
	euclid_rect,
	gleam_glint_text,
	jion,
	widget_label;


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

prototype = widget_label.prototype;


/*
| The unanchored position of the label.
*/
jion.lazyValue(
	prototype,
	'_pos',
	function( )
{
	return(
		// FIXME recomplicate
		this.designPos.compute(
			euclid_rect.create(
				'pnw', euclid_point.zero,
				'pse',
					this.superArea.zeroPnw.pse.detransform( this.transform )
			)
		)
		.transform( this.transform )
	);
}
);


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
		gleam_glint_text.create(
			'font', this.font,
			'p', this._pos,
			'text', this.text
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
| User is hovering his/her pointer ( mouse move )
*/
prototype.pointingHover =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return undefined;
};


/*
| User clicked.
*/
prototype.click =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return undefined;
};


} ) ( );
