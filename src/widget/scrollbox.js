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
			scrollPos :
			{
				comment : 'scroll position',
				type : [ 'undefined', 'gleam_point' ]
				// is force defined in _init
			},
			transform :
			{
				comment : 'the transform',
				type : 'gleam_transform'
			},
			scrollbarYOffset :
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
	shell_settings,
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
		innerSize,
		mark,
		name,
		path,
		r,
		ranks,
		rZ,
		twig,
		w,
		zone;

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

	innerSize = this.innerSize;

	zone = this.zone;

	if(
		this.scrollPos === undefined
		|| innerSize.height <= zone.height
	)
	{
		this.scrollPos = gleam_point.zero;
	}
	else if( this.scrollPos.x < 0 || this.scrollPos.y < 0 )
	{
		this.scrollPos =
			this.scrollPos.create(
				'x', Math.max( 0, this.scrollPos.x ),
				'y', Math.max( 0, this.scrollPos.y )
			);
	}

	if(
		innerSize.height > zone.height
		&& this.scrollPos.y > innerSize.height - zone.height
	)
	{
		this.scrollPos =
			this.scrollPos.create(
				'y', innerSize.height - zone.height
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
		sbary;

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
			'offset', gleam_point.xy( -this.scrollPos.x, -this.scrollPos.y )
		);

	sbary = this.scrollbarY;

	if( sbary )
	{
		glint = gleam_glint_list.create( 'list:init', [ glint, sbary.glint ] );
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
	'hasScrollbarY',
	function( )
{
	return this.innerSize.height > this.zone.height;
}
);



jion.lazyValue(
	prototype,
	'scrollbarY',
	function( )
{
	var
		innerSize,
		scrollbarYOffset,
		zone;

	if( !this.hasScrollbarY ) return undefined;

	innerSize = this.innerSize;

	scrollbarYOffset = this.scrollbarYOffset;

	zone = this.zone;

	return(
		widget_scrollbar.create(
			'aperture', zone.height,
			'max', innerSize.height,
			'path', this.path.append( 'scrollbarY' ),
			'pos',
				zone.pos.add(
					zone.width + scrollbarYOffset.x,
					scrollbarYOffset.y
				),
			'scrollpos', this.scrollPos.y,
			'size', zone.height,
			'transform', this.transform
		)
	);
}
);


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
	
	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		res = this.atRank( r ).click( p, shift, ctrl );

		if( res !== undefined ) return res;
	}

	return undefined;
};


/*
| Starts an operation with the pointing device held down.
*/
prototype.dragStart =
	function(
		p,     // cursor point
		shift, // true if shift key was pressed
		ctrl   // true if ctrl key was pressed
	)
{
	var
		bubble,
		r,
		rZ,
		res,
		sbary;

	sbary = this.scrollbarY;

	if( sbary )
	{
		bubble = sbary.dragStart( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}
	
	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		res = this.atRank( r ).click( p, shift, ctrl );

		if( res !== undefined ) return res;
	}

	return undefined;
};


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
		bubble,
		r,
		rZ,
		sbary;

	sbary = this.scrollbarY;

	if( sbary )
	{
		bubble = sbary.pointingHover( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}
	
	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		bubble = this.atRank( r ).pointingHover( p, shift, ctrl );

		if( bubble !== undefined ) return bubble;
	}

	return undefined;
};


/*
| Mouse wheel is being turned.
*/
prototype.mousewheel =
	function(
		p,
		dir,
		shift,
		ctrl
	)
{
	var
		r,
		rZ,
		res;

	if( !this._zone.within( p ) ) return;

	p =
		gleam_point.xy(
			p.x - this._zone.pos.x + this.scrollPos.x,
			p.y - this._zone.pos.y + this.scrollPos.y
		);

	for( r = 0, rZ = this.length; r < rZ; r++ )
	{
		res = this.atRank( r ).mousewheel( p, dir, shift, ctrl );

		if( res ) return res;
	}

	root.setPath(
		this.path.append( 'scrollPos' ),
		this.scrollPos.create(
			'y',
				this.scrollPos.y
				- dir * shell_settings.textWheelSpeed
		)
	);
};


} ) ( );
