/*
| A font with a specific size.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// size of the font
		size : { type : 'number' },

		// family of the font
		family : { type : './family' },
	};
}


const font_face = tim.require( './face' );


const opentypeOptions =
	Object.freeze( {
		kerning: true,
		features: {
			liga: true,
			rlig: true
		},
		script: 'latn'
	} );

const opentypeOptionsHinting =
	Object.freeze( {
		hinting: true,
		kerning: true,
		features: {
			liga: true,
			rlig: true
		},
		script: 'latn'
	} );


/*
| Options passed to opentype.
| For fonts smaller than 8 hinting is disabled.
*/
def.lazy._options =
	function( )
{
	return this.size >= 8 ? opentypeOptionsHinting : opentypeOptions;
};


/*
| Creates a font face (a font with family, size and color)
*/
def.proto.createFace =
	function(
		color
	)
{
	return font_face.create( 'color', color, 'fontSize', this );
};


/*
| Returns the font with rounded size.
*/
def.lazy.roundSize =
	function( )
{
	const size = this.size;

	const rsize = Math.round( size );

	if( rsize === size ) return this;

	return this.family.createSize( rsize );
};


/*
| Applies a transformation to this font.
*/
def.proto.transform =
	function(
		transform
	)
{
	return this.family.createSize( this.size * transform.zoom );
};


} );
