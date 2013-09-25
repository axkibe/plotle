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
	Euclid,
	fontPool,
	Jools,
	Path,
	shell,
	Widgets,
	Theme;


/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var MoveTo =
Forms.MoveTo =
	function(
		// free strings
	)
{
	this.tree =
		shellverse.grow( Theme.MoveToForm );

	Forms.Form.apply(
		this,
		arguments
	);

	this.$username =
		null;
};


Jools.subclass(
	MoveTo,
	Forms.Form
);



/*
| Name of the form.
*/
MoveTo.prototype.name =
	'moveto';

/*
| Finished loading a space.
*/
MoveTo.prototype.setUsername =
	function(
		username
	)
{
	this.$username =
		username;

	var
		userHomeButton =
			this.$sub.userHomeButton,

		isGuest =
			username.substr( 0, 7 ) === 'visitor';

	this.$sub.userHomeButton =
		Widgets.Button.create(
			'inherit',
				this.$sub.userHomeButton,
			'visible',
				!isGuest,
			'text',
				username + '\n' + 'home'
		);
};


/*
| A button of the form has been pushed.
*/
MoveTo.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
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
				shell.bridge.getUsername( ),
				'home',
				false
			);

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};

})( );

