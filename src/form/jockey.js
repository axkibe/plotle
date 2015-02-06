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
	return {
		id :
			'form_jockey',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE '->mark'
						allowsNull :
							true
					},
				path :
					{
						comment :
							'the path of the form jockey',
						type :
							'jion_path'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'string',
						defaultValue :
							'undefined'
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'string',
						defaultValue :
							'undefined'
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'string',
						defaultValue :
							'null'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid_view',
						concerns :
							{
								member : 'sizeOnly'
							}
					}
			},
		subclass :
			'form_form',
		init :
			[
				'twigDup'
			],
		twig :
			[
				/* FUTURE
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
		form,
		name,
		path;

	if( !twigDup )
	{
		this.twig = jools.copy( this.twig );
	}

	for(
		var a = 0, aZ = this.ranks.length;
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
			path =
				undefined; // inherit
		}

		this.twig[ name ] =
			form.create(
				'hover',
					this.hover,
				'mark',
					this.mark,
				'path',
					path,
				'spaceUser',
					this.spaceUser,
				'spaceTag',
					this.spaceTag,
				'username',
					this.username,
				'view',
					this.view
			);

/**/	if( CHECK )
/**/	{
/**/		if( this.twig[ name ].reflectName !== name )
/**/		{
/**/			throw new Error( );
/**/		}
/**/	}
	}
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
		: null
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
			false, // FUTURE honor shift / ctrl states
			false
		)
	);
};


} )( );