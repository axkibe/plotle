/*
| User has no access to a space he tried to port to.
|
| FIXME spaceUser and spaceTag are phony
|       yet are not looked at by jion
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
	root;


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
			'nonExistingSpace',
		unit :
			'forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion.path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE 'marks.*',
						concerns :
							{
								type :
									'forms.form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							null
					},
				nonSpaceUser :
					{
						comment :
							'the user part of the non-existing-space',
						type :
							'String',
						defaultValue :
							undefined
					},
				nonSpaceTag :
					{
						comment :
							'the tag part of the non-existing-space',
						type :
							'String',
						defaultValue :
							undefined
					},
				path :
					{
						comment :
							'the path of the form',

						type :
							'jion.path',
						defaultValue :
							undefined
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'String',
						defaultValue :
							undefined,
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'String',
						defaultValue :
							undefined,
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
							null,
						assign :
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
							},
						defaultValue :
							undefined
					}
			},
		subclass :
			'forms.form',
		init :
			[
				'inherit',
				'twigDup'
			],
		twig :
			'form-widgets'
	};
}


var
	nonExistingSpace;

nonExistingSpace = forms.nonExistingSpace;


/*
| The space does not exist form.
*/
nonExistingSpace.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	if( !this.path )
	{
		return;
	}

	if( !twigDup )
	{
		this.twig = jools.copy( this.twig );
	}

	this.twig.headline =
		this.twig.headline.create(
			'text',
				this.nonSpaceUser +
				':' +
				this.nonSpaceTag +
				' does not exist.'
		);

	forms.form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
nonExistingSpace.prototype.pushButton =
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
/**/	if( path.get( 2 ) !== this.reflexName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'noButton' :

			root.setMode( 'Normal' );

			break;

		case 'yesButton' :

			root.moveToSpace(
				this.nonSpaceUser,
				this.nonSpaceTag,
				true
			);

			root.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};


} )( );
