/*
| The visual text mark.
*/


/*
| The jion definition.
*/
if( JION )
{
	throw{
		id : 'visual_mark_text',
		attributes :
		{
			at :
			{
				comment : 'offset of the caret',
				type : 'integer'
			},
			path :
			{
				comment : 'path of the caret',
				type : 'jion$path'
			},
			changeMarkText :
			{
				comment : 'the text mark',
				type : [ 'undefined', 'change_mark_text' ],
				assign : ''
			}
		},
		init : [ 'changeMarkText' ]
	};
}


var
	jion,
	visual_mark_text,
	change_mark_text;


/*
| Capsule
*/
(function() {
'use strict';


var
	prototype;


if( NODE )
{
	jion = require( 'jion' );

	visual_mark_text = jion.this( module, 'source' );
}


prototype = visual_mark_text.prototype;


/*
| Initializer.
*/
prototype._init =
	function(
		changeMarkText  // mark for the change engine
	)
{

	if( changeMarkText )
	{
		this.path = changeMarkText.path.prepend( 'spaceVisual' );

		this.at = changeMarkText.at;

		jion.aheadValue( this, 'changeMarkText', changeMarkText ); 
	}

/**/if( CHECK )
/**/{
/**/	if( this.path.isEmpty ) throw new Error( );
/**/
/**/	if( this.at < 0 ) throw new Error( );
/**/}

};


/*
| Recreates this mark with a transformation
| applied.
*/
prototype.createTransformed =
	function(
		changes
	)
{
	var
		tm;

	if( this.path.get( 0 ) !== 'spaceVisual' ) return this;

	tm = changes.transform( this.changeMarkText );

	if( !tm ) return undefined;

	return this.create( 'changeMarkText', tm );
};



/*
| The change engine's textmark.
*/
jion.lazyValue(
	prototype,
	'changeMarkText',
	function( )
{
	if( this.path.get( 0 ) !== 'spaceVisual' ) return;

	return(
		change_mark_text.create(
			'at', this.at,
			'path', this.path.chop
		)
	);
}
);


} )( );
