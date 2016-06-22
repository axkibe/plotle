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
| Initializes the widget.
*/
prototype._init =
	function( )
{
	this.pos =
		this.superArea
		? this.designPos.compute( this.superArea )
		: undefined;
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
		gleam_glint_text.create(
			'font', this.font,
			'key', this.key,
			'p', this.pos,
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
