/*
| The form jockey is the master of all discs
*/


/*
| Export
*/
var
	form_jockey;


/*
| Imports
*/
var
	jools;


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
				type : 'jion_path',
				defaultValue : 'undefined'
			},
			mark :
			{
				comment : 'the users mark',
				type : require( '../typemaps/mark' ),
				allowsUndefined : true
			},
			path :
			{
				comment : 'the path of the form jockey',
				type : 'jion_path'
			},
			spaceRef :
			{
				comment : 'the reference of current space',
				type : 'fabric_spaceRef',
				defaultValue : 'undefined'
			},
			user :
			{
				comment : 'currently logged in user',
				type : 'user_creds',
				defaultValue : 'undefined'
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
				/* FUTURE
				'form_loading',
				'form_login',
				'form_moveTo',
				'form_noAccessToSpace',
				'form_nonExistingSpace',
				'form_signUp',
				'form_space',
				'form_user',
				'form_welcome'
				*/
			]
	};
}


/*
| Initializer.
*/
form_jockey.prototype._init =
	function(
		twigDup
	)
{
	var
		a,
		aZ,
		form,
		name,
		path;

	if( !twigDup )
	{
		this.twig = jools.copy( this.twig );
	}

	for(
		a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
		name = this.ranks[ a ],

		form = this.twig[ name ];

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

		this.twig[ name ] =
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
/**/		if( this.twig[ name ].reflectName !== name )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
	}

	// FIXME freeze twig
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
| Returns the appropriate form.
*/
form_jockey.prototype.get =
	function(
		name
	)
{
	return this.twig[ name ];
};


/*
| Cycles the focus in a form
*/
form_jockey.prototype.cycleFocus =
	function(
		formName,
		dir
	)
{

/**/if( CHECK )
/**/{
/**/	if( !this.twig[ formName ] )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.twig[ formName ].cycleFocus( dir );
};


/*
| A button has been pushed.
*/
form_jockey.prototype.pushButton =
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
/**/		|| !this.twig[ path.get( 2 ) ]
/**/	)
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return (
		this.twig[ path.get( 2 ) ].pushButton(
			path,
			false, // FIXME honor shift / ctrl states
			false
		)
	);
};


} )( );
