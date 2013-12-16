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
	Path,
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
			mark,
			hover
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

	/*
	this.setText(
		'headline',
			'no access to ' +
			spaceUser +
			':' +
			spaceTag
	);
	*/

	Forms.Form.call(
		this,
		inherit,
		screensize,
		traitSet,
		mark,
		hover
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
| Form path.
*/
NoAccessToSpace.prototype.path =
	new Path(
		[
			NoAccessToSpace.prototype.reflect
		]
	);


/*
| The forms tree.
*/
NoAccessToSpace.prototype.tree =
	shellverse.grow( Design.NoAccessToSpaceForm );


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


} )( );
