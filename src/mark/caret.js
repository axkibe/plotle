/*
| The virtual caret.
*/


var
	jion_path,
	jools,
	mark_caret,
	mark_text;


/*
| Capsule
*/
(function() {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'mark_caret',
		attributes :
			{
				path :
					{
						comment :
							'path of the caret',
						type :
							'jion_path'
					},
				at :
					{
						comment :
							'offset of the caret',
						type :
							'integer'
					},
				retainx :
					{
						comment :
							'x-position of the caret kept',
						type :
							'number',
						defaultValue :
							'null'
					},
				focus :
					{
						comment :
							'the shell has the system focus',
						type :
							'boolean',
						defaultValue :
							'true'
					}
			},
		init :
			[ ]
	};
}


var
	prototype;


if( SERVER )
{
	jools = require( '../jools/jools' );

	mark_caret = require( '../jion/this' )( module );
}


prototype = mark_caret.prototype;


/*
| Initializer.
*/
prototype._init =
	function( )
{

/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty )
/**/	{
/**/		throw new Error( );
/**/	}
/**/
/**/	if( this.at < 0 )
/**/	{
/**/		throw new Error( );
/**/	}
/**/}

};

/*
| A caret mark has a caret.
|
| (the text range is the other mark
|  which has this too )
*/
prototype.hasCaret = true;


/*
| The item's path.
*/
jools.lazyValue(
	prototype,
	'itemPath',
	function( )
	{
		if(
			this.path.length < 3
			|| this.path.get( 0 ) !== 'space'
		)
		{
			return jion_path.empty;
		}

		return this.path.limit( 3 );
	}
);


/*
| The widget's path.
*/
jools.lazyValue(
	prototype,
	'widgetPath',
	function( )
	{
		if(
			this.path.length < 5
			||
			this.path.get( 0 ) !== 'form'
		)
		{
			return jion_path.empty;
		}

		return this.path.limit( 5 );
	}
);


/*
| The caret's path.
|
| This allows a common interface with text range.
| FIXME remove
*/
jools.lazyValue(
	prototype,
	'caretPath',
	function( )
	{
		return this.path;
	}
);


/*
| The caret's offset.
|
| This allows a common interface with text range.
| FIXME remove
*/
jools.lazyValue(
	prototype,
	'caretAt',
	function( )
	{
		return this.at;
	}
);


/*
| The caret mark
|
| This allows a common interface with text range.
| FIXME remove
*/
jools.lazyValue(
	prototype,
	'caret',
	function( )
	{
		return(
			mark_text.create(
				'at', this.at,
				'path', this.path
			)
		);
	}
);


/*
| The content the mark puts into the clipboard.
*/
prototype.clipboard = '';


/*
| Returns true if an entity of this mark
| contains 'path'.
*/
prototype.containsPath =
	function(
		path
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.length === 0 )
/**/	{
/**/		throw new Error(
/**/			'invalid empty path'
/**/		);
/**/	}
/**/}

	return path.subPathOf( this.path );
};


} )( );
