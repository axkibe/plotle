/*
| A color.
|
| Optinally including alpha channel.
*/


var
	euclid_color,
	jools;


/*
| Capsule
*/
( function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		id :
			'euclid_color',
		attributes :
			{
				alpha :
					{
						comment :
							'alpha value',
						type :
							'number',
						defaultValue :
							'undefined'
					},
				red :
					{
						comment :
							'red value',
						type :
							'integer'
					},
				green :
					{
						comment :
							'green value',
						type :
							'integer'
					},
				blue :
					{
						comment :
							'blue value',
						type :
							'integer'
					}
			}
	};
}


var
	prototype;

prototype = euclid_color.prototype;


/*
| Shortcut creator.
*/
euclid_color.rgb =
	function(
		red,
		green,
		blue
	)
{
	return(
		euclid_color.create(
			'red', red,
			'green', green,
			'blue', blue
		)
	);
};


/*
| Shortcut creator.
*/
euclid_color.rgba =
	function(
		red,
		green,
		blue,
		alpha
	)
{
	return(
		euclid_color.create(
			'red', red,
			'green', green,
			'blue', blue,
			'alpha', alpha
		)
	);
};


/*
| Color text understood by browser.
*/
jools.lazyValue(
	prototype,
	'css',
	function( )
	{
		if( this.alpha )
		{
			return(
				'rgba( '
				+ this.red + ', '
				+ this.green + ', '
				+ this.blue + ', '
				+ this.alpha
				+ ' )'
			);
		}
		else
		{
			return(
				'rgb( '
				+ this.red + ', '
				+ this.green + ', '
				+ this.blue
				+ ' )'
			);
		}
	}
);




} )( );
