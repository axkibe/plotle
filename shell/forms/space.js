/*
| The user's form.
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var Forms;


Forms =
	Forms || { };


/*
| Imports
*/
var
	Design,
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
var Space =
Forms.Space =
	function(
		// free strings
	)
{
	// TODO
	this.tree =
		shellverse.grow( Design.SpaceForm );

	Forms.Form.apply(
		this,
		arguments
	);
};


Jools.subclass(
	Space,
	Forms.Form
);




/*
| A button of the form has been pushed.
*/
Space.prototype.pushButton =
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

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}

	shell.redraw =
		true;
};



/*
| Name of the form.
*/
Space.prototype.name =
	'space';


/*
| Finished loading a space.
*/
Space.prototype.arrivedAtSpace =
	function(
		spaceUser,
		spaceTag
		// access
	)
{
	this.setText(
		'headline',
		spaceUser + ':' + spaceTag
	);
};

} )( );

