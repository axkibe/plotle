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
		'NON-EXISTING-SPACE-FORM-7423431';


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
		'inherit',
			inherit,
		'screensize',
			screensize,
		'mark',
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
| Creates a new form.
*/
NonExistingSpace.create =
	function(
		// free strings
	)
{
	var
		a =
			0,

		aZ =
			arguments.length,

		screensize =
			null,

		inherit =
			null,

		mark =
			null;

	while( a < aZ )
	{
		var
			arg =
				arguments[ a++ ];

		switch( arg )
		{

			case 'screensize' :

				screensize =
					arguments[ a++ ];

				break;

			case 'inherit' :

				inherit =
					arguments[ a++ ];

				break;

			case 'mark' :

				mark =
					arguments[ a++ ];

				break;

			default :

				throw new Error(
					'invalid argument'
				);
		}
	}

	return new NonExistingSpace(
		_tag,
		inherit,
		screensize,
		mark
	);
};


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
