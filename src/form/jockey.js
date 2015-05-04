/*
| The form jockey is the master of all discs
*/


var
	form_jockey,
	jion;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return{
		id : 'form_jockey',
		attributes :
		{
			hover :
			{
				comment : 'the widget hovered upon',
				type : [ 'undefined', 'jion$path' ],
				prepare : 'form_jockey.concernsHover( hover )'
			},
			mark :
			{
				comment : 'the users mark',
				type :
					require( '../typemaps/visualMark' )
					.concat( [ 'undefined' ] )
			},
			path :
			{
				comment : 'the path of the form jockey',
				type : 'jion$path'
			},
			spaceRef :
			{
				comment : 'the reference of current space',
				type : [ 'undefined', 'fabric_spaceRef' ]
			},
			user :
			{
				comment : 'currently logged in user',
				type : [ 'undefined', 'user_creds' ]
			},
			view :
			{
				comment : 'the current view',
				type : 'euclid_view',
				prepare : 'view ? view.sizeOnly : view'
			}
		},
		init : [ 'twigDup' ],
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


if( NODE )
{
	require( 'jion' ).this( module, 'source' );

	return;
}


var
	prototype;

prototype = form_jockey.prototype;


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
				'view', this.view
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
| Returns the mark if the form jockey concerns a mark.
*/
form_jockey.concernsMark =
	function(
		mark
	)
{
	return(
		mark.containsPath( form_jockey.path )
		? mark
		: undefined
	);
};


/*
| Returns the hover path if the form jockey concerns about it.
*/
form_jockey.concernsHover =
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
