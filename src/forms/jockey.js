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
	Gruga,
	Jools,
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
				traitSet :
					{
						comment :
							'traits being set',
						type :
							'TraitSet',
						defaultValue :
							'null',
						assign :
							null
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
			[
				'inherit',
				'traitSet'
			],
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
| A list of all forms there is
*/
Jockey.formList =
	Object.freeze(
		[
			'Login',
			'MoveTo',
			'NoAccessToSpace',
			'NonExistingSpace',
			'SignUp',
			'Space',
			'User',
			'Welcome'
		]
	);


/*
| Initializer.
*/
Jockey.prototype._init =
	function(
		inherit,
		traitSet
	)
{
	var
		forms =
			{ },

		path;

	for( var i in Jockey.formList )
	{
		var
			name =
				Jockey.formList[ i ],

			formProto =
				inherit && inherit._forms[ name ];

		if( !formProto )
		{
			formProto =
				Gruga[ name ];

			path =
				this.path.append( name );
		}
		else
		{
			path =
				undefined; // inherit
		}

		forms[ name ] =
			formProto.create(
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
				'traitSet',
					traitSet,
				'username',
					this.username,
				'view',
					this.view
			);

/**/	if( CHECK )
/**/	{
/**/		if( forms[ name ].reflect !== name )
/**/		{
/**/			throw new Error(
/**/				'form reflexion mismatch: ' +
/**/					forms[ name ].reflect + ' !== ' + name
/**/			);
/**/		}
/**/	}
	}

	this._forms =
		Jools.immute( forms );
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
	return this._forms[ name ];
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
/**/	if( !this._forms[ formname ] )
/**/	{
/**/		throw new Error(
/**/			'invalid formname: ' + formname
/**/		);
/**/	}
/**/}

	return this._forms[ formname ].cycleFocus( dir );
};


/*
| A button has been pushed.
*/
Jockey.prototype.pushButton =
	function(
		path
	)
{

	var
		formname =
			path.get( 1 );

/**/if( CHECK )
/**/{
/**/	if( !this._forms[ formname ] )
/**/	{
/**/		throw new Error(
/**/			'invalid formname: ' + formname
/**/		);
/**/	}
/**/}

	return (
		this._forms[ formname ].pushButton(
			path,
			false, // FIXME honor shift / ctrl states
			false
		)
	);
};


} )( );
