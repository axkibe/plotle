/*
| The visual text mark.
*/
'use strict';


tim.define( module, ( def ) => {


if( TIM )
{
	def.attributes =
	{
		// offset of the caret
		at : { type : 'integer' },

		// path of the caret
		path : { type : 'tim.js/path' },
	};
}


const change_mark_text = tim.require( '../../change/mark/text' );


/**
*** Exta checking
***/
/**/if( CHECK )
/**/{
/**/	def.proto._check =
/**/		function( )
/**/	{
/**/		if( this.path.isEmpty ) throw new Error( );
/**/
/**/		if( this.at < 0 ) throw new Error( );
/**/	};
/**/}


/*
| The change engine's textmark.
*/
def.lazy._changeMarkText =
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


/*
| Recreates this mark with a transformation
| applied.
*/
def.proto.createTransformed =
	function(
		changes
	)
{
	if( this.path.get( 0 ) !== 'spaceVisual' ) return this;

	const tm = changes.transform( this._changeMarkText );

	if( !tm ) return undefined;

	const vm =
		this.create(
			'at', tm.at,
			'path', tm.path.prepend( 'spaceVisual' )
		);

	tim.aheadValue( vm, '_changeMarkText', tm );

	return vm;
};


} );
