/*
| Base of all section types of a shape.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


if( TIM )
{
	def.attributes =
	{
		// starts here
		// FIXME allow "close"
		p : { type : [ '../point', 'undefined' ] },

		// grows the border in this direction
		border : { type : [ '<../../compass/dir-types', 'undefined' ] },
	};
}


const gleam_transform = tim.require( '../transform' );


/*
| Returns a transformed shape section.
*/
def.proto.transform =
	function(
		transform
	)
{

/**/if( CHECK )
/**/{
/**/	if( transform.timtype !== gleam_transform ) throw new Error( );
/**/}

	if( this.p === undefined ) return this;

	return this.create( 'p', this.p.transform( transform ) );
};


} );
