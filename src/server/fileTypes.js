/*
| Maps file types to mimes and encodings.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


/*
| Coding mappings for file types.
*/
const codings =
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
};

/*
| mime mappings for file types
*/
const mimes =
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
def.static.coding =
	function(
		ext
	)
{
	const coding = codings[ ext ];

	if( !coding ) throw new Error( 'unknown file extension: .' + ext );

	return coding;
};


/*
| Maps a file type to a mime.
*/
def.static.mime =
	function(
		ext
	)
{
	const mime = mimes[ ext ];

	if( !mime ) throw new Error( 'unknown file extension: ' + ext );

	return mime;
};


} );
