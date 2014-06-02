/*
| User has no access to a space he tried to port to.
|
| FIXME spaceUser and spaceTag are phony
|       yet are not looked at by joobj
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
	Jools,
	shell;


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
			'NonExistingSpace',
		unit :
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'Path',
						defaultValue :
							null
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Mark',
						concerns :
							{
								unit :
									'Forms',
								type :
									'Form',
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
							'Path',
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
							'View',
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
			'Forms.Form',
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
	NonExistingSpace =
		Forms.NonExistingSpace;


/*
| The space does not exist form.
*/
NonExistingSpace.prototype._init =
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
		this.twig =
			Jools.copy( this.twig );
	}

	this.twig.headline =
		this.twig.headline.Create(
			'text',
				this.nonSpaceUser +
				':' +
				this.nonSpaceTag +
				' does not exist.'
		);

	Forms.Form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
NonExistingSpace.prototype.pushButton =
	function(
		path
		// shift,
		// ctrl
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.get( 2 ) !== this.reflect )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	var
		buttonName =
			path.get( 4 );

	switch( buttonName )
	{
		case 'noButton' :

			shell.setMode( 'Normal' );

			break;

		case 'yesButton' :

			shell.moveToSpace(
				this.nonSpaceUser,
				this.nonSpaceTag,
				true
			);

			shell.setMode( 'Normal' );

			break;

		default :

			throw new Error( );
	}
};


} )( );
