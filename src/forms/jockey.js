/*
| The form jockey is the master of all discs
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms;

Forms = Forms || { };


/*
| Imports
*/
var
	jools,
	Mark;


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
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'path'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark'
					},
				path :
					{
						comment :
							'the path of the form jockey',
						type :
							'path'
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
			'Forms.Form',
		init :
			[
				'twigDup'
			],
		twig :
			{
				'Login' :
					'Forms.Login',
				'MoveTo' :
					'Forms.MoveTo',
				'NoAccessToSpace' :
					'Forms.NoAccessToSpace',
				'NonExistingSpace' :
					'Forms.NonExistingSpace',
				'SignUp' :
					'Forms.SignUp',
				'Space' :
					'Forms.Space',
				'User' :
					'Forms.User',
				'Welcome' :
					'Forms.Welcome'
			}
	};
}


var
	jockey;

jockey = Forms.jockey;


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
/**/		if( this.twig[ name ].reflexName !== name )
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
		return Mark.Vacant.create( );
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
