/*
| The welcome form.
|
| Shown only after successfull signing up.
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
	fontPool,
	Jools,
	shell,
	shellverse;

/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var Welcome =
Forms.Welcome =
	function(
		// free strings
	)
{
	this.tree =
		shellverse.grow( Design.WelcomeForm );

	Forms.Form.apply(
		this,
		arguments
	);
};


Jools.subclass(
	Welcome,
	Forms.Form
);


/*
| Name of the form.
*/
Welcome.prototype.name =
	'welcome';

/*
| sets the username
*/
Welcome.prototype.setUsername =
	function( username )
{
	var $sub =
		this.$sub;

	this.setText(
		'headline',
		'Welcome ' + username + '!'
	);
};

/*
| A button of the form has been pushed.
*/
Welcome.prototype.pushButton =
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
		case 'closeButton' :

			shell.bridge.changeMode(
				'Normal'
			);

			break;

		default :

			throw new Error(
				'unknown button pushed: ' + buttonName
			);
	}

	shell.redraw =
		true;
};



} )( );
