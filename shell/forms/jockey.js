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
	Jools,
	Path,
	shell;

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
				'tag mismatch'
			);
		}

		if( !hover || hover.reflect !== 'Path' )
		{
			throw new Error(
				'invalid hover'
			);
		}

		if( !mark )
		{
			throw new Error(
				'invalid mark'
			);
		}
	}

	// TODO make static, immutable
	var
		formList =
		this._formList =
			[
				'Login',
				'MoveTo',
				'NoAccessToSpace',
				'NonExistingSpace',
				'SignUp',
				'Space',
				'User',
				'Welcome'
			];

	this.mark =
		mark;

	this.hover =
		hover;

	this.screensize =
		screensize;

	var
		forms =
			{ };

	for( var i in formList )
	{
		var
			name =
				formList[ i ],


			path =
				inherit ?
					inherit._forms[ name ].path
					:
					new Path(
						[
							name
						]
					);

			forms[ name ] =
				Forms.Form.create(
					'name',
						name,
					'inherit',
						inherit && inherit._forms[ name ],
					'screensize',
						screensize,
					'traitSet',
						traitSet,
					'mark',
						mark.concerns( path ),
					'hover',
						path.equals( Path.empty ) // TODO this looks wrong
							?
							Path.empty
							:
							(
								path.subPathOf( hover )
								?
								hover
								:
								Path.empty
							)
				);

		if( CHECK )
		{
			if( forms[ name ].reflect !== name )
			{
				throw new Error(
					'form reflextion mismatch: ' +
						forms[ name ].reflect + ' !== ' + name
				);
			}
		}
	}

	this._forms =
		Jools.immute( forms );
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

		hover =
			null,

		mark =
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

			case 'hover' :

				hover =
					arguments[ a + 1 ];

				break;

			case 'mark' :

				mark =
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

		if( mark === null )
		{
			mark =
				inherit.mark;
		}

		if( hover === null )
		{
			hover =
				inherit.hover;
		}

		if(
			traitSet === null
			&&
			screensize.equals( inherit.screensize )
			&&
			mark.equals( inherit.mark )
			&&
			hover.equals( inherit.hover )
		)
		{
			return inherit;
		}
	}

	shell.redraw =
		true;

	return (
		new Jockey(
			_tag,
			inherit,
			screensize,
			traitSet,
			mark,
			hover
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
	return this._forms[ name ];
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
		if( !this._forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return this._forms.cycleFocus( dir );
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
		if( !this._forms[ formname ] )
		{
			throw new Error(
				'invalid formname: ' + formname
			);
		}
	}

	return (
		this._forms[ formname ].pushButton(
			path,
			false, // FIXME honor shift / ctrl states
			false
		)
	);
};


} )( );
