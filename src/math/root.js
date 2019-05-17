/*
| maximum integer variable.
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


/*
| Limits value to be between min and max
*/
def.static.limit =
	function(
		min,
		val,
		max
	)
{
/**/if( CHECK )
/**/{
/**/	if( min > max ) throw new Error( );
/**/}

	if( val < min ) return min;

	if( val > max ) return max;

	return val;
};

/*
| Maximum integer variable.
*/
def.static.maxInteger = 9007199254740992;


} );
