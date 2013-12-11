/*
| User has no access to a space s/he tried to port to.
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
| The login form
*/
var
	NoAccessToSpace =
	Forms.NoAccessToSpace =
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
		shellverse.grow( Design.NoAccessToSpaceForm );

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark
	);
};


Jools.subclass(
	NoAccessToSpace,
	Forms.Form
);


/*
| Name of the form.
*/
NoAccessToSpace.prototype.reflect =
	'NoAccessToSpace';


/*
| A button of the form has been pushed.
*/
NoAccessToSpace.prototype.pushButton =
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
		case 'okButton' :

			shell.bridge.changeMode( 'Normal' );

			break;

		default :

			throw new Error( 'unknown button pushed: ' + buttonName );
	}
};


/*
| Sets the space information.
*/
NoAccessToSpace.prototype.setSpace =
	function(
		spaceUser,
		spaceTag
	)
{
	this.setText(
		'headline',
			'no access to ' +
			spaceUser +
			':' +
			spaceTag
	);
};


} )( );
