/*
| A poition in a text.
|
| FIXME currently unused.
*/


var
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
			'mark_text',
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
					}
			},
		init :
			[ ]
	};
}


if( SERVER )
{
	mark_text = require( '../jion/this' )( module );
}


/*
| Initializer.
*/
mark_text.prototype._init =
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


} )( );
