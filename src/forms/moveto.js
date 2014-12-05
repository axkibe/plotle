/*
| The move to form.
*/


var
	fabric,
	forms_form,
	forms_moveTo,
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
		id :
			'forms_moveTo',
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
							'Object', // FUTURE: 'marks.*',
						concerns :
							{
								type :
									'forms_form',
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
							null
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
							},
						defaultValue :
							undefined
					}
			},
		subclass :
			'forms_form',
		init :
			[ 'inherit', 'twigDup' ],
		twig :
			'->form-widgets'
	};
}

var
	moveTo;

moveTo = forms_moveTo;


/*
| The moveto form.
*/
moveTo.prototype._init =
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
			this.username === null
			?  false
			: this.username.substr( 0, 7 ) === 'visitor';

		if( !twigDup )
		{
			this.twig = jools.copy( this.twig );
		}

		this.twig.userHomeButton =
			this.twig.userHomeButton.create(
				'visible', !isGuest,
				'text', this.username + '\n' + 'home'
			);
	}

	forms_form.init.call( this, inherit );
};


/*
| A button of the form has been pushed.
*/
moveTo.prototype.pushButton =
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
/**/	if( path.get( 2 ) !== this.reflectName )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

	buttonName = path.get( 4 );

	switch( buttonName )
	{
		case 'ideoloomHomeButton' :

			root.moveToSpace( fabric.spaceRef.ideoloomHome, false );

			break;

		case 'ideoloomSandboxButton' :

			root.moveToSpace( fabric.spaceRef.ideoloomSandbox, false );

			break;

		case 'userHomeButton' :

			root.moveToSpace(
				fabric.spaceRef.create(
					'username', this.username,
					'tag', 'home'
				),
				false
			);

			break;

		default :

			throw new Error( );
	}
};

})( );

