/*
| Generates jooled objects from a jools definition.
|
| Authors: Axel Kittenberger
*/


/*
| Capsule.
*/
(function( ) {
'use strict';


/*
| The jion definition.
*/
if( JION )
{
	return {
		name :
			'Gen',
		node :
			true,
		attributes :
			{
				'jion' :
					{
						comment :
							'the jion definition',
						type :
							'Object'
					}
			},
		init :
			[ ]
	};
}


var
	Gen =
		require( '../jion/this' )( module ),
	Shorthand =
		require( '../ast/shorthand' ),
	jools =
		require( '../jools/jools' ),
	Validator =
		require( './validator' );

/*
| Shorthanding Shorthands.
*/
var
	anAnd =
		Shorthand.anAnd,
	anArrayLiteral =
		Shorthand.anArrayLiteral,
	anAssign =
		Shorthand.anAssign,
	aBlock =
		Shorthand.aBlock,
	aCall =
		Shorthand.aCall,
	aCommaList =
		Shorthand.aCommaList,
	aCondition =
		Shorthand.aCondition,
	aDelete =
		Shorthand.aDelete,
	aDiffers =
		Shorthand.aDiffers,
	anEquals =
		Shorthand.anEquals,
	False =
		Shorthand.False( ),
	aFile =
		Shorthand.aFile,
	aFunc =
		Shorthand.aFunc,
	aGreaterThan =
		Shorthand.aGreaterThan,
	anIf =
		Shorthand.anIf,
	anInstanceof =
		Shorthand.anInstanceof,
	aLessThan =
		Shorthand.aLessThan,
	aNew =
		Shorthand.aNew,
	aNot =
		Shorthand.aNot,
	aNull =
		Shorthand.aNull( ),
	aNumberLiteral =
		Shorthand.aNumberLiteral,
	anObjLiteral =
		Shorthand.anObjLiteral,
	anOr =
		Shorthand.anOr,
	aPlus =
		Shorthand.aPlus,
	aPlusAssign =
		Shorthand.aPlusAssign,
	aPreIncrement =
		Shorthand.aPreIncrement,
	aStringLiteral =
		Shorthand.aStringLiteral,
	aSwitch =
		Shorthand.aSwitch,
	This = // FIXME and others
		Shorthand.aVar( 'this' ),
	True =
		Shorthand.True( ),
	aTypeof =
		Shorthand.aTypeof,
	Undefined =
		Shorthand.aVar( 'undefined' ),
	aVar =
		Shorthand.aVar,
	aVList =
		Shorthand.aVList;

/*
| Converts a camel case string to a dash seperated string.
*/
var
camelCaseToDash =
	function( s )
{
	return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase( );
};


/*
| Adapts naming conventions
|
| FIXME remove
*/
var
adaptName =
	function(
		unit,
		name
	)
{
	if( !unit )
	{
		return name[ 0 ].toLowerCase( ) + name.slice( 1 );
	}

	return (
		unit[ 0 ].toLowerCase( ) + unit.slice( 1 )
		+
		'.'
		+
		name[ 0 ].toLowerCase( ) + name.slice( 1 )
	);
};

/*
| Initializes a generator.
*/
Gen.prototype._init =
	function( )
{
	var
		assign,
		attr,
		attributes,
		attrList,
		attrType,
		attrUnit,
		concerns,
		constructorList,
		defaultValue,
		jAttr,
		jdv,
		jion,
		ut,
		name,
		// twigs to be recognized
		subParts,
		// processed twig table for generator use
		twig,
		// twig map to be used (the definition)
		twigMap,
		// twigs sorted alphabetically
		twigList,
		// units sorted alphabetically
		unitList,
		// units used
		units;

	attributes = { };

	constructorList = [ ];

	jion = this.jion;

	twig = null;

	twigMap = null;

	units = { };

	this.hasJSON = !!jion.json;

	this.init = jion.init;

	this.name = jion.name;

	this.node = !!jion.node;

	this.singleton = !!jion.singleton;

	if( jion.subclass )
	{
		subParts = jion.subclass.split( '.' );

		if( subParts.length >=  2 )
		{
			if( subParts.length > 2 )
			{
				throw new Error( 'subclass can only have one dot' );
			}

			if( !units[ subParts[ 0 ] ] )
			{
				units[ subParts[ 0 ] ] = { };
			}

			units[ subParts[ 0 ] ][ subParts[ 1 ] ] = true;

			this.subclass =
				aVar( subParts[ 0 ] )
				.aDot( subParts[ 1 ] );
		}
		else
		{
			this.subclass = aVar( jion.subclass );
		}
	}

	this.unit = jion.unit;

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		// TODO
		if( jAttr.unit )
		{
			console.log( 'WARNING: ' + jAttr.unit + '.' + jAttr.type );
		}
		else if( jAttr.type.indexOf( '.' ) < 0  )
		{
			switch( jAttr.type )
			{
				case 'Boolean' :
				case 'Integer' :
				case 'Number' :
				case 'Object' :
				case 'String' :

					break;

				default :

					console.log( 'WARNING: NONE.' + jAttr.type );
			}
		}

		if( jAttr.type.indexOf( '.' ) >= 0 )
		{
			attrUnit = jAttr.type.split( '.' )[ 0 ];

			attrType = jAttr.type.split( '.' )[ 1 ];
		}
		else
		{
			attrUnit = jAttr.unit;

			attrType = jAttr.type;
		}

		if( jAttr.json )
		{
			this.hasJSON = true;
		}

		if( attrUnit )
		{
			if( !units[ attrUnit ] )
			{
				units[ attrUnit ] = { };
			}

			units[ attrUnit ][ attrType ] = true;
		}

		assign =
			jAttr.assign !== undefined
				?
				jAttr.assign
				:
				name;

		if(
			assign !== null
			||
			(
				this.init
				&&
				this.init.indexOf( name ) >= 0
			)
		)
		{
			constructorList.push( name );
		}

		defaultValue = null;

		concerns = jAttr.concerns;

		if( concerns && concerns.unit )
		{
			if( !units[ concerns.unit ] )
			{
				units[ concerns.unit ] = { };
			}

			units[ concerns.unit ][ concerns.type ] = true;
		}

		// tests also if defaultValue is defined to be `undefined`
		if( Object.keys( jAttr ).indexOf( 'defaultValue' ) >= 0 )
		{
			jdv = jAttr.defaultValue;

			if( jdv === null )
			{
				defaultValue = aNull;
			}
			else if( jdv === undefined )
			{
				defaultValue = Undefined;
			}
			else if( jdv === false )
			{
				defaultValue = False;
			}
			else if( jdv === true )
			{
				defaultValue = True;
			}
			else if( typeof( jdv ) === 'number' )
			{
				defaultValue = aNumberLiteral( jAttr.defaultValue );
			}
			else if( jools.isString( jdv ) )
			{
				if( jdv[ 0 ] === "'" )
				{
					throw new Error(
						'invalid default Value: ' + jdv
					);
				}

				defaultValue = aStringLiteral( jdv );
			}
		}

		attr =
		attributes[ name ] =
			Object.freeze( {
				allowsNull :
					jAttr.allowsNull
					||
					defaultValue === aNull,
				allowsUndefined :
					jAttr.allowsUndefined
					||
					defaultValue === Undefined,
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns,
				defaultValue :
					defaultValue,
				json :
					jAttr.json,
				name :
					name,
				type :
					attrType,
				unit :
					attrUnit,
				v :
					aVar( 'v_' + name )
			} );
	}

	attrList =
		Object.keys( attributes ).sort ( );

	this.attrList =
		Object.freeze( attrList );

	this.attributes =
		Object.freeze( attributes );

	constructorList.sort( );

	if( jion.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( jion.init )
	{
		var
			// sorted init list
			inits =
				jion.init.slice( ).sort( );

		for(
			var a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name =
				jion.init[ a ];

			if( attributes[ name ] )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					constructorList.unshift( name );

					break;

				default :

					throw new Error(
						'invalid init value: ' + name
					);
			}
		}
	}

	this.constructorList =
		Object.freeze( constructorList );

	if( jion.twig )
	{
		twig = { };

		if( jools.isString( jion.twig ) )
		{
/**/		if( CHECK )
/**/		{
/**/			if( !/[a-zA-Z_-]+/.test( jion.twig ) )
/**/			{
/**/				throw new Error( 'invalid typemap reference' );
/**/			}
/**/		}

			twigMap = require( '../typemaps/' + jion.twig );
		}
		else
		{
			twigMap = jion.twig;
		}

		for( name in twigMap )
		{
			ut = twigMap[ name ].split( '.' );

			if( ut.length !== 2 )
			{
				throw new Error(
					'invalid twig unit.type: ' + name
				);
			}

			if( !units[ ut[ 0 ] ] )
			{
				units[ ut[ 0 ] ] = { };
			}

			units[ ut[ 0 ] ][ ut[ 1 ] ] = true;

			twig[ name ] =
				Object.freeze( {
					unit :
						ut[ 0 ],
					type :
						ut[ 1 ]
				} );
		}

		this.twig = Object.freeze( twig );
	}
	else
	{
		twig =
		this.twig =
			null;
	}

	unitList = Object.keys( units ).sort( );

	this.unitList = Object.freeze( unitList );

	this.units = Object.freeze( units );

	if( twig )
	{
		twigList = Object.keys( twig ).sort( );

		this.twigList = Object.freeze( twigList );
	}

	// FUTURE make it a aVar
	this.reference =
		( jion.unit === jion.name )
			?
			jion.name + 'Obj'
			:
			jion.name;

	this.equals = jion.equals;

	this.alike = jion.alike;
};


/*
| Generates the imports.
*/
Gen.prototype.genImports =
	function(
		capsule // block to append to
	)
{
	capsule = capsule.aComment( 'Imports.' );

	capsule =
		capsule
		.aVarDec( 'JoobjProto' )
		.aVarDec( 'jools' );

	// FUTURE when type checking is there this might become needed
	// without jsons
	if( this.hasJSON )
	{
		for(
			var a = 0, aZ = this.unitList.length;
			a < aZ;
			a++
		)
		{
			capsule =
				capsule
				.aVarDec( this.unitList[ a ] );
		}
	}

	return capsule;
};


/*
| Generates the node include.
*/
Gen.prototype.genNodeIncludes =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		b,
		bZ,
		block,
		typeName,
		types,
		unitName,
		unit;

	capsule = capsule.aComment( 'Node includes.' );

	block =
		aBlock( )
		.anAssign(
			aVar( 'JoobjProto' ),
			aCall(
				aVar( 'require' ),
				aStringLiteral( '../../src/jion/proto' )
			)
		)
		.anAssign(
			aVar( 'jools' ),
			aCall(
				aVar( 'require' ),
				aStringLiteral( '../../src/jools/jools' )
			)
		);

	// generates the unit objects

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		block =
			block
			.anAssign(
				aVar( this.unitList[ a ] ),
				anObjLiteral( )
			);
	}

	for(
		a = 0, aZ = this.unitList.length;
		a < aZ;
		a++
	)
	{
		unitName =
			this.unitList[ a ];

		unit =
			this.units[ this.unitList[ a ] ];

		types =
			Object.keys( unit );

		types.sort( );

		for(
			b = 0, bZ = types.length;
			b < bZ;
			b++
		)
		{
			typeName =
				types[ b ];

			block =
				block
				.anAssign(
					aVar( unitName ).aDot( typeName ),
					aCall(
						aVar( 'require' ),
						aStringLiteral(
							'../../src/' +
								camelCaseToDash( unitName ) +
								'/' +
								camelCaseToDash( typeName )
						)
					)
				);
		}
	}

	capsule =
		capsule.anIf(
			aVar( 'SERVER' ),
			block
		);

	return capsule;
};


/*
| Generates the constructor.
*/
Gen.prototype.genConstructor =
	function(
		capsule // block to append to
	)
{
	var
		a,
		assign,
		aZ,
		attr,
		block,
		constructor,
		initCall,
		jionObj,
		name;

	capsule = capsule.aComment( 'Constructor.' );

	block = aBlock( );

	// assigns the variables
	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		assign =
			anAssign(
				This.aDot( attr.assign ),
				attr.v
			);

		if( !attr.allowsUndefined )
		{
			block =
				block.Append( assign );
		}
		else
		{
			block =
				block
				.anIf(
					aDiffers( attr.v, Undefined ),
					aBlock( )
					.Append(
						assign
					)
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.anAssign(
				This.aDot( 'twig' ),
				aVar( 'twig' )
			)
			.anAssign(
				This.aDot( 'ranks' ),
				aVar( 'ranks' )
			);
	}

	// calls the initializer
	if( this.init )
	{
		initCall =
			aCall(
				This.aDot( '_init' )
			);

		for(
			a = 0, aZ = this.init.length;
			a < aZ;
			a++
		)
		{
			name =
				this.init[ a ];

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					initCall =
						initCall.Append(
							aVar( this.init[ a ] )
						);

					continue;
			}

			attr =
				this.attributes[ name ];

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall =
				initCall.Append( ( attr.v ) );
		}

		block =
			block.Append(
				initCall
			);
	}

	// immutes the new object
	block =
		block
		.aCall(
			aVar( 'jools' ).aDot( 'immute' ),
			This
		);

	if( this.twig )
	{
		block =
			block
			.aCall(
				aVar( 'jools' ).aDot( 'immute' ),
				aVar( 'twig' )
			)
			.aCall(
				aVar( 'jools' ).aDot( 'immute' ),
				aVar( 'ranks' )
			);
	}

	constructor = aFunc( block );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				constructor =
					constructor.Arg(
						'inherit',
						'inheritance'
					);

				break;

			case 'ranks' :

				constructor =
					constructor.Arg(
						'ranks',
						'twig ranks'
					);

				break;

			case 'twig' :

				constructor =
					constructor.Arg(
						'twig',
						'twig'
					);

				break;

			case 'twigDup' :

				constructor =
					constructor.Arg(
						'twigDup',
						'true if twig is already been duplicated'
					);

				break;
			default :

				attr =
					this.attributes[ name ];

				constructor =
					constructor.Arg(
						attr.v.name,
						attr.comment
					);
		}
	}

	capsule =
		capsule.aVarDec(
			'Constructor',
			constructor
		);

	// subclass
	if( this.subclass )
	{
		capsule =
			capsule
			.aComment( 'Subclass.' )
			.aCall(
				aVar( 'jools' ).aDot( 'subclass' ),
				aVar( 'Constructor' ),
				this.subclass
			);
	}

	// prototype shortcut
	capsule =
		capsule
		.aComment( 'Prototype shortcut' )
		.aVarDec(
			'prototype',
			aVar( 'Constructor' ).aDot( 'prototype' )
		);

	// the exported object
	capsule = capsule.aComment( 'Jion.' );

	jionObj =
		anObjLiteral( )
		.Add(
			'prototype',
			aVar( 'prototype' )
		);

	if( this.unit )
	{
		capsule =
			capsule.aVarDec(
				this.reference,
				anAssign(
					aVar( this.unit ).aDot( this.name ),
					jionObj
				)
			);

	}
	else
	{
		capsule =
			capsule
			.anAssign(
				aVar( this.reference ),
				jionObj
			);
	}

	return capsule;
};



/*
| Generates the singleton decleration.
*/
Gen.prototype.genSingleton =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.aComment( 'Singleton' )
		.aVarDec(
			'_singleton',
			aNull
		)
	);
};


/*
| Generates the creators variable list.
*/
Gen.prototype.genCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		varList.push( this.attributes[ name ].v.name );
	}

	varList.push( 'inherit' );

	if( this.twig )
	{
		varList.push(
			'key',
			'rank',
			'ranks',
			'twig',
			'twigDup'
		);
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.aVarDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
Gen.prototype.genCreatorInheritanceReceiver =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		thisCheck,
		name,
		receiver =
			aBlock( )
			.anAssign(
				aVar( 'inherit' ),
				This
			);

	if( this.twig )
	{
		receiver =
			receiver
			.anAssign(
				aVar( 'twig' ),
				aVar( 'inherit' ).aDot( 'twig' )
			)
			.anAssign(
				aVar( 'ranks' ),
				aVar( 'inherit' ).aDot( 'ranks' )
			)
			.anAssign(
				aVar( 'twigDup' ),
				False
			);
	}

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver
			.anAssign(
				attr.v,
				This.aDot ( attr.assign )
			);
	}

	thisCheck =
		anIf(
			aDiffers(
				This,
				aVar( this.reference )
			),
			receiver
		);

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.Elsewise(
				aBlock( )
				.anAssign(
					aVar( 'twig' ),
					anObjLiteral( )
				)
				.anAssign(
					aVar( 'ranks' ),
					anArrayLiteral( )
				)
				.anAssign(
					aVar( 'twigDup' ),
					True
				)
			);
	}

	return block.Append( thisCheck );
};


/*
| Generates the creators free strings parser.
*/
Gen.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		switchExpr;

	if( !this.twig && this.attrList.length === 0 )
	{
		// no free strings parses needed
		// FIXME check for no arguments
		return block;
	}

	loop =
		aBlock( )
		.aVarDec(
			'arg',
			aVar( 'arguments' )
			.aMember(
				aPlus(
					aVar( 'a' ),
					aNumberLiteral( 1 )
				)
			)
		);

	switchExpr =
		aSwitch(
			aVar( 'arguments' )
			.aMember(
				aVar( 'a' )
			)
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		switchExpr =
			switchExpr
			.aCase(
				aStringLiteral( name  ),
				aBlock( )
				.anIf(
					aDiffers(
						aVar( 'arg' ),
						Undefined
					),
					aBlock( )
					.anAssign(
						attr.v,
						aVar( 'arg' )
					)
				)
			);
	}

	if( this.twig )
	{
		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.aCase(
				aStringLiteral( 'twig:add' ),
				aBlock( )
				.anIf(
					aNot(
						aVar( 'twigDup' )
					),
					aBlock( )
					.anAssign(
						aVar( 'twig' ),
						aCall(
							aVar( 'jools' ).aDot( 'copy' ),
							aVar( 'twig' )
						)
					)
					.anAssign(
						aVar( 'ranks' ),
						aCall(
							aVar( 'ranks' ).aDot( 'slice' )
						)
					)
					.anAssign(
						aVar( 'twigDup' ),
						True
					)
				)
				.anAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.anAssign(
					aVar( 'arg' ),
					aVar( 'arguments' )
					.aMember(
						aPlus(
							aPreIncrement( aVar( 'a' ) ),
							aNumberLiteral( 1 )
						)
					)
				)
				.anIf(
					aDiffers(
						aVar( 'twig' ).aMember(
							aVar( 'key' )
						),
						Undefined
					),
					aBlock( )
					.aFail(
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" already in use' )
						)
					)
				)
				.anAssign(
					aVar( 'twig' ).aMember( aVar( 'key' ) ),
					aVar( 'arg' )
				)
				.aCall(
					aVar( 'ranks' ).aDot( 'push' ),
					aVar( 'key' )
				)
			)
			.aCase(
				aStringLiteral( 'twig:set' ),
				aBlock( )
				.anIf(
					aNot( aVar( 'twigDup' ) ),
					aBlock( )
					.anAssign(
						aVar( 'twig' ),
						aCall(
							aVar( 'jools' ).aDot( 'copy' ),
							aVar( 'twig' )
						)
					)
					.anAssign(
						aVar( 'ranks' ),
						aCall(
							aVar( 'ranks' ).aDot( 'slice' )
						)
					)
					.anAssign(
						aVar( 'twigDup' ),
						True
					)
				)
				.anAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.anAssign(
					aVar( 'arg' ),
					aVar( 'arguments' )
					.aMember(
						aPlus(
							aPreIncrement( aVar( 'a' ) ),
							aNumberLiteral( 1 )
						)
					)
				)
				.anIf(
					anEquals(
						aVar( 'twig' ).aMember(
							aVar( 'key' )
						),
						Undefined
					),
					aBlock( )
					.aFail(
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" not in use' )
						)
					)
				)
				.anAssign(
					aVar( 'twig' )
					.aMember(
						aVar( 'key' )
					),
					aVar( 'arg' )
				)
			)
			.aCase(
				aStringLiteral( 'twig:insert' ),
				aBlock( )
				.anIf(
					aNot( aVar( 'twigDup' ) ),
					aBlock( )
					.anAssign(
						aVar( 'twig' ),
						aCall(
							aVar( 'jools' ).aDot( 'copy' ),
							aVar( 'twig' )
						)
					)
					.anAssign(
						aVar( 'ranks' ),
						aCall(
							aVar( 'ranks' ).aDot( 'slice' )
						)
					)
					.anAssign(
						aVar( 'twigDup' ),
						True
					)
				)
				.anAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.anAssign(
					aVar( 'rank' ),
					aVar( 'arguments' )
					.aMember(
						aPlus(
							aVar( 'a' ),
							aNumberLiteral( 2 )
						)
					)
				)
				.anAssign(
					aVar( 'arg' ),
					aVar( 'arguments' )
					.aMember(
						aPlus(
							aVar( 'a' ),
							aNumberLiteral( 3 )
						)
					)
				)
				.Append(
					aPlusAssign(
						aVar( 'a' ),
						aNumberLiteral( 2 )
					)
				)
				.anIf(
					aDiffers(
						aVar( 'twig' )
						.aMember(
							aVar( 'key' )
						),
						Undefined
					),
					aBlock( )
					.aFail(
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" already in use' )
						)
					)
				)
				.anIf(
					anOr(
						aLessThan(
							aVar( 'rank' ),
							aNumberLiteral( 0 )
						),
						aGreaterThan(
							aVar( 'rank' ),
							aVar( 'ranks' ).aDot( 'length' )
						)
					),
					aBlock( )
					.aFail(
						aStringLiteral( 'invalid rank' )
					)
				)
				.anAssign(
					aVar( 'twig' )
					.aMember(
						aVar( 'key' )
					),
					aVar( 'arg' )
				)
				.Append(
					aCall(
						aVar( 'ranks' ).aDot( 'splice' ),
						aVar( 'rank' ),
						aNumberLiteral( 0 ),
						aVar( 'key' )
					)
				)
			)
			.aCase(
				aStringLiteral( 'twig:remove' ),
				aBlock( )
				.anIf(
					aNot(
						aVar( 'twigDup' )
					),
					aBlock( )
					.anAssign(
						aVar( 'twig' ),
						aCall(
							aVar( 'jools' ).aDot( 'copy' ),
							aVar( 'twig' )
						)
					)
					.anAssign(
						aVar( 'ranks' ),
						aCall(
							aVar( 'ranks' ).aDot( 'slice' )
						)
					)
					.anAssign(
						aVar( 'twigDup' ),
						True
					)
				)
				.anIf(
					anEquals(
						aVar( 'twig' )
						.aMember(
							aVar( 'arg' )
						),
						Undefined
					),
					aBlock( )
					.aFail(
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'arg' ),
							aStringLiteral( '" not in use' )
						)
					)
				)
				.Append(
					aDelete(
						aVar( 'twig' )
						.aMember(
							aVar( 'arg' )
						)
					)
				)
				.Append(
					aCall(
						aVar( 'ranks' ).aDot( 'splice' ),
						aCall(
							aVar( 'ranks' ).aDot( 'indexOf' ),
							aVar( 'arg' )
						),
						aNumberLiteral( 1 )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			aBlock( )
			.aCheck(
				aBlock( )
				.aFail( 'invalid argument' )
			)
		);

	loop =
		loop.Append( switchExpr );

	block =
		block
		.aFor(
			aVList( )
			.aVarDec(
				'a',
				aNumberLiteral( 0 )
			)
			.aVarDec(
				'aZ',
				aVar( 'arguments' ).aDot( 'length' )
			),
			aLessThan(
				aVar( 'a' ),
				aVar( 'aZ' )
			),
			aPlusAssign(
				aVar( 'a' ),
				aNumberLiteral( 2 )
			),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
Gen.prototype.genCreatorDefaults =
	function(
		block,   // block to append to
		json     // only do jsons
	)
{
	var
		a,
		aZ,
		attr,
		name;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( json && !attr.json )
		{
			continue;
		}

		if( attr.defaultValue !== null )
		{
			block =
				block
				.anIf(
					anEquals( attr.v, Undefined ),
					aBlock( )
					.anAssign( attr.v, attr.defaultValue )
				);
		}
	}

	return block;
};


/*
| Generates the creators checks.
*/
Gen.prototype.genCreatorChecks =
	function(
		block, // block to append to
		checkin  // do checks only when CHECKin
	)
{
	var
		attr,
		check,
		cond,
		name,
		tcheck,
		tfail;

	if( checkin )
	{
		check =
			aBlock( );
	}
	else
	{
		check =
			block;
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.allowsUndefined )
		{
			check =
				check.anIf(
					anEquals( attr.v, Undefined ),
					aBlock( )
					.aFail( 'undefined attribute ' + name )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.anIf(
					anEquals( attr.v, aNull ),
					aBlock( )
					.aFail( 'attribute ' + name + ' must not be null.' )
				);
		}

		switch( attr.type )
		{
			case 'Action' :
			case 'Array' :
			case 'Function' :
			case 'Item' :
			case 'Mark' :
			case 'Object' :

				continue;
		}

		if( attr.allowsNull && !attr.allowsUndefined )
		{
			cond =
				aDiffers( attr.v, aNull );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				aDiffers( attr.v, Undefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				anAnd(
					aDiffers( attr.v, aNull ),
					aDiffers( attr.v, Undefined )
				);
		}
		else
		{
			cond =
				null;
		}

		switch( attr.type )
		{
			case 'Boolean' :

				tcheck =
					aDiffers(
						aTypeof( attr.v ),
						aStringLiteral( 'boolean' )
					);

				break;

			case 'Integer' :

				tcheck =
					anOr(
						aDiffers(
							aTypeof( attr.v ),
							aStringLiteral( 'number' )
						),
						aDiffers(
							aCall(
								aVar( 'Math' ).aDot( 'floor' ),
								attr.v
							),
							attr.v
						)
					);

				break;

			case 'Number' :

				tcheck =
					aDiffers(
						aTypeof( attr.v ),
						aStringLiteral( 'number' )
					);

				break;


			case 'String' :

				tcheck =
					anAnd(
						aDiffers(
							aTypeof( attr.v ),
							aStringLiteral( 'string' )
						),
						aNot(
							anInstanceof(
								attr.v,
								aVar( 'String' )
							)
						)
					);

				break;

			default :

				tcheck =
					aDiffers(
						attr.v.aDot( 'reflexName' ), // FIXME
						aStringLiteral( attr.type )
					);

				break;
		}

		tfail =
			aBlock( )
			.aFail( 'type mismatch' );

		if( cond )
		{
			check =
				check.anIf(
					cond,
					aBlock( )
					.anIf(
						tcheck,
						tfail
					)
				);
		}
		else
		{
			check =
				check.anIf(
					tcheck,
					tfail
				);
		}
	}


	// FIXME, in case of check is empty
	//        do not append

	if( checkin )
	{
		block = block.aCheck( check );
	}

	return block;
};


/*
| Generates the creators concerns.
|
| 'func' is a call to a function
| 'member' is an access to an attribute ( without call )
*/
Gen.prototype.genCreatorConcerns =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		args,
		b,
		bZ,
		bAttr,
		cExpr,
		concerns,
		func,
		member,
		name,
		type,
		unit;

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		concerns = attr.concerns;

		if( !concerns )
		{
			continue;
		}

		unit = concerns.unit;

		type = concerns.type;

		args = concerns.args;

		func = concerns.func;

		member = concerns.member;

		if( func )
		{
			if( unit )
			{
				cExpr =
					aCall(
						aVar( unit ).aDot( type ).aDot( func )
					);
			}
			else
			{
				cExpr =
					aCall( aVar( func ) );
			}

			for(
				b = 0, bZ = args.length;
				b < bZ;
				b++
			)
			{
				// FUTURE, make a gen.getCreatorVarName func

				bAttr = this.attributes[ args[ b ] ];

				if( !bAttr )
				{
					throw new Error(
						'unknown attribute: ' + args[ b ]
					);
				}

				cExpr = cExpr.Append( bAttr.v );
			}
		}
		else
		{
			if( !member )
			{
				throw new Error(
					'concerns neither func or member'
				);
			}

			if( !args )
			{
				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error( 'FIXME' );
				}
				else if( attr.allowsNull )
				{
					cExpr =
						aCondition(
							aDiffers( attr.v, aNull ),
							attr.v.aDot( member ),
							aNull
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						aCondition(
							aDiffers( attr.v, Undefined ),
							attr.v.aDot( member ),
							aNull
						);
				}
				else
				{
					cExpr =
						attr.v.aDot( member );
				}
			}
			else
			{
				cExpr =
					aCall(
						attr.v.aDot( member )
					);

				for(
					b = 0, bZ = args.length;
					b < bZ;
					b++
				)
				{
					bAttr =
						this.attributes[ args[ b ] ];

					if( !bAttr )
					{
						throw new Error(
							'unknown attribute: ' + args[ b ]
						);
					}

					cExpr =
						cExpr.Append( bAttr.v );
				}
			}
		}

		block =
			block
			.anAssign( attr.v, cExpr );
	}

	return block;
};


/*
| Generates the creators unchanged detection,
|
| returning this object if so.
*/
Gen.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		attr,
		ceq,
		cond,
		name;

	cond = aVar( 'inherit' );


	if( this.twig )
	{
		cond =
			anAnd(
				cond,
				aNot(
					aVar( 'twigDup' )
				)
			);
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			cond =
				anAnd(
					cond,
					anEquals( attr.v, aNull )
				);

			continue;
		}

		// FUTURE use genAttributeEquals

		switch( attr.type )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
			case 'Mark' : // FIXME
			case 'Number' :
			case 'Object' :
			case 'String' :

				ceq =
					anEquals(
						attr.v,
						aVar( 'inherit' ).aDot( attr.assign )
					);

				break;

			default :

				if( !attr.allowsNull && !attr.allowsUndefined )
				{
					ceq =
						aCall(
							attr.v.aDot( 'equals' ),
							aVar( 'inherit' ).aDot( attr.assign )
						);
				}
				else
				{
					ceq =
						anOr(
							anEquals(
								attr.v,
								aVar( 'inherit' ).aDot( attr.assign )
							),
							anAnd(
								attr.v,
								aCall(
									attr.v.aDot( 'equals' ),
									aVar( 'inherit' ).aDot( attr.assign )
								)
							)
						);
				}
		}

		cond =
			anAnd(
				cond,
				ceq
			);
	}

	block =
		block.anIf(
			cond,
			aBlock( )
			.aReturn(
				aVar( 'inherit' )
			)
		);

	return block;
};


/*
| Generates the creators return statement
*/
Gen.prototype.genCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	if( this.singleton )
	{
		return (
			block
			.anIf(
				aNot(
					aVar( '_singleton' )
				),
				aBlock( )
				.anAssign(
					aVar( '_singleton' ),
					aNew(
						aCall(
							aVar( 'Constructor' )
						)
					)
				)
			)
			.aReturn(
				aVar( '_singleton' )
			)
		);
	}

	call =
		aCall(
			aVar( 'Constructor' )
		);

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :
			case 'twig' :
			case 'twigDup' :
			case 'ranks' :

				call =
					call.Append(
						aVar( name )
					);

				break;

			default :

				attr = this.attributes[ name ];

				call = call.Append( attr.v );
		}
	}

	return (
		block.aReturn(
			aNew( call )
		)
	);
};


/*
| Generates the creator.
*/
Gen.prototype.genCreator =
	function(
		capsule // block to append to
	)
{
	var
		block,
		creator;

	capsule =
		capsule.aComment(
			'Creates a new ' + this.name + ' object.'
		);

	block = aBlock( );

	block = this.genCreatorVariables( block );

	block = this.genCreatorInheritanceReceiver( block );

	block = this.genCreatorFreeStringsParser( block );

	block = this.genCreatorDefaults( block, false );

	block = this.genCreatorChecks( block, true );

	block = this.genCreatorConcerns( block );

	block = this.genCreatorUnchanged( block );

	block = this.genCreatorReturn( block );

	creator =
		aFunc( block )
		.Arg(
			null,
			'free strings'
		);


	capsule =
		capsule
		.anAssign(
			aVar( this.reference ).aDot( 'create' ),
			anAssign(
				aVar( 'prototype' ).aDot( 'create' ),
				creator
			)
		);

	return capsule;
};


/*
| Generates the fromJSONCreator's variable list.
*/
Gen.prototype.genFromJSONCreatorVariables =
	function(
		block // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		name,
		varList =
			[ ];

	for( name in this.attributes )
	{
		attr =
			this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		varList.push( attr.v.name );
	}

	varList.push( 'arg' );

	if( this.hasJSON )
	{
		// FIXME cleanup ifs

		if( this.twig )
		{
			varList.push(
				'a',
				'aZ',
				'key',
				'jval',
				'jwig',
				'ranks',
				'twig'
			);
		}
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block =
			block.aVarDec( varList[ a ] );
	}

	return block;
};

/*
| Generates the fromJSONCreator's JSON parser.
*/
Gen.prototype.genFromJSONCreatorParser =
	function(
		block,   // block to append
		jsonList
	)
{
	var
		a,
		aZ,
		arg,
		attr,
		base,
		// block built for cases
		caseBlock,
		name,
		// the switch
		switchExpr;

	switchExpr =
		aSwitch(
			aVar( 'name' )
		)
		.aCase(
			aStringLiteral( 'type' ),
			aBlock( )
			.anIf(
				aDiffers(
					aVar( 'arg' ),
					aStringLiteral( this.name )
				),
				aBlock( )
				.aFail( 'invalid JSON' )
			)
		);

	if( this.twig )
	{
		switchExpr =
			switchExpr
			.aCase(
				aStringLiteral( 'twig' ),
				aBlock( )
				.anAssign(
					aVar( 'jwig' ),
					aVar( 'arg' )
				)
			)
			.aCase(
				aStringLiteral( 'ranks' ),
				aBlock( )
				.anAssign(
					aVar( 'ranks' ),
					aVar( 'arg' )
				)
			);
	}

	for(
		a = 0, aZ = jsonList.length;
		a < aZ;
		a++
	)
	{
		name =
			jsonList[ a ];

		if( name === 'twig' || name === 'ranks' )
		{
			continue;
		}

		attr =
			this.attributes[ name ];

		switch( attr.type )
		{
			case 'Boolean' :
			case 'Integer' :
			case 'Number' :
			case 'String' :

				arg = aVar( 'arg' );

				break;

			default :

				if( attr.unit )
				{
					base = aVar( attr.unit ).aDot( attr.type );
				}
				else
				{
					// FUTURE remove this hack to disable
					// Object.createFromJSON creation
					base =
						attr.type !== 'Object'
						? aVar( attr.type )
						: null;
				}

				if( base )
				{
					arg =
						aCall(
							base.aDot( 'createFromJSON' ),
							aVar( 'arg' )
						);
				}
				else
				{
					// FUTURE remove this hack to disable
					// Object.createFromJSON creation
					arg = aVar( 'arg' );
				}
		}

		caseBlock =
			aBlock( )
			.anAssign( attr.v, arg);

		switchExpr =
			switchExpr
			.aCase(
				aStringLiteral( name ),
				caseBlock
			);
	}

	block =
		block
		.aForIn(
			'name',
			aVar( 'json' ),
			aBlock( )
			.anAssign(
				aVar( 'arg' ),
				aVar( 'json' )
				.aMember(
					aVar( 'name' )
				)
			)
			.Append(
				switchExpr
			)
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
Gen.prototype.genFromJSONCreatorTwigProcessing =
	function(
		block // block to append to
	)
{
	var
		base,
		loop,
		name,
		switchExpr,
		ut;

	switchExpr =
		aSwitch(
			aVar( 'jval' ).aDot( 'type' )
		);

	for(
		var a = 0, aZ = this.twigList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.twigList[ a ];

		ut =
			this.twig[ name ];

		if( ut.unit )
		{
			base =
				aVar( ut.unit ).aDot( ut.type );
		}
		else
		{
			base =
				aVar( ut.type );
		}

		switchExpr =
			switchExpr
			.aCase(
				aStringLiteral( name ),
				aBlock( )
				.anAssign(
					aVar( 'twig' )
					.aMember(
						aVar( 'key' )
					),
					aCall(
						base.aDot( 'createFromJSON' ),
						aVar( 'jval' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			aBlock( )
			.aFail( 'invalid twig type' )
		);

	loop =
		aBlock( )
		.anAssign(
			aVar( 'key' ),
			aVar( 'ranks' )
			.aMember(
				aVar( 'a' )
			)
		)
		.anIf(
			aNot(
				aVar( 'jwig' )
				.aMember(
					aVar( 'key' )
				)
			),
			aBlock( )
			.aFail( 'JSON ranks/twig mismatch' )
		)
		.anAssign(
			aVar( 'jval' ),
			aVar( 'jwig' )
			.aMember(
				aVar( 'key' )
			)
		)
		.Append(
			switchExpr
		);

	block =
		block
		.anAssign(
			aVar( 'twig' ),
			anObjLiteral( )
		)
		.anIf(
			anOr(
				aNot( aVar( 'jwig' ) ),
				aNot( aVar( 'ranks' ) )
			),
			aBlock( )
			.aFail( 'ranks/twig information missing' )
		)
		.aFor(
			// FIXME, put into the commalist call
			aCommaList( )
			.Append(
				anAssign(
					aVar( 'a' ),
					aNumberLiteral( 0 )
				)
			)
			.Append(
				anAssign(
					aVar( 'aZ' ),
					aVar( 'ranks' ).aDot( 'length' )
				)
			),
			aLessThan(
				aVar( 'a' ),
				aVar( 'aZ' )
			),
			aPreIncrement(
				aVar( 'a' )
			),
			loop
		);

	return block;
};

/*
| Generates the fromJSONCreator's return statement
*/
Gen.prototype.genFromJSONCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	call =
		aCall(
			aVar( 'Constructor' )
		);

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				call =
					call.Append( aNull );

				break;

			case 'twigDup' :

				call =
					call.Append( True );

				break;

			case 'ranks' :
			case 'twig' :

				call =
					call.Append(
						aVar( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call =
						call
						.Append( aNull );
				}
				else
				{
					call = call.Append( attr.v );
				}
		}
	}

	return (
		block
		.aReturn(
			aNew( call )
		)
	);
};


/*
| Generates the fromJSONCreator.
*/
Gen.prototype.genFromJSONCreator =
	function(
		capsule // block to append to
	)
{
	var
		a,
		aZ,
		attr,
		// function contents
		funcBlock,
		// all attributes expected from JSON
		name,
		jsonList;

	jsonList =
		[ ];

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( attr.json )
		{
			jsonList.push( name );
		}
	}

	if( this.twig )
	{
		jsonList.push( 'twig', 'ranks' );
	}

	jsonList.sort( );

	capsule =
		capsule.aComment(
			'Creates a new ' + this.name + ' object from JSON.'
		);

	funcBlock =
		this.genFromJSONCreatorVariables(
			aBlock( )
		);

	funcBlock =
		this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock =
		this.genCreatorDefaults( funcBlock, true );

	funcBlock =
		this.genCreatorChecks( funcBlock, false );

	if( this.twig )
	{
		funcBlock =
			this.genFromJSONCreatorTwigProcessing( funcBlock );
	}

	funcBlock =
		this.genFromJSONCreatorReturn( funcBlock );

	capsule =
		capsule
		.anAssign(
			aVar( this.reference ).aDot( 'createFromJSON' ),
			aFunc( funcBlock )
			.Arg(
				'json',
				'the JSON object'
			)
		);

	return capsule;
};


/*
| Generates the node include section.
*/
Gen.prototype.genReflection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.aComment( 'Reflection.' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'reflect' ),
			aStringLiteral( this.name )
		);

	capsule =
		capsule
		.aComment( 'New Reflection.' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'reflex' ),
			aStringLiteral(
				adaptName(
					this.unit,
					this.name
				)
			)
		);

	capsule =
		capsule
		.aComment( 'Name Reflection.' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'reflexName' ),
			aStringLiteral( this.name )
		);

	// TODO remove old reflection
	// TODO there should not be no unit ever.

	return capsule;
};


/*
| Generates the JoobjProto stuff.
*/
Gen.prototype.genJoobjProto =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.aComment( 'Sets values by path.' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'setPath' ),
			aVar( 'JoobjProto' ).aDot( 'setPath' )
		)
		.aComment( 'Gets values by path' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'getPath' ),
			aVar( 'JoobjProto' ).aDot( 'getPath' )
		);

	if( this.twig )
	{
		capsule =
			capsule
			.aComment( 'Returns a twig by rank.' )
			.anAssign(
				aVar( 'prototype' ).aDot( 'atRank' ),
				aVar( 'JoobjProto' ).aDot( 'atRank' )
			)
			.aComment( 'Gets the rank of a key.' )
			.anAssign(
				aVar( 'Constructor' ).aDot( 'prototype' ).aDot( 'rankOf' ),
				aVar( 'JoobjProto' ).aDot( 'rankOf' )
			)
			.aComment( 'Creates a new unique identifier.' )
			.anAssign(
				aVar( 'Constructor' ).aDot( 'prototype' ).aDot( 'newUID' ),
				aVar( 'JoobjProto' ).aDot( 'newUID' )
			);
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
Gen.prototype.genToJSON =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		name,
		olit;

	block =
		aBlock( )
		.aVarDec( 'json' );

	olit =
		anObjLiteral( )
		.Add(
			'type',
			aStringLiteral( this.name )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name =
			this.attrList[ a ];

		attr =
			this.attributes[ name ];

		if( !attr.json )
		{
			continue;
		}

		olit =
			olit
			.Add(
				name,
				This.aDot( attr.assign )
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.Add(
				'ranks',
				This.aDot( 'ranks' )
			)
			.Add(
				'twig',
				This.aDot( 'twig' )
			);
	}

	block =
		block
		.anAssign(
			aVar( 'json' ),
			aCall(
				aVar( 'Object' ).aDot( 'freeze' ),
				olit
			)
		)
		.aReturn(
			aFunc(
				aBlock( )
				.aReturn(
					aVar( 'json' )
				)
			)
		);

	capsule =
		capsule
		.aComment( 'Converts a ' + this.name + ' into JSON.' )
		.aCall(
			aVar( 'jools' ).aDot( 'lazyValue' ),
			aVar( 'Constructor' ).aDot( 'prototype' ),
			aStringLiteral( 'toJSON' ),
			aFunc( block )
		);

	return capsule;
};


/*
| Generates the equals condition for an attribute.
*/
Gen.prototype.genAttributeEquals =
	function(
		name, // attribute name
		le, // this value expression
		re  // other value expression
	)
{
	var
		attr,
		ceq;

	attr = this.attributes[ name ];

	switch( attr.type )
	{
		case 'Boolean' :
		case 'Integer' :
		case 'Mark' : // FIXME
		case 'Number' :
		case 'String' :

			ceq =
				anEquals(
					le,
					re
				);

			break;

		default :

			if( !attr.allowsNull )
			{
				ceq =
					// FIXME, misses equals call
					anEquals( le, re );
			}
			else
			{
				ceq =
					anOr(
						anEquals( le, re ),
						anAnd(
							aDiffers( le, aNull ),
							le.aDot( 'equals' ),
							aCall( le.aDot( 'equals' ), re )
						)
					);
			}
	}

	return ceq;
};


/*
| Generates the equals test.
*/
Gen.prototype.genEquals =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		cond =
			null,
		ceq,
		name;

	switch( this.equals )
	{
		case false :

			return capsule;

		case 'primitive' :

			// FUTURE remove

			return (
				capsule
				.aComment( 'Tests equality of object.' )
				.anAssign(
					aVar( 'Constructor' ).aDot( 'prototype' ).aDot( 'equals' ),
					aFunc(
						aBlock( )
						.aReturn(
							anEquals(
								This,
								aVar( 'obj' )
							)
						)
					)
					.Arg(
						'obj',
						'object to compare to'
					)
				)
			);

		case true :
		case undefined :

			break;

		default :

			throw new Error(
				'invalid equals value'
			);
	}

	capsule =
		capsule
		.aComment( 'Tests equality of object.' );

	block =
		aBlock( )
		.anIf(
			anEquals(
				This,
				aVar( 'obj' )
			),
			aBlock( )
			.aReturn( True )
		)
		.anIf(
			aNot(
				aVar( 'obj' )
			),
			aBlock( )
			.aReturn(
				False
			)
		);

	if( this.twig )
	{
		cond =
			anAnd(
				anEquals(
					This.aDot( 'tree' ),
					aVar( 'obj' ).aDot( 'tree' )
				),
				anEquals(
					This.aDot( 'ranks' ),
					aVar( 'obj' ).aDot( 'ranks' )
				)
			);
	}

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( attr.assign === null )
		{
			continue;
		}

		ceq =
			this.genAttributeEquals(
				name,
				This.aDot( attr.assign ),
				aVar( 'obj' ).aDot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: anAnd( cond, ceq );
	}

	block =
		block
		.aReturn( cond );

	capsule =
		capsule
		.anAssign(
			aVar( 'Constructor' ).aDot( 'prototype' ).aDot( 'equals' ),
			aFunc( block )
			.Arg(
				'obj',
				'object to compare to'
			)
		);

	return capsule;
};


/*
| Generates the alike test(s).
*/
Gen.prototype.genAlike =
	function(
		capsule // block to append to
	)
{
	var
		a, aZ,
		alikeList,
		alikeName,
		attr,
		block,
		ceq,
		cond,
		ignores,
		name;

	alikeList = Object.keys( this.alike );

	alikeList.sort( );

	cond = null;

	for(
		a = 0, aZ = alikeList.length;
		a < aZ;
		a++
	)
	{
		alikeName = alikeList[ a ];

		ignores = this.alike[ alikeName ].ignores;

		capsule = capsule.aComment( 'Tests partial equality.' );

		block =
			aBlock( )
			.anIf(
				anEquals(
					This,
					aVar( 'obj' )
				),
				aBlock( )
				.aReturn( True )
			)
			.anIf(
				aNot( aVar( 'obj' ) ),
				aBlock( )
				.aReturn(
					False
				)
			);

		if( this.twig )
		{
			cond =
				anAnd(
					anEquals(
						This.aDot( 'tree' ),
						aVar( 'obj' ).aDot( 'tree' )
					),
					anEquals(
						This.aDot( 'ranks' ),
						aVar( 'obj' ).aDot( 'ranks' )
					)
				);
		}

		for(
			a = 0, aZ = this.attrList.length;
			a < aZ;
			a++
		)
		{
			name = this.attrList[ a ];

			attr = this.attributes[ name ];

			if(
				attr.assign === null
				||
				ignores[ name ]
			)
			{
				continue;
			}

			ceq =
				this.genAttributeEquals(
					name,
					This.aDot( attr.assign ),
					aVar( 'obj' ).aDot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: anAnd( cond, ceq );
		}

		block =
			block
			.aReturn( cond );

		capsule =
			capsule
			.anAssign(
				aVar( 'Constructor' ).aDot( 'prototype' ).aDot( alikeName ),
				aFunc( block )
				.Arg(
					'obj',
					'object to compare to'
				)
			);
	}

	return capsule;
};


/*
| Generates the export.
*/
Gen.prototype.genNodeExport =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.aComment( 'Node export.' )
		.anIf(
			aVar( 'SERVER' ),
			aBlock( )
			.anAssign(
				aVar( 'module' ).aDot( 'exports' ),
				aVar( this.reference )
			)
		)
	);
};


/*
| Returns the generated export block.
*/
Gen.prototype.genExport =
	function( block )
{
	block = block.aComment( 'Export.' );

	if( this.unit )
	{
		block =
			block
			.aVarDec(
				this.unit,
				anOr(
					aVar( this.unit ),
					anObjLiteral( )
				)
			);
	}
	else
	{
		block =
			block
			.aVarDec(
				this.name
			);
	}

	return block;
};


/*
| Returns the generated preamble.
*/
Gen.prototype.genPreamble =
	function( )
{
	var
		block;

	block = aBlock( );

	block = this.genExport( block );

	block = this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
Gen.prototype.genCapsule =
	function( )
{
	var
		capsule;

	capsule = aBlock( );

	if( this.node )
	{
		capsule = this.genNodeIncludes( capsule );
	}

	capsule = this.genConstructor( capsule );

	if( this.singleton )
	{
		capsule = this.genSingleton( capsule );
	}

	capsule = this.genCreator( capsule );

	if( this.hasJSON )
	{
		capsule =
			this.genFromJSONCreator( capsule );
	}

	capsule = this.genReflection( capsule );

	capsule = this.genJoobjProto( capsule );

	if( this.hasJSON )
	{
		capsule = this.genToJSON( capsule );
	}

	capsule = this.genEquals( capsule );

	if( this.alike )
	{
		capsule = this.genAlike( capsule );
	}

	if( this.node )
	{
		capsule = this.genNodeExport( capsule );
	}

	return capsule;
};


/*
| Generates code from a jools object definition.
*/
Gen.generate =
	function(
		jion // the jion definition
	)
{
	Validator.check( jion );

	var
		file,
		gen;

	gen =
		Gen.create(
			'jion',
				jion
		);

	file =
		aFile( )
		.setHeader(
			'This is an auto generated file.',
			'',
			'DO NOT EDIT!'
		)
		.Preamble(
			gen.genPreamble( )
		)
		.Capsule(
			gen.genCapsule( )
		);

	return file;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports =
		Gen;
}


} )( );
