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
		init : [ ],
		twig : require( '../form/typemap-widget' )
	};
}


var
	form_form,
	form_moveTo,
	gleam_point,
	gruga_mainDisc,
	gruga_moveToSpaceButtonTemplate,
	jion,
	ref_space,
	show_form;


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
	function( )
{
	var
		a,
		aZ,
		button,
		c,
		cLen,
		cols,
		colx,
		fullname,
		height,
		r,
		ranks,
		rows,
		rSpace,
		twig,
		userSpaceList,
		vh,
		vw,
		zy;

	if( !this.path ) return;

	ranks = [
		'headline',
		'ideoloom:home',
		'ideoloom:sandbox'
	];

	twig = {
		'headline'         : this._twig.headline,
		'ideoloom:home'    : this._twig[ 'ideoloom:home' ],
		'ideoloom:sandbox' : this._twig[ 'ideoloom:sandbox' ]
	};

	userSpaceList = this.userSpaceList;

	if( userSpaceList )
	{
		vw = this.viewSize.width - gruga_mainDisc.size.width;

		vh = this.viewSize.height;

		c = 0; r = 0;

		cols = Math.floor( vw / 160 );

		cLen = cols;

		colx = gruga_mainDisc.size.width - 65 - cLen * 80;  // * 160 / 2

		rows = Math.ceil( userSpaceList.length / cols );

		height = 150 + rows * 160;

		zy = Math.round( 0 - height / 2 );

		twig.headline =
			twig.headline.create( 'pos', twig.headline.pos.create( 'y', zy ) );

		zy += 50;
	
		button = twig[ 'ideoloom:home' ];

		twig[ 'ideoloom:home' ] =
			button.create( 'zone', button.zone.create( 'pos', button.zone.pos.create( 'y', zy ) ) );

		button = twig[ 'ideoloom:sandbox' ];

		twig[ 'ideoloom:sandbox' ] =
			button.create( 'zone', button.zone.create( 'pos', button.zone.pos.create( 'y', zy ) ) );

		zy += 160;

		for( a = 0, aZ = userSpaceList.length; a < aZ; a++ )
		{
			rSpace = userSpaceList.get( a );

			fullname = rSpace.fullname;

			button = this._twig[ fullname ];

			if( !button ) button = gruga_moveToSpaceButtonTemplate;

			ranks.push( fullname );

			twig[ fullname ] =
				button.abstract(
					'zone',
						button.zone.create(
							'pos', gleam_point.xy( colx + 160 * c, zy + 160 * r )
						),
					'text', rSpace.username + '\n' + rSpace.tag
				);

			if( ++c >= cols )
			{
				c = 0;

				r++;

				if( r + 1 >= rows )
				{
					cLen = aZ % cols;

					colx = gruga_mainDisc.size.width - 65 - cLen * 80;  // * 160 / 2
				}
			}
		}
	}

	this._twig = twig;

	this._ranks = ranks;

	form_form.init.call( this, true /* twigDup always true */ );
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
		buttonName;

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflectName ) throw new Error( );
/**/}

	buttonName = path.get( 4 );

	root.create( 'show', show_form.loading );

	switch( buttonName )
	{
		case 'ideoloomHomeButton' :

			root.moveToSpace( ref_space.ideoloomHome, false );

			break;

		case 'ideoloomSandboxButton' :

			root.moveToSpace( ref_space.ideoloomSandbox, false );

			break;

		case 'userHomeButton' :

			root.moveToSpace(
				ref_space.create(
					'username', this.user.name,
					'tag', 'home'
				),
				false
			);

			break;

		default : throw new Error( );
	}
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

