/*
| The form root is the master of all forms.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'form_root',
		attributes :
		{
			hover :
			{
				comment : 'the widget hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'form_root.concernsHover( hover )'
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../visual/mark/typemap' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the form root',
				type : 'jion$path'
			},
			spaceRef :
			{
				comment : 'the reference of current space',
				type : [ 'undefined', 'ref_space' ]
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
		// FUTURE make a group instead of twig
		twig :
			[
				'form_loading',
				'form_login',
				'form_moveTo',
				'form_noAccessToSpace',
				'form_nonExistingSpace',
				'form_signUp',
				'form_space',
				'form_user',
				'form_welcome'
			]
	};
}


var
	form_root,
	jion;


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

prototype = form_root.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		twigDup
	)
{
	var
		a,
		aZ,
		form,
		name,
		path,
		ranks,
		twig;

/**/if( CHECK )
/**/{
/**/	if( this.hover && this.hover.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	twig =
		twigDup
		? this._twig
		: jion.copy( this._twig );

	ranks = this._ranks;

	for( a = 0, aZ = ranks.length; a < aZ; a++ )
	{
		name = ranks[ a ];

		form = twig[ name ];

		if( !form.path )
		{
			path =
				this.path
				.append( 'twig' )
				.append( name );
		}
		else
		{
			path = pass;
		}

		twig[ name ] =
			form.create(
				'hover', this.hover,
				'mark', this.mark,
				'path', path,
				'spaceRef', this.spaceRef,
				'user', this.user,
				'viewSize', this.viewSize
			);

/**/	if( CHECK )
/**/	{
/**/		if( twig[ name ].reflectName !== name )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
	}

	if( FREEZE ) Object.freeze( twig );

	this._twig = twig;
};


/*
| Returns the mark if the form root concerns a mark.
*/
form_root.concernsMark =
	function(
		mark
	)
{
	return(
		mark.containsPath( form_root.path )
		? mark
		: undefined
	);
};


/*
| Returns the hover path if the form root concerns about it.
*/
form_root.concernsHover =
	function(
		hover
	)
{
	return(
		hover && hover.get( 0 ) === 'form'
		? hover
		: undefined
	);
};


/*
| Cycles the focus in a form
*/
prototype.cycleFocus =
	function(
		formName,
		dir
	)
{
	var
		form;

	form = this.get( formName );

/**/if( CHECK )
/**/{
/**/	if( !form ) throw new Error( );
/**/}

	return form.cycleFocus( dir );
};


/*
| A button has been dragStarted.
*/
prototype.dragStartButton =
	function(
		// path
	)
{
	return false;
};


/*
| A button has been pushed.
*/
prototype.pushButton =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		path.length < 3
/**/		|| path.get( 0 ) !== 'form'
/**/		|| path.get( 1 ) !== 'twig'
/**/		|| !this.get( path.get( 2 ) )
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return(
		this.get( path.get( 2 ) ).pushButton(
			path,
			false, // FUTURE honor shift / ctrl states
			false
		)
	);
};


} )( );
