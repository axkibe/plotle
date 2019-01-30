/*
| Abstract parent of disc panels
*/
'use strict';


tim.define( module, ( def ) => {


def.abstract = true;


/*
| Returns the hover path when a disc
| is concerned about it.
*/
def.static.concernsHover =
def.proto.concernsHover =
	function(
		hover,  // hover path
		path    // path of the disc
	)
{

/**/if( CHECK )
/**/{
/**/	if( path.get( 0 ) !== 'disc' || path.get( 1 ) !== 'twig' ) throw new Error( );
/**/}

	return(
		(
			hover
			&& hover.length > 2
			&& hover.get( 0 ) === 'disc'
			&& hover.get( 2 ) === path.get( 2 )
		)
		? hover
		: undefined
	);
};


} );
