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
	Design,
	Jools,
	shell,
	shellverse,
	Widgets;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		'FORM-39606038';

/*
| The login form
*/
var MoveTo =
Forms.MoveTo =
	function(
		tag,
		inherit,
		screensize,
		traitSet,
		mark
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'invalid tag'
			);
		}
	}

	this.tree =
		shellverse.grow( Design.MoveToForm );

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark
	);

	// XXX
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
		path
		// shift,
		// ctrl
	)
{
	if( CHECK )
	{
		// TODO
	}
	
	var
		buttonName =
			path.get( 1 );

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

	shell.redraw =
		true;
};

})( );

