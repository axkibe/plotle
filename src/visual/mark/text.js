/*
| The visual text mark.
*/
'use strict';


// FIXME
var
	change_mark_text;


tim.define( module, 'visual_mark_text', ( def, visual_mark_text ) => {


/*::::::::::::::::::::::::::::.
:: Typed immutable attributes
':::::::::::::::::::::::::::::*/


if( TIM )
{
	def.attributes =
	{
		at :
		{
			// offset of the caret
			type : 'integer'
		},
		path :
		{
			// path of the caret
			type : 'tim$path'
		},
		changeMarkText :
		{
			// the text mark
			type : [ 'undefined', 'change_mark_text' ],
			assign : ''
		}
	};

	def.init = [ 'changeMarkText' ];
}


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
