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
		'NO-ACCES-TO-SPACE-FORM-22869232';

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
		'inherit',
			inherit,
		'screensize',
			screensize,
		'mark',
			mark
	);
};


Jools.subclass(
	NoAccessToSpace,
	Forms.Form
);


/*
| Creates a new form.
*/
NoAccessToSpace.create =
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

	return new NoAccessToSpace(
		_tag,
		inherit,
		screensize,
		mark
	);
};


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
