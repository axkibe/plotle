/*
| The move to form.
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
	jools,
	shell;


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
			'MoveTo',
		unit :
			'Forms',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'path',
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
				path :
					{
						comment :
							'the path of the form',
						type :
							'path',
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
							null
					},
				view :
					{
						comment :
							'the current view',
						type :
							'view',
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
	MoveTo =
		Forms.MoveTo;


/*
| The moveto form.
*/
MoveTo.prototype._init =
	function(
		inherit,
		twigDup
	)
{
	var
		isGuest;

	if( this.path )
	{
		isGuest =
			this.username === null ?
				false
				:
				this.username.substr( 0, 7 ) === 'visitor';

		if( !twigDup )
		{
			this.twig = jools.copy( this.twig );
		}

		this.twig.userHomeButton =
			this.twig.userHomeButton.create(
				'visible',
					!isGuest,
				'text',
					this.username + '\n' + 'home'
			);
	}

	Forms.Form.init.call(
		this,
		inherit
	);
};


/*
| A button of the form has been pushed.
*/
MoveTo.prototype.pushButton =
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

	buttonName =
		path.get( 4 );

	switch( buttonName )
	{
		case 'meshcraftHomeButton' :

			shell.moveToSpace(
				'meshcraft',
				'home',
				false
			);


			break;

		case 'meshcraftSandboxButton' :

			shell.moveToSpace(
				'meshcraft',
				'sandbox',
				false
			);

			break;

		case 'userHomeButton' :

			shell.moveToSpace(
				this.username,
				'home',
				false
			);

			break;

		default :

			throw new Error( );
	}
};

})( );

