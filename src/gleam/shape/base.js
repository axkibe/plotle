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
		// point the shape goes to or "close" to return to beginning
		p : { type : [ '../point', 'string' ] },

		// funnels into this direction
		funnelDir : { type : [ '<../angle/dir-types', 'undefined' ] },
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

	if( this.p === 'close' ) return this;

	return this.create( 'p', this.p.transform( transform ) );
};


} );
