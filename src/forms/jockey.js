/*
| The form jockey is the master of all discs
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	forms;

forms = forms || { };


/*
| Imports
*/
var
	jools,
	marks;


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
		name :
			'jockey',
		unit :
			'forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion.path'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object' // FUTURE 'marks.*'
					},
				path :
					{
						comment :
							'the path of the form jockey',
						type :
							'jion.path'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							undefined
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							undefined
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'euclid.view',
						concerns :
							{
								member :
									'sizeOnly'
							}
					}
			},
		subclass :
			'forms.form',
		init :
			[
				'twigDup'
			],
		twig :
			[
				/* FUTURE
				'forms.login',
				'forms.moveTo',
				'forms.noAccessToSpace',
				'forms.nonExistingSpace',
				'forms.signUp',
				'forms.space',
				'forms.user',
				'forms.welcome'
				*/
			]
	};
}


var
	jockey;

jockey = forms.jockey;


/*
| Initializer.
*/
jockey.prototype._init =
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
				.Append( 'twig' )
				.Append( name );
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
jockey.concernsMark =
	function(
		mark
	)
{
	if(
		mark.containsPath(
			jockey.path
		)
	)
	{
		return mark;
	}
	else
	{
		return marks.vacant.create( );
	}
};


/*
| Returns the appropriate form.
*/
jockey.prototype.get =
	function(
		name
	)
{
	return this.twig[ name ];
};


/*
| Cycles the focus in a form
*/
jockey.prototype.cycleFocus =
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
jockey.prototype.pushButton =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if(
/**/		path.length < 3
/**/		||
/**/		path.get( 0 ) !== 'forms'
/**/		||
/**/		path.get( 1 ) !== 'twig'
/**/		||
/**/		!this.twig[ path.get( 2 ) ]
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
