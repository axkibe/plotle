/*
| Maps file types to mimes and encodings.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule
*/
( function( ) {
'use strict';


var
	FileTypes =
		{ },

	/*
	| coding mappings for file types
	*/
	_mapCoding =
		{
			'css' :
				// cascading style sheet
				'utf-8',

			'eot' :
				// some font
				'binary',

			'html' :
				// hypertext
				'utf-8',

			'ico' :
				// icon
				'binary',

			'js' :
				// javascript
				'utf-8',

			'otf' :
				// some font
				'binary',

			'svg' :
				// some font
				'utf-8',

			'ttf' :
				// some font
				'binary',

			'woff' :
				// some font
				'binary'
		},

	/*
	| mime mappings for file types
	*/
	_mapMime =
		{
		'css' :
			// cascading style sheet
			'text/css',

		'eot' :
			// some font
			'font/eot',

		'html' :
			// hypertext
			'text/html',

		'ico' :
			// icon
			'image/x-icon',

		'js' :
			// javascript
			'text/javascript',

		'otf' :
			// some font
			'font/otf',

		'svg' :
			// some font
			'image/svg+xml',

		'ttf'  :
			// some font
			'font/ttf',

		'woff' :
			// some font
			'application/font-woff'
	};



/*
| Maps a file type to a coding.
*/
FileTypes.mapCoding =
	function(
		filetype
	)
{
	var
		coding =
			_mapCoding[ filetype ];

	if( !coding )
	{
		throw new Error(
			'unknown file filetype: ' + filetype
		);
	}

	return coding;
};


/*
| Maps a file type to a mime.
*/
FileTypes.mapMime =
	function(
		filetype
	)
{
	var
		mime =
			_mapMime[ filetype ];

	if( !mime )
	{
		throw new Error(
			'unknown file filetype: ' + filetype
		);
	}

	return mime;
};


/*
| Node export.
*/
module.exports =
	FileTypes;


} )( );
