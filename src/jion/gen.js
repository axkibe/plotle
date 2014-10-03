/*
| Generates jion objects from a jion definition.
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
		id :
			'jion.gen',
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
	aComment =
		require( '../ast/a-comment' ),
	gen =
		require( '../jion/this' )( module ),
	Shorthand =
		require( '../ast/shorthand' ),
	jools =
		require( '../jools/jools' ),
	validator =
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
	astBlock =
		Shorthand.astBlock,
	astCall =
		Shorthand.astCall,
	astCommaList =
		Shorthand.astCommaList,
	aCondition =
		Shorthand.aCondition,
	aDelete =
		Shorthand.aDelete,
	aDiffers =
		Shorthand.aDiffers,
	anEquals =
		Shorthand.anEquals,
	aFalse =
		Shorthand.aFalse( ),
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
	aThis =
		Shorthand.aVar( 'this' ),
	aTrue =
		Shorthand.aTrue( ),
	aTypeof =
		Shorthand.aTypeof,
	anUndefined =
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
| Initializes a generator.
*/
gen.prototype._init =
	function( )
{
	var
		a,
		aZ,
		assign,
		attr,
		attributes,
		attrList,
		attrType,
		attrUnit,
		concerns,
		concernsParts,
		concernsType,
		concernsUnit,
		constructorList,
		defaultValue,
		// sorted init list
		idParts,
		inits,
		jAttr,
		jdv,
		jion,
		ut,
		name,
		subParts,
		// twig id
		twigId,
		// processed twig table for generator use
		twig,
		// twig map to be used (the definition)
		twigDef,
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

	twigDef = null;

	units =
		{
			jion :
				{
					proto :
						true
				}
		};

	this.hasJSON = !!jion.json;

	this.init = jion.init;

	this.node = !!jion.node;

	this.singleton = !!jion.singleton;

	idParts = jion.id.split( '.' );

	this.id = jion.id;

	this.unit = idParts[ 0 ];

	this.name = idParts[ 1 ];

	if( jion.subclass )
	{
		subParts = jion.subclass.split( '.' );

		if( subParts.length >=  2 )
		{
			if( subParts.length > 2 )
			{
				throw new Error(
					'subclass can only have one dot'
				);
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

	for( name in jion.attributes || { } )
	{
		jAttr = jion.attributes[ name ];

		if( jAttr.type.indexOf( '.' ) < 0  )
		{
			switch( jAttr.type )
			{
				case 'Array' :
				case 'Boolean' :
				case 'Integer' :
				case 'Number' :
				case 'Object' :
				case 'String' :

					break;

				default :

					throw new Error(
						'attribute type misses unit: ' + jAttr.type
					);
			}
		}

		if( jAttr.type.indexOf( '.' ) >= 0 )
		{
			attrUnit = jAttr.type.split( '.' )[ 0 ];

			attrType = jAttr.type.split( '.' )[ 1 ];
		}
		else
		{
			attrUnit = undefined;

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

		if( concerns && concerns.type )
		{
			concernsParts = concerns.type.split( '.' );

			if( concernsParts.length > 2 )
			{
				throw new Error(
					'concerns can only have one dot.'
				);
			}
			else if( concernsParts.length === 2 )
			{
				concernsUnit = concernsParts[ 0 ];

				concernsType = concernsParts[ 1 ];
			}
			else
			{
				throw new Error(
					'concerns misses type.'
				);
			}

			if( concernsUnit )
			{
				if( !units[ concernsUnit ] )
				{
					units[ concernsUnit ] = { };
				}

				units[ concernsUnit ][ concernsType ] = true;
			}
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
				defaultValue = anUndefined;
			}
			else if( jdv === false )
			{
				defaultValue = aFalse;
			}
			else if( jdv === true )
			{
				defaultValue = aTrue;
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
					defaultValue === anUndefined,
				assign :
					assign,
				comment :
					jAttr.comment,
				concerns :
					jAttr.concerns
					?
						Object.freeze( {
							unit :
								concernsUnit,
							type :
								concernsType,
							func :
								jAttr.concerns.func,
							args :
								jAttr.concerns.args,
							member :
								jAttr.concerns.member
						} )
					: null,
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

	attrList = Object.keys( attributes ).sort ( );

	this.attrList = Object.freeze( attrList );

	this.attributes = Object.freeze( attributes );

	constructorList.sort( );

	if( jion.twig )
	{
		constructorList.unshift( 'ranks' );

		constructorList.unshift( 'twig' );
	}

	if( jion.ray )
	{
		constructorList.unshift( 'ray' );
	}

	if( jion.init )
	{
		inits = jion.init.slice( ).sort( );

		for(
			a = inits.length - 1;
			a >= 0;
			a--
		)
		{
			name = jion.init[ a ];

			if( attributes[ name ] )
			{
				continue;
			}

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :
				case 'ray' :
				case 'rayDup' :

					constructorList.unshift( name );

					break;

				default :

					throw new Error(
						'invalid init value: ' + name
					);
			}
		}
	}

	this.constructorList = Object.freeze( constructorList );

	if( jion.twig )
	{
		twig = { };

		if( jools.isString( jion.twig ) )
		{
			twigDef = require( '../typemaps/' + jion.twig.substr( 2 ) );
		}
		else
		{
			twigDef = jion.twig;
		}

		for(
			a = 0, aZ = twigDef.length;
			a < aZ;
			a++
		)
		{
			twigId = twigDef[ a ];

			ut = twigId.split( '.' );

			if( ut.length !== 2 )
			{
				throw new Error(
					'invalid twig id: ' + twigId
				);
			}

			if( !units[ ut[ 0 ] ] )
			{
				units[ ut[ 0 ] ] = { };
			}

			units[ ut[ 0 ] ][ ut[ 1 ] ] = true;

			twig[ twigId ] =
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

	if( jion.ray )
	{
		this.ray =
			Object.freeze(
				jion.ray.slice( )
			);
	}

	unitList = Object.keys( units ).sort( );

	this.unitList = Object.freeze( unitList );

	this.units = Object.freeze( units );

	if( twig )
	{
		twigList = Object.keys( twig ).sort( );

		this.twigList = Object.freeze( twigList );
	}

	// FIXME make it a aVar
	this.reference =
		( this.unit === this.name )
		? this.name + 'Obj'
		: this.name;

	this.equals = jion.equals;

	this.alike = jion.alike;
};


/*
| Generates the imports.
*/
gen.prototype.genImports =
	function(
		capsule // block to append to
	)
{
	capsule = capsule.aComment( 'Imports.' );

	capsule =
		capsule
		.aVarDec( 'jion' )
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
gen.prototype.genNodeIncludes =
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
		astBlock( )
		.anAssign(
			aVar( 'jools' ),
			astCall(
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
		unitName = this.unitList[ a ];

		unit = this.units[ this.unitList[ a ] ];

		types = Object.keys( unit );

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
					astCall(
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
gen.prototype.genConstructor =
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

	block = astBlock( );

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
				aThis.aDot( attr.assign ),
				attr.v
			);

		if( !attr.allowsUndefined )
		{
			block = block.append( assign );
		}
		else
		{
			block =
				block
				.anIf(
					aDiffers( attr.v, anUndefined ),
					astBlock( )
					.append( assign )
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.anAssign(
				aThis.aDot( 'twig' ),
				aVar( 'twig' )
			)
			.anAssign(
				aThis.aDot( 'ranks' ),
				aVar( 'ranks' )
			);
	}


	if( this.ray )
	{
		block =
			block
			.anAssign(
				aThis.aDot( 'ray' ),
				aVar( 'ray' )
			);
	}

	// calls the initializer
	if( this.init )
	{
		initCall = astCall( aThis.aDot( '_init' ) );

		for(
			a = 0, aZ = this.init.length;
			a < aZ;
			a++
		)
		{
			name = this.init[ a ];

			switch( name )
			{
				case 'inherit' :
				case 'twigDup' :

					initCall =
						initCall.append(
							aVar( this.init[ a ] )
						);

					continue;
			}

			attr = this.attributes[ name ];

			if( !attr )
			{
				throw new Error(
					'invalid parameter to init: ' + name
				);
			}

			initCall = initCall.append( ( attr.v ) );
		}

		block = block.append( initCall );
	}

	// immutes the new object
	// FIXME use object.freeze and only in checking
	block =
		block
		.astCall(
			aVar( 'jools' ).aDot( 'immute' ),
			aThis
		);

	if( this.twig )
	{
		// FIXME use object.freeze and only in checking
		block =
			block
			.astCall(
				aVar( 'jools' ).aDot( 'immute' ),
				aVar( 'twig' )
			)
			.astCall(
				aVar( 'jools' ).aDot( 'immute' ),
				aVar( 'ranks' )
			);
	}

	if( this.ray )
	{
		block =
			block
			.astCheck(
				astBlock( )
				.astCall(
					aVar( 'Object' ).aDot( 'freeze' ),
					aVar( 'ray' )
				)
			);
	}

	constructor = aFunc( block );

	for(
		a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				// TODO Arg --> appendArg
				constructor =
					constructor.Arg( 'inherit', 'inheritance' );

				break;

			case 'ranks' :

				constructor =
					constructor.Arg( 'ranks', 'twig ranks' );

				break;

			case 'ray' :

				constructor =
					constructor.Arg( 'ray', 'ray' );

				break;

			case 'rayDup' :

				constructor =
					constructor.Arg(
						'rayDup',
						'true if ray is already been duplicated'
					);

				break;

			case 'twig' :

				constructor =
					constructor.Arg( 'twig', 'twig' );

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
			.astCall(
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
		.add(
			'prototype',
			aVar( 'prototype' )
		);

	capsule =
		capsule.aVarDec(
			this.reference,
			anAssign(
				aVar( this.unit ).aDot( this.name ),
				jionObj
			)
		);

	return capsule;
};



/*
| Generates the singleton decleration.
*/
gen.prototype.genSingleton =
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
gen.prototype.genCreatorVariables =
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

	if( this.ray )
	{
		varList.push(
			'ray',
			'rayDup'
		);
	}

	varList.sort( );

	for(
		a = 0, aZ = varList.length;
		a < aZ;
		a++
	)
	{
		block = block.aVarDec( varList[ a ] );
	}

	return block;
};


/*
| Generates the creators inheritance receiver.
*/
gen.prototype.genCreatorInheritanceReceiver =
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
			astBlock( )
			.anAssign(
				aVar( 'inherit' ),
				aThis
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
				aFalse
			);
	}

	if( this.ray )
	{
		receiver =
			receiver
			.anAssign(
				aVar( 'ray' ),
				aVar( 'inherit' ).aDot( 'ray' )
			)
			.anAssign(
				aVar( 'rayDup' ),
				aFalse
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

		if( attr.assign === null )
		{
			continue;
		}

		receiver =
			receiver
			.anAssign(
				attr.v,
				aThis.aDot ( attr.assign )
			);
	}

	thisCheck =
		anIf(
			aDiffers(
				aThis,
				aVar( this.reference )
			),
			receiver
		);

	if( this.twig )
	{
		thisCheck =
			thisCheck
			.Elsewise( // FIXME rename Elsewise
				astBlock( )
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
					aTrue
				)
			);
	}

	if( this.ray )
	{
		thisCheck =
			thisCheck
			.Elsewise(
				astBlock( )
				.anAssign(
					aVar( 'ray' ),
					anArrayLiteral( )
				)
				.anAssign(
					aVar( 'rayDup' ),
					aTrue
				)
			);
	}


	return block.append( thisCheck );
};


/*
| Generates the creators free strings parser.
*/
gen.prototype.genCreatorFreeStringsParser =
	function(
		block // block to append to
	)
{
	var
		attr,
		loop,
		name,
		rayDupCheck,
		switchExpr,
		twigDupCheck;

	if(
		!this.twig
		&&
		!this.ray
		&&
		this.attrList.length === 0
	)
	{
		// no free strings parses needed
		// FIXME check for no arguments
		return block;
	}

	loop =
		astBlock( )
		.aVarDec(
			'arg',
			aVar( 'arguments' ).aMember(
				aPlus(
					aVar( 'a' ),
					aNumberLiteral( 1 )
				)
			)
		);

	switchExpr =
		aSwitch(
			aVar( 'arguments' ).aMember( aVar( 'a' ) )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( name  ),
				astBlock( )
				.anIf(
					aDiffers(
						aVar( 'arg' ),
						anUndefined
					),
					astBlock( )
					.anAssign(
						attr.v,
						aVar( 'arg' )
					)
				)
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			anIf(
				aNot( aVar( 'twigDup' ) ),
				astBlock( )
				.anAssign(
					aVar( 'twig' ),
					astCall(
						aVar( 'jools' ).aDot( 'copy' ),
						aVar( 'twig' )
					)
				)
				.anAssign(
					aVar( 'ranks' ),
					astCall(
						aVar( 'ranks' ).aDot( 'slice' )
					)
				)
				.anAssign(
					aVar( 'twigDup' ),
					aTrue
				)
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( 'twig:add' ),
				astBlock( )
				.append( twigDupCheck )
				.anAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.anAssign(
					aVar( 'arg' ),
					aVar( 'arguments' ).aMember(
						aPlus(
							aPreIncrement( aVar( 'a' ) ),
							aNumberLiteral( 1 )
						)
					)
				)
				.anIf(
					aDiffers(
						aVar( 'twig' ).aMember( aVar( 'key' ) ),
						anUndefined
					),
					astBlock( )
					.aFail(
						/*
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" already in use' )
						)
						*/
					)
				)
				.anAssign(
					aVar( 'twig' ).aMember( aVar( 'key' ) ),
					aVar( 'arg' )
				)
				.astCall(
					aVar( 'ranks' ).aDot( 'push' ),
					aVar( 'key' )
				)
			)
			.astCase(
				aStringLiteral( 'twig:set' ),
				astBlock( )
				.append( twigDupCheck )
				.anAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.anAssign(
					aVar( 'arg' ),
					aVar( 'arguments' ).aMember(
						aPlus(
							aPreIncrement( aVar( 'a' ) ),
							aNumberLiteral( 1 )
						)
					)
				)
				.anIf(
					anEquals(
						aVar( 'twig' ).aMember( aVar( 'key' ) ),
						anUndefined
					),
					astBlock( )
					.aFail(
						/*
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" not in use' )
						)
						*/
					)
				)
				.anAssign(
					aVar( 'twig' ).aMember( aVar( 'key' ) ),
					aVar( 'arg' )
				)
			)
			.astCase(
				aStringLiteral( 'twig:insert' ),
				astBlock( )
				.append( twigDupCheck )
				.anAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.anAssign(
					aVar( 'rank' ),
					aVar( 'arguments' ).aMember(
						aPlus(
							aVar( 'a' ),
							aNumberLiteral( 2 )
						)
					)
				)
				.anAssign(
					aVar( 'arg' ),
					aVar( 'arguments' ).aMember(
						aPlus(
							aVar( 'a' ),
							aNumberLiteral( 3 )
						)
					)
				)
				.append(
					aPlusAssign(
						aVar( 'a' ),
						aNumberLiteral( 2 )
					)
				)
				.anIf(
					aDiffers(
						aVar( 'twig' ).aMember( aVar( 'key' ) ),
						anUndefined
					),
					astBlock( )
					.aFail(
						/*
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" already in use' )
						)
						*/
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
					astBlock( )
					.aFail(
						//aStringLiteral( 'invalid rank' )
					)
				)
				.anAssign(
					aVar( 'twig' ).aMember( aVar( 'key' ) ),
					aVar( 'arg' )
				)
				.append(
					astCall(
						aVar( 'ranks' ).aDot( 'splice' ),
						aVar( 'rank' ),
						aNumberLiteral( 0 ),
						aVar( 'key' )
					)
				)
			)
			.astCase(
				aStringLiteral( 'twig:remove' ),
				astBlock( )
				.append( twigDupCheck )
				.anIf(
					anEquals(
						aVar( 'twig' ).aMember( aVar( 'arg' ) ),
						anUndefined
					),
					astBlock( )
					.aFail(
						/*
						aPlus(
							aStringLiteral( 'key "' ),
							aVar( 'arg' ),
							aStringLiteral( '" not in use' )
						)
						*/
					)
				)
				.append(
					aDelete(
						aVar( 'twig' ).aMember( aVar( 'arg' ) )
					)
				)
				.append(
					astCall(
						aVar( 'ranks' ).aDot( 'splice' ),
						astCall(
							aVar( 'ranks' ).aDot( 'indexOf' ),
							aVar( 'arg' )
						),
						aNumberLiteral( 1 )
					)
				)
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			anIf(
				aNot( aVar( 'rayDup' ) ),
				astBlock( )
				.anAssign(
					aVar( 'ray' ),
					astCall(
						aVar( 'ray' ).aDot( 'slice' )
					)
				)
				.anAssign(
					aVar( 'rayDup' ),
					aTrue
				)
			);

		// FIXME make a sub-function to add the twigDup stuff
		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( 'ray:init' ),
				astBlock( )
				.anAssign( aVar( 'ray' ), aVar( 'arg' ) )
				.anAssign( aVar( 'rayDup' ), aFalse )
			)
			.astCase(
				aStringLiteral( 'ray:append' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					aVar( 'ray' ).aDot( 'push' ),
					aVar( 'arg' )
				)
			)
			.astCase(
				aStringLiteral( 'ray:insert' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					aVar( 'ray' ).aDot( 'splice' ),
					aVar( 'arg' ),
					aNumberLiteral( 0 ),
					aVar( 'arguments' ).aMember(
						aPlus(
							aPreIncrement( aVar( 'a' ) ),
							aNumberLiteral( 1 )
						)
					)
				)
			)
			.astCase(
				aStringLiteral( 'ray:remove' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					aVar( 'ray' ).aDot( 'splice' ),
					aVar( 'arg' ),
					aNumberLiteral( 1 )
				)
			)
			.astCase(
				aStringLiteral( 'ray:set' ),
				astBlock( )
				.append( rayDupCheck )
				.anAssign(
					aVar( 'ray' ).aMember( aVar( 'arg' ) ),
					aVar( 'arguments' ).aMember(
						aPlus(
							aPreIncrement( aVar( 'a' ) ),
							aNumberLiteral( 1 )
						)
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			astBlock( )
			.astCheck(
				astBlock( )
				//.aFail( 'invalid argument' )
				.aFail( )
			)
		);

	loop = loop.append( switchExpr );

	block =
		block
		.aFor(
			aVList( )
			.aVarDec( 'a', aNumberLiteral( 0 ) )
			.aVarDec( 'aZ', aVar( 'arguments' ).aDot( 'length' ) ),
			aLessThan( aVar( 'a' ), aVar( 'aZ' ) ),
			aPlusAssign( aVar( 'a' ), aNumberLiteral( 2 ) ),
			loop
		);

	return block;
};


/*
| Generates the creators default values
*/
gen.prototype.genCreatorDefaults =
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
					anEquals( attr.v, anUndefined ),
					astBlock( )
					.anAssign( attr.v, attr.defaultValue )
				);
		}
	}

	return block;
};


/*
| Generates the creators checks.
*/
gen.prototype.genCreatorChecks =
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
			astBlock( );
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
					anEquals( attr.v, anUndefined ),
					astBlock( )
					//.aFail( 'undefined attribute ' + name )
					.aFail( )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.anIf(
					anEquals( attr.v, aNull ),
					astBlock( )
					//.aFail( 'attribute ' + name + ' must not be null.' )
					.aFail( )
				);
		}

		switch( attr.type )
		{
			case 'Array' :
			case 'Function' :
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
				aDiffers( attr.v, anUndefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				anAnd(
					aDiffers( attr.v, aNull ),
					aDiffers( attr.v, anUndefined )
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
							astCall(
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
						attr.v.aDot( 'reflectName' ), // FIXME
						aStringLiteral( attr.type )
					);

				break;
		}

		tfail =
			astBlock( )
			//.aFail( 'type mismatch' );
			.aFail( );

		if( cond )
		{
			check =
				check.anIf(
					cond,
					astBlock( )
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
		block = block.astCheck( check );
	}

	return block;
};


/*
| Generates the creators concerns.
|
| 'func' is a call to a function
| 'member' is an access to an attribute ( without call )
*/
gen.prototype.genCreatorConcerns =
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
					astCall(
						aVar( unit ).aDot( type ).aDot( func )
					);
			}
			else
			{
				cExpr =
					astCall( aVar( func ) );
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

				cExpr = cExpr.append( bAttr.v );
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
							aDiffers( attr.v, anUndefined ),
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
					astCall(
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

					cExpr = cExpr.append( bAttr.v );
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
gen.prototype.genCreatorUnchanged =
	function(
		block // block to append to
	)
{
	var
		attr,
		ceq,
		cond,
		equalsCall,
		name;

	cond = aVar( 'inherit' );

	if( this.twig )
	{
		cond =
			anAnd(
				cond,
				aNot( aVar( 'twigDup' ) )
			);
	}

	if( this.ray )
	{
		cond =
			anAnd(
				cond,
				aNot( aVar( 'rayDup' ) )
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
			cond =
				anAnd(
					cond,
					anEquals( attr.v, aNull )
				);

			continue;
		}

		// FIXME use genAttributeEquals

		switch( attr.type )
		{
			case 'Array' : // FIXME
			case 'Boolean' :
			case 'Function' :
			case 'Integer' :
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

				equalsCall =
					astCall(
						attr.v.aDot( 'equals' ),
						aVar( 'inherit' ).aDot( attr.assign )
					);

				if( attr.allowsNull && attr.allowsUndefined )
				{
					throw new Error(
						'cannot have allowsNull and allowsUndefined'
					);
				}

				if( attr.allowsNull )
				{
					ceq =
						anOr(
							anEquals(
								attr.v,
								aVar( 'inherit' ).aDot( attr.assign )
							),
							anAnd(
								attr.v,
								equalsCall
							)
						);
				}
				else if( attr.allowsUndefined )
				{
					ceq =
						anOr(
							anEquals(
								attr.v,
								aVar( 'inherit' ).aDot( attr.assign )
							),
							anAnd(
								attr.v,
								equalsCall
							)
						);
				}
				else
				{
					ceq = equalsCall;
				}
		}

		cond = anAnd( cond, ceq );
	}

	block =
		block.anIf(
			cond,
			astBlock( )
			.aReturn(
				aVar( 'inherit' )
			)
		);

	return block;
};


/*
| Generates the creators return statement
*/
gen.prototype.genCreatorReturn =
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
				astBlock( )
				.anAssign(
					aVar( '_singleton' ),
					aNew(
						astCall(
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
		astCall(
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
			case 'ray' :
			case 'rayDup' :

				call = call.append( aVar( name ) );

				break;

			default :

				attr = this.attributes[ name ];

				call = call.append( attr.v );
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
gen.prototype.genCreator =
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

	block = astBlock( );

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
gen.prototype.genFromJSONCreatorVariables =
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
gen.prototype.genFromJSONCreatorParser =
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
		.astCase(
			aStringLiteral( 'type' ),
			astBlock( )
			.anIf(
				aDiffers(
					aVar( 'arg' ),
					aStringLiteral( this.id )
				),
				astBlock( )
				// .aFail( 'invalid JSON' )
				.aFail( )
			)
		);

	if( this.twig )
	{
		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( 'twig' ),
				astBlock( )
				.anAssign(
					aVar( 'jwig' ),
					aVar( 'arg' )
				)
			)
			.astCase(
				aStringLiteral( 'ranks' ),
				astBlock( )
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
		name = jsonList[ a ];

		if( name === 'twig' || name === 'ranks' )
		{
			continue;
		}

		attr = this.attributes[ name ];

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
					// THIS code should not happen in future anyway.
					base =
						attr.type !== 'Object'
						? aVar( attr.type )
						: null;
				}

				if( base )
				{
					arg =
						astCall(
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
			astBlock( )
			.anAssign( attr.v, arg );

		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( attr.name ),
				caseBlock
			);
	}

	block =
		block
		.aForIn(
			'name',
			aVar( 'json' ),
			astBlock( )
			.anAssign(
				aVar( 'arg' ),
				aVar( 'json' ).aMember( aVar( 'name' ) )
			)
			.append(
				switchExpr
			)
		);

	return block;
};


/*
| Generates the fromJSONCreator's twig processing.
*/
gen.prototype.genFromJSONCreatorTwigProcessing =
	function(
		block // block to append to
	)
{
	var
		base,
		loop,
		switchExpr,
		twigId,
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
		twigId = this.twigList[ a ];

		ut = this.twig[ twigId ];

		base = aVar( ut.unit ).aDot( ut.type );

		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( twigId ),
				astBlock( )
				.anAssign(
					aVar( 'twig' ).aMember( aVar( 'key' ) ),
					astCall(
						base.aDot( 'createFromJSON' ),
						aVar( 'jval' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			astBlock( )
			//.aFail( 'invalid twig type' )
			.aFail( )
		);

	loop =
		astBlock( )
		.anAssign(
			aVar( 'key' ),
			aVar( 'ranks' ).aMember( aVar( 'a' ) )
		)
		.anIf(
			aNot(
				aVar( 'jwig' ).aMember( aVar( 'key' ) )
			),
			astBlock( )
			//.aFail( )
			.aFail( 'JSON ranks/twig mismatch' )
		)
		.anAssign(
			aVar( 'jval' ),
			aVar( 'jwig' ).aMember( aVar( 'key' ) )
		)
		.append( switchExpr );

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
			astBlock( )
			//.aFail( 'ranks/twig information missing' )
			.aFail( )
		)
		.aFor(
			// FIXME, put into the commalist call
			astCommaList( )
			.append(
				anAssign(
					aVar( 'a' ),
					aNumberLiteral( 0 )
				)
			)
			.append(
				anAssign(
					aVar( 'aZ' ),
					aVar( 'ranks' ).aDot( 'length' )
				)
			),
			aLessThan( aVar( 'a' ), aVar( 'aZ' ) ),
			aPreIncrement( aVar( 'a' ) ),
			loop
		);

	return block;
};

/*
| Generates the fromJSONCreator's return statement
*/
gen.prototype.genFromJSONCreatorReturn =
	function(
		block // block to append to
	)
{
	var
		attr,
		call,
		name;

	call = astCall( aVar( 'Constructor' ) );

	for(
		var a = 0, aZ = this.constructorList.length;
		a < aZ;
		a++
	)
	{
		name = this.constructorList[ a ];

		switch( name )
		{
			case 'inherit' :

				call = call.append( aNull );

				break;

			case 'rayDup' :
			case 'twigDup' :

				call = call.append( aTrue );

				break;

			case 'ranks' :
			case 'ray' :
			case 'twig' :

				call =
					call.append(
						aVar( name )
					);

				break;

			default :

				attr =
					this.attributes[ name ];

				if( attr.assign === null )
				{
					call = call.append( aNull );
				}
				else
				{
					call = call.append( attr.v );
				}
		}
	}

	return (
		block.aReturn( aNew( call ) )
	);
};


/*
| Generates the fromJSONCreator.
*/
gen.prototype.genFromJSONCreator =
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

	jsonList = [ ];

	for(
		a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

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
			astBlock( )
		);

	funcBlock = this.genFromJSONCreatorParser( funcBlock, jsonList );

	funcBlock = this.genCreatorDefaults( funcBlock, true );

	funcBlock = this.genCreatorChecks( funcBlock, false );

	if( this.twig )
	{
		funcBlock = this.genFromJSONCreatorTwigProcessing( funcBlock );
	}

	funcBlock = this.genFromJSONCreatorReturn( funcBlock );

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
gen.prototype.genReflection =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.aComment( 'Reflection.' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'reflect' ),
			aStringLiteral( this.id )
		);

	capsule =
		capsule
		.aComment( 'Name Reflection.' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'reflectName' ),
			aStringLiteral( this.name )
		);

	return capsule;
};


/*
| Generates the jionProto stuff.
*/
gen.prototype.genJionProto =
	function(
		capsule // block to append to
	)
{
	capsule =
		capsule
		.aComment( 'Sets values by path.' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'setPath' ),
			aVar( 'jion' ).aDot( 'proto' ).aDot( 'setPath' )
		)
		.aComment( 'Gets values by path' )
		.anAssign(
			aVar( 'prototype' ).aDot( 'getPath' ),
			aVar( 'jion' ).aDot( 'proto' ).aDot( 'getPath' )
		);

	if( this.twig )
	{
		capsule =
			capsule
			.aComment( 'Returns a twig by rank.' )
			.anAssign(
				aVar( 'prototype' ).aDot( 'atRank' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'atRank' )
			)
			.aComment( 'Gets the rank of a key.' )
			.anAssign(
				aVar( 'Constructor' ).aDot( 'prototype' ).aDot( 'rankOf' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'rankOf' )
			)
			.aComment( 'Creates a new unique identifier.' )
			.anAssign(
				aVar( 'Constructor' ).aDot( 'prototype' ).aDot( 'newUID' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'newUID' )
			);
	}

	if( this.ray )
	{
		capsule =
			capsule
			.aComment( 'Appends an entry to the ray.' )
			.anAssign(
				aVar( 'prototype' ).aDot( 'append' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'rayAppend' )
			)
			.aComment(
				'Returns the length of the ray.'
			)
			.astCall(
				aVar( 'jools' ).aDot( 'lazyValue' ),
				aVar( 'prototype' ),
				aStringLiteral( 'length' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'rayLength' )
			)
			.aComment(
				'Gets one entry from the ray.'
			)
			.anAssign(
				aVar( 'prototype' ).aDot( 'get' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'rayGet' )
			)
			.aComment( 'Returns a jion with one entry inserted to the ray.' )
			.anAssign(
				aVar( 'prototype' ).aDot( 'insert' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'rayInsert' )
			)
			.aComment(
				'Returns the jion with one entry of the ray set.'
			)
			.anAssign(
				aVar( 'prototype' ).aDot( 'set' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'raySet' )
			)
			.aComment( 'Returns a jion with one entry from the ray removed.' )
			.anAssign(
				aVar( 'prototype' ).aDot( 'remove' ),
				aVar( 'jion' ).aDot( 'proto' ).aDot( 'rayRemove' )
			);
	}

	return capsule;
};


/*
| Generates the toJSON converter.
*/
gen.prototype.genToJSON =
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
		astBlock( )
		.aVarDec( 'json' );

	olit =
		anObjLiteral( )
		.add(
			'type',
			aStringLiteral( this.id )
		);

	for(
		var a = 0, aZ = this.attrList.length;
		a < aZ;
		a++
	)
	{
		name = this.attrList[ a ];

		attr = this.attributes[ name ];

		if( !attr.json )
		{
			continue;
		}

		olit =
			olit
			.add(
				name,
				aThis.aDot( attr.assign )
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.add(
				'ranks',
				aThis.aDot( 'ranks' )
			)
			.add(
				'twig',
				aThis.aDot( 'twig' )
			);
	}

	block =
		block
		.anAssign(
			aVar( 'json' ),
			astCall(
				aVar( 'Object' ).aDot( 'freeze' ),
				olit
			)
		)
		.aReturn(
			aFunc(
				astBlock( )
				.aReturn(
					aVar( 'json' )
				)
			)
		);

	capsule =
		capsule
		.aComment( 'Converts a ' + this.name + ' into JSON.' )
		.astCall(
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
gen.prototype.genAttributeEquals =
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
		case 'Number' :
		case 'Object' :
		case 'String' :

			ceq =
				anEquals(
					le,
					re
				);

			break;

		default :


			if( attr.allowNull && attr.allowsUndefined )
			{
				throw new Error(
					'cannot have allowsNull and allowsUndefined'
				);
			}

			if( attr.allowsNull)
			{
				ceq =
					anOr(
						anEquals( le, re ),
						anAnd(
							aDiffers( le, aNull ),
							astCall( le.aDot( 'equals' ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					anOr(
						anEquals( le, re ),
						anAnd(
							aDiffers( le, anUndefined ),
							astCall( le.aDot( 'equals' ), re )
						)
					);
			}
			else
			{
				ceq = astCall( le.aDot( 'equals' ), re );
			}
	}

	return ceq;
};


/*
| Generates the equals test.
*/
gen.prototype.genEquals =
	function(
		capsule // block to append to
	)
{
	var
		attr,
		block,
		cond,
		ceq,
		name,
		twigTest,
		twigTestLoopBody,
		vA,
		vKey;


	cond = null;

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
						astBlock( )
						.aReturn(
							anEquals(
								aThis,
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

	block = astBlock( );

	if( this.twig )
	{
		block =
			block
			.aVarDec( 'a' )
			.aVarDec( 'aZ' )
			.aVarDec( 'key' );
	}

	block =
		block
		.anIf(
			anEquals(
				aThis,
				aVar( 'obj' )
			),
			astBlock( )
			.aReturn( aTrue )
		)
		.anIf(
			aNot(
				aVar( 'obj' )
			),
			astBlock( ).aReturn( aFalse )
		);

	// XXX

	if( this.twig )
	{
		vA = aVar( 'a' );

		vKey = aVar( 'key' );

		twigTestLoopBody =
			astBlock( )
			.anAssign(
				vKey,
				aThis.aDot( 'ranks' ).aMember( vA )
			)
			.anIf(
				anOr(
					aDiffers(
						aVar( 'key' ),
						aVar( 'obj' ).aDot( 'ranks' ).aMember( vA )
					),
					astCall(
						aCondition(
							aThis.aDot( 'twig' ).aMember( vKey ).aDot( 'equals' ),
							aNot(
								astCall(
									aThis
									.aDot( 'twig' )
									.aMember( vKey )
									.aDot( 'equals' ),

									aVar( 'obj' )
									.aDot( 'twig' )
									.aMember( vKey )
								)
							),
							aDiffers(
								aThis.aDot( 'twig' ).aMember( vKey ),
								aVar( 'obj' ).aDot( 'twig' ).aMember( vKey )
							)
						)
					)
				),
				astBlock( ).aReturn( aFalse )
			);

		twigTest =
			astBlock( )
			.anIf(
				aDiffers(
					aThis.aDot( 'ranks' ).aDot( 'length' ),
					aVar( 'obj' ).aDot( 'ranks' ).aDot( 'length' )
				),
				astBlock( ).aReturn( aFalse )
			)
			.aFor(
				astCommaList( ) // FIXME add anAssign to astCommaList
				.append(
					anAssign( aVar( 'a' ), aNumberLiteral( 0 ) )
				)
				.append(
					anAssign( aVar( 'aZ' ), aThis.aDot( 'ranks' ).aDot( 'length' ) )
				),
				aLessThan( aVar( 'a' ), aVar( 'aZ' ) ),
				aPreIncrement( aVar( 'a' ) ),
				twigTestLoopBody
			);

		block =
			block
			.anIf(
				anOr(
					aDiffers(
						aThis.aDot( 'tree' ),
						aVar( 'obj' ).aDot( 'tree' )
					),
					aDiffers(
						aThis.aDot( 'ranks' ),
						aVar( 'obj' ).aDot( 'ranks' )
					)
				),
				twigTest
			);
	}

	// FIXME this.ray!

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
				aThis.aDot( attr.assign ),
				aVar( 'obj' ).aDot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: anAnd( cond, ceq );
	}

	if( cond )
	{
		block = block.aReturn( cond );
	}
	else
	{
		block = block.aReturn( aTrue );
	}

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
gen.prototype.genAlike =
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
			astBlock( )
			.anIf(
				anEquals(
					aThis,
					aVar( 'obj' )
				),
				astBlock( )
				.aReturn( aTrue )
			)
			.anIf(
				aNot( aVar( 'obj' ) ),
				astBlock( )
				.aReturn( aFalse )
			);

		if( this.twig )
		{
			// FIXME same test as in equals
			cond =
				anAnd(
					anEquals(
						aThis.aDot( 'tree' ),
						aVar( 'obj' ).aDot( 'tree' )
					),
					anEquals(
						aThis.aDot( 'ranks' ),
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
					aThis.aDot( attr.assign ),
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
gen.prototype.genNodeExport =
	function(
		capsule // block to append to
	)
{
	return (
		capsule
		.aComment( 'Node export.' )
		.anIf(
			aVar( 'SERVER' ),
			astBlock( )
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
gen.prototype.genExport =
	function( block )
{
	block = block.aComment( 'Export.' );

	block =
		block
		.aVarDec(
			this.unit,
			anOr(
				aVar( this.unit ),
				anObjLiteral( )
			)
		);

	return block;
};


/*
| Returns the generated preamble.
*/
gen.prototype.genPreamble =
	function( )
{
	var
		block;

	block = astBlock( );

	block = this.genExport( block );

	block = this.genImports( block );

	return block;
};


/*
| Returns the generated capsule block.
*/
gen.prototype.genCapsule =
	function( )
{
	var
		capsule;

	capsule = astBlock( );

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

	capsule = this.genJionProto( capsule );

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
gen.generate =
	function(
		jion, // the jion definition
		skim
	)
{
	var
		file,
		gi;

	validator.check( jion );

	gi =
		gen.create(
			'jion', jion
		);

	if( skim )
	{
		file =
			aFile( )
			.create(
				'jionID',
					gi.id,
				'hasJSON',
					gi.hasJSON
			);

	}
	else
	{
		file =
			aFile( )
			.create(
				'header',
					aComment.create(
						'content',
							[
								'This is an auto generated file.',
								'',
								'DO NOT EDIT!'
							]
					),
				'preamble',
					gi.genPreamble( ),
				'capsule',
					gi.genCapsule( ),
				'jionID',
					gi.id,
				'hasJSON',
					gi.hasJSON
			);
	}

	return file;
};


/*
| Node export.
*/
if( SERVER )
{
	module.exports = gen;
}


} )( );
