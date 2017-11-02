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
	gruga_mainDisc,
	gruga_moveToSpaceButtonTemplate,
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
		button,
		c,
		cOff,
		cLen,
		cols,
		dw, // disc width
		fullname,
		gleam_transform,
		height,
		r,
		sb,
		sbRanks,
		sbTwig,
		rows,
		rSpace,
		twig,
		userSpaceList,
		vh,
		vw,
		vw2,
		zy;

	if( !this.path ) return;

	sb = this._twig.scrollbox;

	sbRanks = [ 'ideoloom:home', 'ideoloom:sandbox' ];

	sbTwig = {
		'ideoloom:home'    : sb.get( 'ideoloom:home' ),
		'ideoloom:sandbox' : sb.get( 'ideoloom:sandbox' )
	};

	userSpaceList = this.userSpaceList;
		
	twig = twigDup ? this._twig :  jion.copy( this._twig );

	dw = root ? root.disc.get( 'mainDisc' ).tZone.width : gruga_mainDisc.size.width;

	vw = this.viewSize.width - dw;

	vw2 = Math.round( vw / 2 );

	vh = this.viewSize.height;

	cols = Math.floor( ( vw - 20 ) / 160 );

	cLen = cols;

	rows =
		userSpaceList
		? Math.ceil( userSpaceList.length / cols )
		: 0;

	height = Math.min( 150 + rows * 160, vh - twig.headline.font.size * 2 );

	zy = Math.round( - height / 2 );

	twig.headline =
		twig.headline.create(
			'pos', gleam_point.xy( ( cols - 1 ) * 80 - vw2 + dw + 65, zy )
		);

	zy += 50;
	
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
			'zone',
				gleam_rect.create(
					'pos', gleam_point.xy( -vw2 + dw, zy ),
					'width', vw,
					'height', vh - zy
				),
			'twig:init', sbTwig, sbRanks
		);

	this._twig = twig;

	form_form.init.call( this, true /* twigDup always set to true */ );
};


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
prototype.mousewheel =
	function(
		// p,
		// dir,
		// shift,
		// ctrl
	)
{
	return true;
};


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

	buttonName = path.get( 4 );

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

