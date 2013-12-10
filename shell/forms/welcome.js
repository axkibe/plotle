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
		'WELCOME-FORM-87505653';


/*
| The login form
*/
var Welcome =
Forms.Welcome =
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
		shellverse.grow( Design.WelcomeForm );

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
	Welcome,
	Forms.Form
);


/*
| Creates a new form.
*/
Welcome.create =
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

	return new Welcome(
		_tag,
		inherit,
		screensize,
		mark
	);
};



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
