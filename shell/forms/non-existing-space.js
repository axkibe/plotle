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
	Design,
	Jools,
	shell,
	shellverse;


/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		'FORM-39606038';


/*
| The space does not exist form.
*/
var
	NonExistingSpace =
	Forms.NonExistingSpace =
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

	// TODO
	this.tree =
		shellverse.grow( Design.NonExistingSpaceForm );

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark
	);

	// XXX
	this.$spaceUser =
	this.$spaceTag =
		null;
};


Jools.subclass(
	NonExistingSpace,
	Forms.Form
);


/*
| Reflection.
*/
NonExistingSpace.prototype.name =
	'nonExistingSpace';


/*
| A button of the form has been pushed.
*/
NonExistingSpace.prototype.pushButton =
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

	shell.redraw =
		true;
};


/*
| Sets the space information.
*/
NonExistingSpace.prototype.setSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	this.$spaceUser =
		spaceUser;

	this.$spaceTag =
		spaceTag;

	this.setText(
		'headline',
		spaceUser +
		':' +
		spaceTag +
		' does not exist.'
	);
};


} )( );
