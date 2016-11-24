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
			pos :
			{
				comment : 'designed pos',
				type : 'euclid_point'
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
| The transformed position of the label.
*/
jion.lazyValue(
	prototype,
	'_pos',
	function( )
{
	return this.pos.transform( this.transform );
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
