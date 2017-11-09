/*
| The moveTo or 'go' form.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'form_moveTo',
		hasAbstract : true,
		attributes :
		{
			hover :
			{
				comment : 'the widget hovered upon',
				type : [ 'undefined', 'jion$path' ]
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../visual/mark/typemap' )
					.concat( [ 'undefined' ] ),
				prepare : 'form_form.concernsMark( mark, path )'
			},
			path :
			{
				comment : 'the path of the form',
				type : [ 'undefined', 'jion$path' ]
			},
			spaceRef :
			{
				comment : 'the reference to the current space',
				type : [ 'undefined', 'ref_space' ],
				assign : ''
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ]
			},
			userSpaceList :
			{
				comment : 'list of spaces belonging to user',
				type : [ 'undefined', 'ref_spaceList' ]
			},
			viewSize :
			{
				comment : 'current view size',
				type : 'gleam_size'
			}
		},
		init : [ 'twigDup' ],
		twig : require( '../form/typemap-widget' )
	};
}


var
	form_form,
	form_moveTo,
	gleam_point,
	gleam_rect,
	gleam_transform,
	gruga_mainDisc,
	gruga_moveToSpaceButtonTemplate,
	gruga_scrollbar,
	jion,
	ref_space;


/*
| Capsule
*/
(function( ) {
'use strict';


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = form_moveTo.prototype;


/*
| The moveto form.
*/
prototype._init =
	function(
		twigDup
	)
{
	var
		a,
		aZ,
		avw,
		button,
		c,
		ch,
		center,
		cOff,
		cLen,
		cols,
		cy,
		discDistance,
		dw, // disc width
		fullname,
		r,
		sb,
		sbRanks,
		sbTwig,
		rows,
		rSpace,
		twig,
		userSpaceList,
		vh,
		x0,
		y0;

	if( !this.path ) return;

	sb = this._twig.scrollbox;

	sbRanks = [ 'ideoloom:home', 'ideoloom:sandbox' ];

	sbTwig = {
		'ideoloom:home'    : sb.get( 'ideoloom:home' ),
		'ideoloom:sandbox' : sb.get( 'ideoloom:sandbox' )
	};

	userSpaceList = this.userSpaceList;
		
	twig = twigDup ? this._twig : jion.copy( this._twig );

	dw = root ? root.disc.get( 'mainDisc' ).tZone.width : gruga_mainDisc.size.width;

	discDistance = 20;

	// available width
	avw = this.viewSize.width - dw - discDistance - gruga_scrollbar.strength;

	x0 = dw + discDistance;
	
	y0 = 10 + twig.headline.font.size;

	vh = this.viewSize.height;

	center =
		gleam_point.xy(
			x0 + Math.round( avw / 2 ),
			Math.round( vh / 2 )
		);

	cols = Math.floor( ( avw + 30 ) / 160 );

	// cols in currnt row
	cLen = cols;

	rows =
		userSpaceList
		? Math.ceil( userSpaceList.length / cols )
		: 0;

	// content height
	ch = twig.headline.font.size * 2 + 160 + rows * 160;

	/*
	height =
		Math.min(
			150 + rows * 160,
			vh - twig.headline.font.size * 2
		);
	*/

	cy = vh / 2 - ch / 2;

	// no longer vertical centered and need to start scrolling
	if( cy < y0 ) cy = y0;

	twig.headline =
		twig.headline.create(
			'pos', gleam_point.xy( x0 + ( cols - 0.5 ) * 80 + 30, cy )
		);

	cy += 50;

	// buttons are in the scrollbox
	button = sbTwig[ 'ideoloom:home' ];

	sbTwig[ 'ideoloom:home' ] =
		button.create( 
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( cols - 2 ) / 2, 0 )
				)
		);

	button = sbTwig[ 'ideoloom:sandbox' ];

	sbTwig[ 'ideoloom:sandbox' ] =
		button.create(
			'zone',
				button.zone.create(
					'pos', gleam_point.xy( 160 * ( cols ) / 2, 0 )
				)
		);

	if( userSpaceList )
	{
		c = 0; // current column
		
		cOff = 0; // column offset (for last row)
		
		r = 1; // current row

		for( a = 0, aZ = userSpaceList.length; a < aZ; a++ )
		{
			rSpace = userSpaceList.get( a );

			fullname = rSpace.fullname;

			button = this._twig[ fullname ];

			if( !button ) button = gruga_moveToSpaceButtonTemplate;

			sbRanks.push( fullname );

			sbTwig[ fullname ] =
				button.create(
					'zone',
						button.zone.create(
							'pos', gleam_point.xy( 160 * ( cOff + c ), 160 * r )
						),
					'text', rSpace.username + '\n' + rSpace.tag,
					'transform', gleam_transform.normal
				);

			if( ++c >= cols )
			{
				c = 0;

				r++;

				if( r >= rows )
				{
					cLen = aZ % cols;

					if( cLen === 0 ) cLen = cols;

					cOff = ( cols - cLen ) / 2;
				}
			}
		}
	}

	twig.scrollbox =
		sb.create(
			'yScrollbarOffset', form_moveTo.yScrollbarOffset,
			'zone',
				gleam_rect.create(
					'pos', gleam_point.xy( x0, cy ),
					'width', avw + gruga_scrollbar.strength,
					'height', vh - cy
				),
			'twig:init', sbTwig, sbRanks
		);

	this._twig = twig;

	form_form.init.call( this, true /* twigDup always set to true */ );
};


/*
| Offset of the vertical scrollbar, set so it's within the scrollbox.
*/
jion.lazyStaticValue(
	form_moveTo,
	'yScrollbarOffset',
	function( )
{
	return(
		gleam_point.xy(
			Math.ceil( -gruga_scrollbar.strength / 2 ) - 1,
			0
		)
	);
}
);


/*
| The attention center.
*/
jion.lazyValue(
	prototype,
	'attentionCenter',
	form_form.getAttentionCenter
);


/*
| User clicked.
*/
prototype.click = form_form.click;


/*
| Cycles the focus.
*/
prototype.cycleFocus = form_form.cycleFocus;


/*
| Moving during an operation with the mouse button held down.
*/
prototype.dragMove =
	function(
		// p
		// shift,
		// ctrl
	)
{
	return true;
};


/*
| Starts an operation with the pointing device active.
|
| Mouse down or finger on screen.
*/
prototype.dragStart =
	function(
		// p,
		// shift,
		// ctrl
	)
{
	return false;
};


/*
| Stops an operation with the mouse button held down.
*/
prototype.dragStop =
	function(
		//p,
		//shift,
		//ctrl
	)
{
	return true;
};


/*
| The form's glint.
*/
jion.lazyValue( prototype, 'glint', form_form.glint );


/*
| The focused widget.
*/
jion.lazyValue(
	prototype,
	'focusedWidget',
	form_form.getFocusedWidget
);


/*
| User is inputing text.
*/
prototype.input = form_form.input;


/*
| Mouse wheel.
*/
prototype.mousewheel = form_form.mousewheel;


/*
| If point is on the form returns its hovering state.
*/
prototype.pointingHover = form_form.pointingHover;


/*
| A button of the form has been pushed.
*/
prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{
	var
		buttonName,
		parts;

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflectName ) throw new Error( );
/**/}

	buttonName = path.get( -1 );

	parts = buttonName.split( ':' );

	root.moveToSpace(
		ref_space.create(
			'username', parts[ 0 ],
			'tag',  parts[ 1 ]
		),
		false
	);
};


/*
| The disc is shown while a form is shown.
*/
prototype.showDisc = true;


/*
| User is pressing a special key.
*/
prototype.specialKey = form_form.specialKey;


})( );

