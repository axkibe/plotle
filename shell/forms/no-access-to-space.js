/*
| User has no access to a space he tried to port to.
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
	Theme;

/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var
	NoAccessToSpace =
	Forms.NoAccessToSpace =
		function(
			// free strings
		)
{
	this.tree =
		shellverse.grow( Theme.NoAccessToSpaceForm );

	Forms.Form.apply(
		this,
		arguments
	);
};


Jools.subclass(
	NoAccessToSpace,
	Forms.Form
);



/*
| Name of the form.
*/
NoAccessToSpace.prototype.name =
	'noAccessSpace';


/*
| A button of the form has been pushed.
*/
NoAccessToSpace.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'okButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};


NoAccessToSpace.prototype.setSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	var $sub =
		this.$sub;

	this.setText(
		'headline',
			'no access to ' +
			spaceUser +
			':' +
			spaceTag
	);
};


} )( );
