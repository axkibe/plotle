/*
| The form jockey is the master of all discs
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms,


Forms =
	Forms || { };


/*
| Imports
*/
var
	Mark;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'Jockey',
		unit :
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'Path'
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
							'Path'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							'undefined'
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							'undefined'
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'String',
						defaultValue :
							'null'
					},
				view :
					{
						comment :
							'the current view',
						type :
							'View',
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
			[ ],
		twig :
			{
				'Login' :
					Forms.Login,
				'MoveTo' :
					Forms.MoveTo,
				'NoAccessToSpace' :
					Forms.NoAccessToSpace,
				'NonExistingSpace' :
					Forms.NonExistingSpace,
				'SignUp' :
					Forms.SignUp,
				'Space' :
					Forms.Space,
				'User' :
					Forms.User,
				'Welcome' :
					Forms.Welcome
			}
	};
}


var
	Jockey =
		Forms.Jockey;


/*
| Initializer.
*/
Jockey.prototype._init =
	function( )
{
	var
		path;

	for(
		var a = 0, aZ = this.ranks.length;
		a < aZ;
		a++
	)
	{
		var
			name =
				this.ranks[ a ],

			form =
				this.twig[ name ];

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
/**/		if( this.twig[ name ].reflect !== name )
/**/		{
/**/			throw new Error(
/**/				'reflection mismatch'
/**/			);
/**/		}
/**/	}
	}
};


/*
| Returns the mark if the form jockey concerns a mark.
*/
Jockey.concernsMark =
	function(
		mark
	)
{
	if(
		mark.containsPath(
			Jockey.path
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
Jockey.prototype.get =
	function(
		name
	)
{
	return this.twig[ name ];
};


/*
| Cycles the focus in a form
*/
Jockey.prototype.cycleFocus =
	function(
		formname,
		dir
	)
{
/**/if( CHECK )
/**/{
/**/	if( !this.twig[ formname ] )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	return this.twig[ formname ].cycleFocus( dir );
};


/*
| A button has been pushed.
*/
Jockey.prototype.pushButton =
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
