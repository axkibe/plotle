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
	shell;

/*
| Capsule
*/
(function( ) {
'use strict';


/*
| The login form
*/
var
	NonExistingSpace =
	Forms.NonExistingSpace =
		function(
			// free strings
		)
{
	// TODO
	this.tree =
		shellverse.grow( Design.NonExistingSpaceForm );

	Forms.Form.apply(
		this,
		arguments
	);

	this.$spaceUser =
	this.$spaceTag =
		null;
};


Jools.subclass(
	NonExistingSpace,
	Forms.Form
);




/*
| Name of the form.
*/
NonExistingSpace.prototype.name =
	'nonExistingSpace';


/*
| A button of the form has been pushed.
*/
NonExistingSpace.prototype.pushButton =
	function(
		buttonName
		// shift,
		// ctrl
	)
{
	switch( buttonName )
	{
		case 'noButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		case 'yesButton' :

			shell.moveToSpace(
				this.$spaceUser,
				this.$spaceTag,
				true
			);

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};


NonExistingSpace.prototype.setSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	var $sub =
		this.$sub;

	this.$spaceUser =
		spaceUser;

	this.$spaceTag =
		spaceTag;

	$sub.headline.setText(
		spaceUser +
		':' +
		spaceTag +
		' does not exist.'
	);
};


} )( );
