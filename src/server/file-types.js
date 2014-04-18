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
	_codings =
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
		
			'torrent'  :
				// torrents
				'binary',

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
	_mimes =
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

		'torrent'  :
			// torrents
			'application/x-bittorrent',

		'ttf'  :
			// some font
			'font/ttf',

		'woff' :
			// some font
			'application/font-woff'
	};



/*
| Maps a file extension to a coding.
*/
FileTypes.coding =
	function(
		ext
	)
{
	var
		coding =
			_codings[ ext ];

	if( !coding )
	{
		throw new Error(
			'unknown file extension: .' + ext
		);
	}

	return coding;
};


/*
| Maps a file type to a mime.
*/
FileTypes.mime =
	function(
		ext
	)
{
	var
		mime =
			_mimes[ ext ];

	if( !mime )
	{
		throw new Error(
			'unknown file extension: ' + ext
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
