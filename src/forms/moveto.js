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
	Jools,
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
			this.twig =
				Jools.copy( this.twig );
		}

		this.twig.userHomeButton =
			this.twig.userHomeButton.Create(
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

