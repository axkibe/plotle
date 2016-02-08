/*
| Maps file types to mimes and encodings.
*/

var
	server_fileTypes;

/*
| Capsule
*/
( function( ) {
'use strict';


var
	_codings,
	_mimes;

server_fileTypes =
module.exports =
	{ };

/*
| coding mappings for file types
*/
_codings =
	{
		// cascading style sheet
		'css' : 'utf-8',

		// some font
		'eot' : 'binary',

		// hypertext
		'html' : 'utf-8',

		// map
		'map' : 'utf-8',

		// icon
		'ico' : 'binary',

		// javascript
		'js' : 'utf-8',

		// some font
		'otf' : 'binary',

		// some font
		'svg' : 'utf-8',

		// some font
		'ttf' : 'binary',

		// some font
		'woff' : 'binary'
	},

/*
| mime mappings for file types
*/
_mimes =
	{
		// cascading style sheet
		'css' : 'text/css',

		// some font
		'eot' : 'font/eot',

		// hypertext
		'html' : 'text/html',

		// icon
		'ico' : 'image/x-icon',

		// map
		'map' : 'application/json',

		// javascript
		'js' : 'text/javascript',

		// some font
		'otf' : 'font/otf',

		// some font
		'svg' : 'image/svg+xml',

		// some font
		'ttf'  : 'font/ttf',

		// some font
		'woff' : 'application/font-woff'
};



/*
| Maps a file extension to a coding.
*/
server_fileTypes.coding =
	function(
		ext
	)
{
	var
		coding;

	coding = _codings[ ext ];

	if( !coding )
	{
		throw new Error( 'unknown file extension: .' + ext );
	}

	return coding;
};


/*
| Maps a file type to a mime.
*/
server_fileTypes.mime =
	function(
		ext
	)
{
	var
		mime;

	mime = _mimes[ ext ];

	if( !mime )
	{
		throw new Error( 'unknown file extension: ' + ext );
	}

	return mime;
};


} )( );
