/*
| A font with a specific size
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// color of the font
		color : { type : '../color' },

		// size of the font
		fontSize : { type : './size' },

		// token cache
		// note that albeit only strings are used as keys,
		// a normal {} object cannot be used as map as for example
		// "constructor" is already defined :-/
		_tokenCache : { type : 'protean', defaultValue: 'new Map( )' },
	};
}


const font_token = tim.require( './token' );


def.proto.createToken =
	function(
		text
	)
{
	const tc = this._tokenCache;
	let tv = tc.get( text );
	if( tv ) return tv;
	tv = font_token.create( 'fontFace', this, 'text', text );
	tc.set( text, tv );
	return tv;
};


/*
| Applies a transformation to this fontFace.
*/
def.proto.transform =
	function(
		transform
	)
{
	return this.fontSize.transform( transform ).createFace( this.color );
};


/*
| Resizes this font by factor and rounds the result.
*/
def.proto.roundResize =
	function(
		factor
	)
{
	if( factor === 1 ) return this.roundSize;

	let fs = this.fontSize;

	fs = fs.family.createSize( Math.round( fs.size * factor ) );

	return fs.createFace( this.color );
};


/*
| Returns the fontFace with rounded size.
*/
def.lazy.roundSize =
	function( )
{
	return this.fontSize.roundSize.createFace( this.color );
};


} );
