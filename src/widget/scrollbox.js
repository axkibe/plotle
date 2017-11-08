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
				prepare : 'widget_widget.concernsHover( hover, path )'
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
			transform :
			{
				comment : 'the transform',
				type : 'gleam_transform'
			},
			yScrollbarOffset :
			{
				comment : 'offset of the scrollbar',
				type : 'gleam_point',
				defaultValue : 'gleam_point.zero'
			},
			zone :
			{
				comment : 'designed zone',
				type : 'gleam_rect'
			},
		},
		init : [ 'twigDup' ],
		twig : require( '../form/typemap-widget' )
	};
}


var
	jion,
	gleam_glint_list,
	gleam_glint_window,
	gleam_point,
	gleam_size,
	widget_scrollbar,
	widget_scrollbox;


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

prototype = widget_scrollbox.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		twigDup
	)
{
	var
		mark,
		name,
		path,
		r,
		ranks,
		rZ,
		twig,
		w;

	if( !this.path ) return;

	// all components of the form
	twig = twigDup ? this._twig :  jion.copy( this._twig );

	mark = this.mark;

	ranks = this._ranks;
	
	for( r = 0, rZ = ranks.length; r < rZ; r++ )
	{
		name = ranks[ r ];

		w = twig[ name ];

		path = w.path || this.path.append( 'twig' ).append( name );

		twig[ name ] =
			w.create(
				'path', path,
				'hover', this.hover,
				'mark', this.mark
			);
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
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
		arr,
		glint,
		r,
		sg,
		w,
		yScrollbar;

	arr = [ ];

	for( r = this.length - 1; r >= 0; r-- )
	{
		w = this.atRank( r );

		sg = w.glint;

		if( sg ) arr.push( sg );
	}

	glint =
		gleam_glint_window.create(
			'glint', gleam_glint_list.create( 'list:init', arr ),
			'rect', this._zone,
			'offset', gleam_point.zero
		);

	yScrollbar = this._yScrollbar;

	if( yScrollbar )
	{
		glint =
			gleam_glint_list.create(
				'list:init',
				[
					glint,
					yScrollbar.glint
				]
			);
	}

	return glint;
}
);


/*
| The widget's inner height and width
*/
jion.lazyValue(
	prototype,
	'innerSize',
	function( )
{
	var
		h,
		pse,
		r,
		widget,
		w;

	w = 0;

	h = 0;

	for( r = this.length - 1; r >= 0; r-- )
	{
		widget = this.atRank( r );

		pse = widget.zone.pse;

		if( pse.x > w ) w = pse.x;

		if( pse.y > h ) h = pse.y;
	}

	return gleam_size.wh( w, h ); 
}
);


/*
| The transformed zone.
*/
jion.lazyValue(
	prototype,
	'_zone',
	function( )
{
	return this.zone.transform( this.transform );
}
);


/*
| Is true when the scrollbox has a vertical bar.
*/
jion.lazyValue(
	prototype,
	'hasYScrollbar',
	function( )
{
	return this.innerSize.height > this.zone.height;
}
);



jion.lazyValue(
	prototype,
	'_yScrollbar',
	function( )
{
	var
		innerSize,
		yScrollbarOffset,
		zone;

	if( !this.hasYScrollbar ) return undefined;

	innerSize = this.innerSize;

	yScrollbarOffset = this.yScrollbarOffset;

	zone = this.zone;

	return(
		widget_scrollbar.create(
			'aperture', zone.height,
			'max', innerSize.height,
			'pos',
				zone.pos.add(
					zone.width + yScrollbarOffset.x,
					yScrollbarOffset.y
				),
//			'scrollpos', this.scrollPos.y,
			'scrollpos', 0,
			'size', zone.height,
			'transform', this.transform
		)
	);
}
);


/*
| User is hovering his/her pointer (mouse move).
*/
prototype.pointingHover =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		r,
		rZ,
		res;
	
	p = p.sub( this._zone.pos );

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		res = this.atRank( r ).pointingHover( p, shift, ctrl );

		if( res !== undefined ) return res;
	}

	return undefined;
};


/*
| User clicked.
*/
prototype.click =
	function(
		p,
		shift,
		ctrl
	)
{
	var
		r,
		rZ,
		res;
	
	p = p.sub( this._zone.pos );

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		res = this.atRank( r ).click( p, shift, ctrl );

		if( res !== undefined ) return res;
	}

	return undefined;
};


} ) ( );
