/*
| A scrollbox.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'widget_scrollbox',
		hasAbstract : true,
		attributes :
		{
			hover :
			{
				comment : 'component hovered upon',
				type : [ 'undefined', 'jion$path' ],
				assign : ''
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../visual/mark/typemap' )
					.concat( ['undefined' ] ),
				assign : ''
			},
			path :
			{
				comment : 'the path of the widget',
				type : [ 'undefined', 'jion$path' ]
			},
			pos :
			{
				comment : 'designed pos',
				type : 'gleam_point'
			},
			transform :
			{
				comment : 'the transform',
				type : 'gleam_transform'
			}
		},
		twig : require( '../form/typemap-widget' )
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
