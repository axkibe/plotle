/*
| Used to construct a text file.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
(function() {
'use strict';


/*
| The joobj definition.
*/
if( JOOBJ )
{
	return {
		name :
			'TextFile',
		attributes :
			{
				text :
					{
						comment :
							'the text',
						type :
							'String',
						defaultValue :
							'\'\''
					}
			},
		node :
			true
	};
}


/*
| Node imports.
*/
var
	TextFile =
		require( '../joobj/this' )( module );


/*
| Returns a text file with a or more line(s) append
*/
TextFile.prototype.line =
	function(
		context // the lines context
		// line(s)
	)
{
	var
		line,
		text =
			this.text;

	for(
		var a = 1, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		line =
			arguments[ a ];

		text =
			text +
				( line !== '' ? context.tab : '' ) +
				line +
				'\n';
	}

	return (
		this.create(
			'text',
				text
		)
	);
};


/*
| Returns a text file with one or more strings appended
*/
TextFile.prototype.append =
	function(
		// stuff
	)
{
	var
		text =
			this.text;

	for(
		var a = 0, aZ = arguments.length;
		a < aZ;
		a++
	)
	{
		text =
			text + arguments[ a ] + '\n';
	}

	return (
		this.create(
			'text',
				text
		)
	);
};


/*
| Returns a text file with n newlines appended.
*/
TextFile.prototype.newline =
	function(
		n
	)
{
	var
		text =
			this.text;

	for( var a = 0; a < n; a++ )
	{
		text =
			text + '\n';
	}

	return (
		this.create(
			'text',
				text
		)
	);
};

/*
| Node export.
*/
module.exports =
	TextFile;


} )( );
