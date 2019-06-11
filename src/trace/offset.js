/*
| A trace into a text.
*/
'use strict';


tim.define( module, ( def, trace_offset ) => {


def.extend = './bare';


if( TIM )
{
	def.attributes =
	{
		// offset of the trace
		at : { type : 'integer' },
	};

	// path of trace back.
	def.list =
	[
		'./doc',
		'./field',
		'./form',
		'./forms',
		'./item',
		'./para',
		'./root',
		'./space',
		'./widget'
	];
}


const mark_pat = tim.require( '../mark/pat' );


/*
| The offset reference - 1.
*/
def.lazy.backward =
	function( )
{
	const at = this.at;

	if( at <= 0 ) return;

	const o = this.create( 'at', this.at - 1 );

	tim.aheadValue( o, 'forward', this );

	return o;
};


/*
| Returns a trace with a changed offset
*/
def.proto.changeTo =
	function(
		at  // offset
	)
{
	return this.get( this.length - 1 ).appendOffset( at );
};


/*
| The offset trace + 1.
*/
def.lazy.forward =
	function( )
{
	const o = this.create( 'at', this.at + 1 );

	tim.aheadValue( o, 'backward', this );

	return o;
};


/*
| FIXME remove.
*/
def.lazy.toMarkPat =
	function( )
{
	return mark_pat.createPathAt( this.last.toPath, this.at );
};


} );
