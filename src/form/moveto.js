/*
| The move to form.
|
| FIXME rename moveto
*/


var
	fabric_spaceRef,
	form_form,
	form_moveTo,
	jools;


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
							'->mark',
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
				spaceRef :
					{
						comment :
							'the reference to the current space',
						type :
							'fabric_spaceRef',
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


/*
| The moveto form.
*/
form_moveTo.prototype._init =
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
| Draws a form.
*/
form_moveTo.prototype.draw = form_form.draw;


/*
| The focused widget.
*/
jools.lazyValue(
	form_moveTo.prototype,
	'focusedWidget',
	form_form.getFocusedWidget
);


/*
| A button of the form has been pushed.
*/
form_moveTo.prototype.pushButton =
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

	root.create( 'mode', 'loading' );

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


/*
| The disc is shown while a form is shown.
*/
form_moveTo.prototype.showDisc = true;


})( );

