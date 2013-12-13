/*
| The form jockey is the master of all discs
|
| Authors: Axel Kittenberger
*/


/*
| Export
*/
var
	Forms,


Forms =
	Forms || { };


/*
| Imports
*/
var
	Mark,
	Path;

/*
| Capsule
*/
(function( ) {
'use strict';


var
	_tag =
		'FORM-JOCKEY-42381321';

/*
| The master of forms.
*/
var Jockey =
Forms.Jockey =
	function(
		tag,
		inherit,
		screensize,
		traitSet
	)
{
	if( CHECK )
	{
		if( tag !== _tag )
		{
			throw new Error(
				'tag mismatch'
			);
		}
	}

	var
		forms =
		this._formList = // TODO remove
			[
				'Login',
				'MoveTo',
				'NoAccessToSpace',
				'NonExistingSpace',
				'SignUp',
				'Space',
				'User',
				'Welcome'
			],

		mark =
			Mark.Vacant.create( );

	this.screensize =
		screensize;

	this._$forms =
		{ };

	for( var i in forms )
	{
		var
			name =
				forms[ i ],

			form =
				this._$forms[ name ] =
					Forms.Form.create(
						'name',
							name,
						'inherit',
							inherit && inherit._$forms[ name ],
						'screensize',
							screensize,
						'traitSet',
							traitSet,
						'mark',
							mark
					);

		if( CHECK )
		{
			if( form.reflect !== name )
			{
				throw new Error(
					'form reflextion mismatch: ' +
						form.reflect + ' !== ' + name
				);
			}
		}
	}
};


/*
| The forms path
*/
Jockey.path =
Jockey.prototype.path =
	new Path(
		[
			'Forms'
		]
	);


/*
| Creates a new form jockey.
*/
Jockey.create =
	function(
		// free strings
	)
{
	var
		inherit =
			null,

		screensize =
			null,

		traitSet =
			null;


	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a += 2
	)
	{
		switch( arguments[ a ] )
		{
			case 'inherit' :

				inherit =
					arguments[ a + 1 ];

				break;

			case 'screensize' :

				screensize =
					arguments[ a + 1 ];

				break;

			case 'traitSet' :

				traitSet =
					arguments[ a + 1 ];

				break;

			default :

				throw new Error(
					'invalid argument'
				);
		}
	}

	if( inherit )
	{
		if( screensize === null )
		{
			screensize =
				inherit.screensize;
		}
	}

	return (
		new Jockey(
			_tag,
			inherit,
			screensize,
			traitSet
		)
	);
};


/*
| Returns the appropriate form.
*/
Jockey.prototype.get =
	function(
		name
	)
{
	return this._$forms[ name ];
};


/*
| Sets the mark
|
| TODO remove
*/
Jockey.prototype.setMark =
	function(
		formname, // TODO remove
		mark
	)
{
	if( CHECK )
	{
		if( CHECK && !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	this._$forms[ formname ] =
		Forms.Form.create(
			'name',
				formname,
			'inherit',
				this._$forms[ formname ],
			'mark',
				mark
		);
};


/*
| Cycles the focus in a form
*/
Jockey.prototype.cycleFocus =
	function(
		formname,
		dir
	)
{
	if( CHECK )
	{
		if( !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return this._$forms.cycleFocus( dir );
};


/*
| A button has been pushed.
*/
Jockey.prototype.pushButton =
	function(
		path
	)
{

	var
		formname =
			path.get( 0 );

	if( CHECK )
	{
		if( !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return (
		this._$forms[ formname ].pushButton(
			path,
			false, // FIXME honor shift / ctrl states
			false
		)
	);
};


/*
| Sets a hovered component.
*/
Jockey.prototype.setHover =
	function(
		path
	)
{
	var
		formname =
			path.get( 0 );

	if( CHECK )
	{
		if( !this._$forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return (
		this._$forms[ formname ].setHover(
			path.get( 1 )
		)
	);
};


} )( );
