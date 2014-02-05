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
	Jools,
	Mark;

/*
| Capsule
*/
(function( ) {
'use strict';


var
	_formList =
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

				traitSet :
					{
						comment :
							'traits being set',

						type :
							'TraitSet',

						allowNull:
							true,

						defaultVal :
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

						allowNull:
							true,

						defaultVal :
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
								func :
									'view.sizeOnly',

								args :
									null
							}
					}
			},

		subclass :
			'Forms.Form',

		init :
			[
				'inherit',
				'traitSet'
			]
	};
}

var
	Jockey =
		Forms.Jockey;


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

	for( var i in _formList )
	{
		var
			name =
				_formList[ i ],

			formProto =
				inherit && inherit._forms[ name ];

		if( !formProto )
		{
			formProto =
				Forms[ name ];

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
