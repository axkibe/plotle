/*
| The move to form.
*/


var
	fabric_spaceRef,
	form_form,
	form_moveTo,
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
			'form_moveTo',
		attributes :
			{
				hover :
					{
						comment :
							'the widget hovered upon',
						type :
							'jion_path',
						defaultValue :
							'null'
					},
				mark :
					{
						comment :
							'the users mark',
						type :
							'Object', // FUTURE: '->mark',
						concerns :
							{
								type :
									'form_form',
								func :
									'concernsMark',
								args :
									[
										'mark',
										'path'
									]
							},
						defaultValue :
							'null'
					},
				path :
					{
						comment :
							'the path of the form',
						type :
							'jion_path',
						defaultValue :
							'undefined'
					},
				spaceUser :
					{
						comment :
							'the user of the current space',
						type :
							'string',
						defaultValue :
							'undefined',
						assign :
							null
					},
				spaceTag :
					{
						comment :
							'tag of the current space',
						type :
							'string',
						defaultValue :
							'undefined',
						assign :
							null
					},
				username :
					{
						comment :
							'currently logged in user',
						type :
							'string',
						defaultValue :
							'null'
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
							'undefined'
					}
			},
		subclass :
			'form_form',
		init :
			[ 'inherit', 'twigDup' ],
		twig :
			'->formWidgets'
	};
}

var
	moveTo;

moveTo = form_moveTo;


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

	form_form.init.call( this, inherit );
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

			root.moveToSpace( fabric_spaceRef.ideoloomHome, false );

			break;

		case 'ideoloomSandboxButton' :

			root.moveToSpace( fabric_spaceRef.ideoloomSandbox, false );

			break;

		case 'userHomeButton' :

			root.moveToSpace(
				fabric_spaceRef.create(
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
