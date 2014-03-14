/*
| Used to construct a text.
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
			'Text',
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
	Text =
		require( '../joobj/this' )( module );


/*
| Returns a text file with one or more strings appended
*/
Text.prototype.append =
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
			text + arguments[ a ];
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
Text.prototype.newline =
	function(
		n  /// amount of new lines
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
	Text;


} )( );
