/*
| A trace into a text.
*/
'use strict';


tim.define( module, ( def, trace_offset ) => {


def.extend = './base';


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
		'./text',
		'./widget'
	];

	def.json = './base';
}


const trace_base = tim.require( './base' );


/*
| Custom JSON converter.
*/
def.lazy.asJSON =
	function( )
{
	return(
		{
			type : 'trace',
			trace : [ '(o)offset', this.at ].concat( this.last.asJSON.trace )
		}
	);
};


/*
| The trace step as string (for debugging).
*/
def.lazy.asStringStep =
	function( )
{
	return 'offset(' + this.at + ')';
};


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
	return this.get( this.length - 1 ).appendText.appendOffset( at );
};


/*
| Creates one step from the a JSON.
*/
def.static.createFromJSONStep =
	function(
		trace, // the json trace
		pos    // the position in the trace
	)
{
	if( CHECK )
/**/{
/**/	if( trace[ pos ] !== '(o)offset' ) throw new Error( );
/**/}

	const at = trace[ pos + 1 ];

	return trace_base.createFromJSONTrace( trace, pos + 2 ).appendOffset( at );
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


} );
