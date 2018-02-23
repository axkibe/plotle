/*
| The visual text mark.
*/
'use strict';


tim.define( module, ( def ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		// offset of the caret
		at : { type : 'integer' },

		// path of the caret
		path : { type : 'tim.js/path' },

		// the text mark
		changeMarkText : { type : [ 'undefined', '../../change/mark/text' ], assign : '' },
	};

	def.init = [ 'changeMarkText' ];
}


const change_mark_text = require( '../../change/mark/text' );


/*
| Initializer.
*/
def.func._init =
	function(
		changeMarkText  // mark for the change engine
	)
{

	if( changeMarkText )
	{
		this.path = changeMarkText.path.prepend( 'spaceVisual' );

		this.at = changeMarkText.at;

		tim.aheadValue( this, 'changeMarkText', changeMarkText );
	}

/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty ) throw new Error( );
/**/
/**/	if( this.at < 0 ) throw new Error( );
/**/}

};


/*:::::::::::::.
:: Lazy values
'::::::::::::::*/


/*
| The change engine's textmark.
*/
def.lazy.changeMarkText =
	function( )
{
	if( this.path.get( 0 ) !== 'spaceVisual' ) return;

	return(
		change_mark_text.create(
			'at', this.at,
			'path', this.path.chop
		)
	);
};


/*:::::::::::.
:: Functions
'::::::::::::*/


/*
| Recreates this mark with a transformation
| applied.
*/
def.func.createTransformed =
	function(
		changes
	)
{
	if( this.path.get( 0 ) !== 'spaceVisual' ) return this;

	const tm = changes.transform( this.changeMarkText );

	if( !tm ) return undefined;

	return this.create( 'changeMarkText', tm );
};


} );
