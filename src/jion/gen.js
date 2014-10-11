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
	// FIXME this should a short hand as well
	astComment =
		require( '../ast/ast-comment' ),
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
	astAnd =
		Shorthand.astAnd,
	astArrayLiteral =
		Shorthand.astArrayLiteral,
	astAssign =
		Shorthand.astAssign,
	astBlock =
		Shorthand.astBlock,
	astCall =
		Shorthand.astCall,
	astCommaList =
		Shorthand.astCommaList,
	astCondition =
		Shorthand.astCondition,
	astDelete =
		Shorthand.astDelete,
	astDiffers =
		Shorthand.astDiffers,
	astEquals =
		Shorthand.astEquals,
	aFalse =
		Shorthand.aFalse( ),
	astFile =
		Shorthand.astFile,
	astFunc =
		Shorthand.astFunc,
	astGreaterThan =
		Shorthand.astGreaterThan,
	astIf =
		Shorthand.astIf,
	astInstanceof =
		Shorthand.astInstanceof,
	astLessThan =
		Shorthand.astLessThan,
	astNew =
		Shorthand.astNew,
	astNot =
		Shorthand.astNot,
	astNull =
		Shorthand.astNull( ),
	astNumberLiteral =
		Shorthand.astNumberLiteral,
	astObjLiteral =
		Shorthand.astObjLiteral,
	astOr =
		Shorthand.astOr,
	astPlus =
		Shorthand.astPlus,
	astPlusAssign =
		Shorthand.astPlusAssign,
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
				.astDot( subParts[ 1 ] );
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
				defaultValue = astNull;
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
				defaultValue = astNumberLiteral( jAttr.defaultValue );
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
					defaultValue === astNull,
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
	capsule = capsule.astComment( 'Imports.' );

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

	capsule = capsule.astComment( 'Node includes.' );

	block =
		astBlock( )
		.astAssign(
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
			.astAssign(
				aVar( this.unitList[ a ] ),
				astObjLiteral( )
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
				.astAssign(
					aVar( unitName ).astDot( typeName ),
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
		capsule.astIf(
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

	capsule = capsule.astComment( 'Constructor.' );

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
			astAssign(
				aThis.astDot( attr.assign ),
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
				.astIf(
					astDiffers( attr.v, anUndefined ),
					astBlock( )
					.append( assign )
				);
		}
	}

	if( this.twig )
	{
		block =
			block
			.astAssign(
				aThis.astDot( 'twig' ),
				aVar( 'twig' )
			)
			.astAssign(
				aThis.astDot( 'ranks' ),
				aVar( 'ranks' )
			);
	}


	if( this.ray )
	{
		block =
			block
			.astAssign(
				aThis.astDot( 'ray' ),
				aVar( 'ray' )
			);
	}

	// calls the initializer
	if( this.init )
	{
		initCall = astCall( aThis.astDot( '_init' ) );

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
			aVar( 'jools' ).astDot( 'immute' ),
			aThis
		);

	if( this.twig )
	{
		// FIXME use object.freeze and only in checking
		block =
			block
			.astCall(
				aVar( 'jools' ).astDot( 'immute' ),
				aVar( 'twig' )
			)
			.astCall(
				aVar( 'jools' ).astDot( 'immute' ),
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
					aVar( 'Object' ).astDot( 'freeze' ),
					aVar( 'ray' )
				)
			);
	}

	constructor = astFunc( block );

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
			.astComment( 'Subclass.' )
			.astCall(
				aVar( 'jools' ).astDot( 'subclass' ),
				aVar( 'Constructor' ),
				this.subclass
			);
	}

	// prototype shortcut
	capsule =
		capsule
		.astComment( 'Prototype shortcut' )
		.aVarDec(
			'prototype',
			aVar( 'Constructor' ).astDot( 'prototype' )
		);

	// the exported object
	capsule = capsule.astComment( 'Jion.' );

	jionObj =
		astObjLiteral( )
		.add(
			'prototype',
			aVar( 'prototype' )
		);

	capsule =
		capsule.aVarDec(
			this.reference,
			astAssign(
				aVar( this.unit ).astDot( this.name ),
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
		.astComment( 'Singleton' )
		.aVarDec(
			'_singleton',
			astNull
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
			.astAssign(
				aVar( 'inherit' ),
				aThis
			);

	if( this.twig )
	{
		receiver =
			receiver
			.astAssign(
				aVar( 'twig' ),
				aVar( 'inherit' ).astDot( 'twig' )
			)
			.astAssign(
				aVar( 'ranks' ),
				aVar( 'inherit' ).astDot( 'ranks' )
			)
			.astAssign(
				aVar( 'twigDup' ),
				aFalse
			);
	}

	if( this.ray )
	{
		receiver =
			receiver
			.astAssign(
				aVar( 'ray' ),
				aVar( 'inherit' ).astDot( 'ray' )
			)
			.astAssign(
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
			.astAssign(
				attr.v,
				aThis.astDot ( attr.assign )
			);
	}

	thisCheck =
		astIf(
			astDiffers(
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
				.astAssign(
					aVar( 'twig' ),
					astObjLiteral( )
				)
				.astAssign(
					aVar( 'ranks' ),
					astArrayLiteral( )
				)
				.astAssign(
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
				.astAssign(
					aVar( 'ray' ),
					astArrayLiteral( )
				)
				.astAssign(
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
			aVar( 'arguments' ).astMember(
				astPlus(
					aVar( 'a' ),
					astNumberLiteral( 1 )
				)
			)
		);

	switchExpr =
		aSwitch(
			aVar( 'arguments' ).astMember( aVar( 'a' ) )
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
				.astIf(
					astDiffers(
						aVar( 'arg' ),
						anUndefined
					),
					astBlock( )
					.astAssign(
						attr.v,
						aVar( 'arg' )
					)
				)
			);
	}

	if( this.twig )
	{
		twigDupCheck =
			astIf(
				astNot( aVar( 'twigDup' ) ),
				astBlock( )
				.astAssign(
					aVar( 'twig' ),
					astCall(
						aVar( 'jools' ).astDot( 'copy' ),
						aVar( 'twig' )
					)
				)
				.astAssign(
					aVar( 'ranks' ),
					astCall(
						aVar( 'ranks' ).astDot( 'slice' )
					)
				)
				.astAssign(
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
				.astAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.astAssign(
					aVar( 'arg' ),
					aVar( 'arguments' ).astMember(
						astPlus(
							aPreIncrement( aVar( 'a' ) ),
							astNumberLiteral( 1 )
						)
					)
				)
				.astIf(
					astDiffers(
						aVar( 'twig' ).astMember( aVar( 'key' ) ),
						anUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" already in use' )
						)
						*/
					)
				)
				.astAssign(
					aVar( 'twig' ).astMember( aVar( 'key' ) ),
					aVar( 'arg' )
				)
				.astCall(
					aVar( 'ranks' ).astDot( 'push' ),
					aVar( 'key' )
				)
			)
			.astCase(
				aStringLiteral( 'twig:set' ),
				astBlock( )
				.append( twigDupCheck )
				.astAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.astAssign(
					aVar( 'arg' ),
					aVar( 'arguments' ).astMember(
						astPlus(
							aPreIncrement( aVar( 'a' ) ),
							astNumberLiteral( 1 )
						)
					)
				)
				.astIf(
					astEquals(
						aVar( 'twig' ).astMember( aVar( 'key' ) ),
						anUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" not in use' )
						)
						*/
					)
				)
				.astAssign(
					aVar( 'twig' ).astMember( aVar( 'key' ) ),
					aVar( 'arg' )
				)
			)
			.astCase(
				aStringLiteral( 'twig:insert' ),
				astBlock( )
				.append( twigDupCheck )
				.astAssign(
					aVar( 'key' ),
					aVar( 'arg' )
				)
				.astAssign(
					aVar( 'rank' ),
					aVar( 'arguments' ).astMember(
						astPlus(
							aVar( 'a' ),
							astNumberLiteral( 2 )
						)
					)
				)
				.astAssign(
					aVar( 'arg' ),
					aVar( 'arguments' ).astMember(
						astPlus(
							aVar( 'a' ),
							astNumberLiteral( 3 )
						)
					)
				)
				.append(
					astPlusAssign(
						aVar( 'a' ),
						astNumberLiteral( 2 )
					)
				)
				.astIf(
					astDiffers(
						aVar( 'twig' ).astMember( aVar( 'key' ) ),
						anUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							aStringLiteral( 'key "' ),
							aVar( 'key' ),
							aStringLiteral( '" already in use' )
						)
						*/
					)
				)
				.astIf(
					astOr(
						astLessThan(
							aVar( 'rank' ),
							astNumberLiteral( 0 )
						),
						astGreaterThan(
							aVar( 'rank' ),
							aVar( 'ranks' ).astDot( 'length' )
						)
					),
					astBlock( )
					.astFail(
						//aStringLiteral( 'invalid rank' )
					)
				)
				.astAssign(
					aVar( 'twig' ).astMember( aVar( 'key' ) ),
					aVar( 'arg' )
				)
				.append(
					astCall(
						aVar( 'ranks' ).astDot( 'splice' ),
						aVar( 'rank' ),
						astNumberLiteral( 0 ),
						aVar( 'key' )
					)
				)
			)
			.astCase(
				aStringLiteral( 'twig:remove' ),
				astBlock( )
				.append( twigDupCheck )
				.astIf(
					astEquals(
						aVar( 'twig' ).astMember( aVar( 'arg' ) ),
						anUndefined
					),
					astBlock( )
					.astFail(
						/*
						astPlus(
							aStringLiteral( 'key "' ),
							aVar( 'arg' ),
							aStringLiteral( '" not in use' )
						)
						*/
					)
				)
				.append(
					astDelete(
						aVar( 'twig' ).astMember( aVar( 'arg' ) )
					)
				)
				.append(
					astCall(
						aVar( 'ranks' ).astDot( 'splice' ),
						astCall(
							aVar( 'ranks' ).astDot( 'indexOf' ),
							aVar( 'arg' )
						),
						astNumberLiteral( 1 )
					)
				)
			);
	}

	if( this.ray )
	{
		rayDupCheck =
			astIf(
				astNot( aVar( 'rayDup' ) ),
				astBlock( )
				.astAssign(
					aVar( 'ray' ),
					astCall(
						aVar( 'ray' ).astDot( 'slice' )
					)
				)
				.astAssign(
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
				.astAssign( aVar( 'ray' ), aVar( 'arg' ) )
				.astAssign( aVar( 'rayDup' ), aFalse )
			)
			.astCase(
				aStringLiteral( 'ray:append' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					aVar( 'ray' ).astDot( 'push' ),
					aVar( 'arg' )
				)
			)
			.astCase(
				aStringLiteral( 'ray:insert' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					aVar( 'ray' ).astDot( 'splice' ),
					aVar( 'arg' ),
					astNumberLiteral( 0 ),
					aVar( 'arguments' ).astMember(
						astPlus(
							aPreIncrement( aVar( 'a' ) ),
							astNumberLiteral( 1 )
						)
					)
				)
			)
			.astCase(
				aStringLiteral( 'ray:remove' ),
				astBlock( )
				.append( rayDupCheck )
				.astCall(
					aVar( 'ray' ).astDot( 'splice' ),
					aVar( 'arg' ),
					astNumberLiteral( 1 )
				)
			)
			.astCase(
				aStringLiteral( 'ray:set' ),
				astBlock( )
				.append( rayDupCheck )
				.astAssign(
					aVar( 'ray' ).astMember( aVar( 'arg' ) ),
					aVar( 'arguments' ).astMember(
						astPlus(
							aPreIncrement( aVar( 'a' ) ),
							astNumberLiteral( 1 )
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
				//.astFail( 'invalid argument' )
				.astFail( )
			)
		);

	loop = loop.append( switchExpr );

	block =
		block
		.astFor(
			aVList( )
			.aVarDec( 'a', astNumberLiteral( 0 ) )
			.aVarDec( 'aZ', aVar( 'arguments' ).astDot( 'length' ) ),
			astLessThan( aVar( 'a' ), aVar( 'aZ' ) ),
			astPlusAssign( aVar( 'a' ), astNumberLiteral( 2 ) ),
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
				.astIf(
					astEquals( attr.v, anUndefined ),
					astBlock( )
						.astAssign( attr.v, attr.defaultValue )
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
				check.astIf(
					astEquals( attr.v, anUndefined ),
					astBlock( )
					//.astFail( 'undefined attribute ' + name )
					.astFail( )
				);
		}

		if( !attr.allowsNull )
		{
			check =
				check.astIf(
					astEquals( attr.v, astNull ),
					astBlock( )
					//.astFail( 'attribute ' + name + ' must not be null.' )
					.astFail( )
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
				astDiffers( attr.v, astNull );
		}
		else if( !attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				astDiffers( attr.v, anUndefined );
		}
		else if( attr.allowsNull && attr.allowsUndefined )
		{
			cond =
				astAnd(
					astDiffers( attr.v, astNull ),
					astDiffers( attr.v, anUndefined )
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
					astDiffers(
						aTypeof( attr.v ),
						aStringLiteral( 'boolean' )
					);

				break;

			case 'Integer' :

				tcheck =
					astOr(
						astDiffers(
							aTypeof( attr.v ),
							aStringLiteral( 'number' )
						),
						astDiffers(
							astCall(
								aVar( 'Math' ).astDot( 'floor' ),
								attr.v
							),
							attr.v
						)
					);

				break;

			case 'Number' :

				tcheck =
					astDiffers(
						aTypeof( attr.v ),
						aStringLiteral( 'number' )
					);

				break;


			case 'String' :

				tcheck =
					astAnd(
						astDiffers(
							aTypeof( attr.v ),
							aStringLiteral( 'string' )
						),
						astNot(
							astInstanceof(
								attr.v,
								aVar( 'String' )
							)
						)
					);

				break;

			default :

				tcheck =
					astDiffers(
						attr.v.astDot( 'reflectName' ), // FIXME
						aStringLiteral( attr.type )
					);

				break;
		}

		tfail =
			astBlock( )
			//.astFail( 'type mismatch' );
			.astFail( );

		if( cond )
		{
			check =
				check.astIf(
					cond,
					astBlock( )
					.astIf(
						tcheck,
						tfail
					)
				);
		}
		else
		{
			check =
				check.astIf(
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
						aVar( unit ).astDot( type ).astDot( func )
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
						astCondition(
							astDiffers( attr.v, astNull ),
							attr.v.astDot( member ),
							astNull
						);

				}
				else if( attr.allowsUndefined )
				{
					cExpr =
						astCondition(
							astDiffers( attr.v, anUndefined ),
							attr.v.astDot( member ),
							astNull
						);
				}
				else
				{
					cExpr =
						attr.v.astDot( member );
				}
			}
			else
			{
				cExpr =
					astCall(
						attr.v.astDot( member )
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
			.astAssign( attr.v, cExpr );
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
			astAnd(
				cond,
				astNot( aVar( 'twigDup' ) )
			);
	}

	if( this.ray )
	{
		cond =
			astAnd(
				cond,
				astNot( aVar( 'rayDup' ) )
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
				astAnd(
					cond,
					astEquals( attr.v, astNull )
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
					astEquals(
						attr.v,
						aVar( 'inherit' ).astDot( attr.assign )
					);

				break;

			default :

				equalsCall =
					astCall(
						attr.v.astDot( 'equals' ),
						aVar( 'inherit' ).astDot( attr.assign )
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
						astOr(
							astEquals(
								attr.v,
								aVar( 'inherit' ).astDot( attr.assign )
							),
							astAnd(
								attr.v,
								equalsCall
							)
						);
				}
				else if( attr.allowsUndefined )
				{
					ceq =
						astOr(
							astEquals(
								attr.v,
								aVar( 'inherit' ).astDot( attr.assign )
							),
							astAnd(
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

		cond = astAnd( cond, ceq );
	}

	block =
		block.astIf(
			cond,
			astBlock( )
			.astReturn(
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
			.astIf(
				astNot(
					aVar( '_singleton' )
				),
				astBlock( )
				.astAssign(
					aVar( '_singleton' ),
					astNew(
						astCall(
							aVar( 'Constructor' )
						)
					)
				)
			)
			.astReturn(
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
		block.astReturn(
			astNew( call )
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
		capsule.astComment(
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
		astFunc( block )
		.Arg(
			null,
			'free strings'
		);


	capsule =
		capsule
		.astAssign(
			aVar( this.reference ).astDot( 'create' ),
			astAssign(
				aVar( 'prototype' ).astDot( 'create' ),
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
			.astIf(
				astDiffers(
					aVar( 'arg' ),
					aStringLiteral( this.id )
				),
				astBlock( )
				// .astFail( 'invalid JSON' )
				.astFail( )
			)
		);

	if( this.twig )
	{
		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( 'twig' ),
				astBlock( )
				.astAssign(
					aVar( 'jwig' ),
					aVar( 'arg' )
				)
			)
			.astCase(
				aStringLiteral( 'ranks' ),
				astBlock( )
				.astAssign(
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
					base = aVar( attr.unit ).astDot( attr.type );
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
							base.astDot( 'createFromJSON' ),
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
			.astAssign( attr.v, arg );

		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( attr.name ),
				caseBlock
			);
	}

	block =
		block
		.astForIn(
			'name',
			aVar( 'json' ),
			astBlock( )
			.astAssign(
				aVar( 'arg' ),
				aVar( 'json' ).astMember( aVar( 'name' ) )
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
			aVar( 'jval' ).astDot( 'type' )
		);

	for(
		var a = 0, aZ = this.twigList.length;
		a < aZ;
		a++
	)
	{
		twigId = this.twigList[ a ];

		ut = this.twig[ twigId ];

		base = aVar( ut.unit ).astDot( ut.type );

		switchExpr =
			switchExpr
			.astCase(
				aStringLiteral( twigId ),
				astBlock( )
				.astAssign(
					aVar( 'twig' ).astMember( aVar( 'key' ) ),
					astCall(
						base.astDot( 'createFromJSON' ),
						aVar( 'jval' )
					)
				)
			);
	}

	switchExpr =
		switchExpr
		.Default(
			astBlock( )
			//.astFail( 'invalid twig type' )
			.astFail( )
		);

	loop =
		astBlock( )
		.astAssign(
			aVar( 'key' ),
			aVar( 'ranks' ).astMember( aVar( 'a' ) )
		)
		.astIf(
			astNot(
				aVar( 'jwig' ).astMember( aVar( 'key' ) )
			),
			astBlock( )
			//.astFail( )
			.astFail( 'JSON ranks/twig mismatch' )
		)
		.astAssign(
			aVar( 'jval' ),
			aVar( 'jwig' ).astMember( aVar( 'key' ) )
		)
		.append( switchExpr );

	block =
		block
		.astAssign(
			aVar( 'twig' ),
			astObjLiteral( )
		)
		.astIf(
			astOr(
				astNot( aVar( 'jwig' ) ),
				astNot( aVar( 'ranks' ) )
			),
			astBlock( )
			//.astFail( 'ranks/twig information missing' )
			.astFail( )
		)
		.astFor(
			// FIXME, put into the commalist call
			astCommaList( )
			.append(
				astAssign(
					aVar( 'a' ),
					astNumberLiteral( 0 )
				)
			)
			.append(
				astAssign(
					aVar( 'aZ' ),
					aVar( 'ranks' ).astDot( 'length' )
				)
			),
			astLessThan( aVar( 'a' ), aVar( 'aZ' ) ),
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

				call = call.append( astNull );

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
					call = call.append( astNull );
				}
				else
				{
					call = call.append( attr.v );
				}
		}
	}

	return (
		block.astReturn( astNew( call ) )
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
		capsule.astComment(
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
		.astAssign(
			aVar( this.reference ).astDot( 'createFromJSON' ),
			astFunc( funcBlock )
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
		.astComment( 'Reflection.' )
		.astAssign(
			aVar( 'prototype' ).astDot( 'reflect' ),
			aStringLiteral( this.id )
		);

	capsule =
		capsule
		.astComment( 'Name Reflection.' )
		.astAssign(
			aVar( 'prototype' ).astDot( 'reflectName' ),
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
		.astComment( 'Sets values by path.' )
		.astAssign(
			aVar( 'prototype' ).astDot( 'setPath' ),
			aVar( 'jion' ).astDot( 'proto' ).astDot( 'setPath' )
		)
		.astComment( 'Gets values by path' )
		.astAssign(
			aVar( 'prototype' ).astDot( 'getPath' ),
			aVar( 'jion' ).astDot( 'proto' ).astDot( 'getPath' )
		);

	if( this.twig )
	{
		capsule =
			capsule
			.astComment( 'Returns a twig by rank.' )
			.astAssign(
				aVar( 'prototype' ).astDot( 'atRank' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'atRank' )
			)
			.astComment( 'Gets the rank of a key.' )
			.astAssign(
				// FIXME use proto
				aVar( 'Constructor' ).astDot( 'prototype' ).astDot( 'rankOf' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'rankOf' )
			)
			.astComment( 'Creates a new unique identifier.' )
			.astAssign(
				// FIXME use proto
				aVar( 'Constructor' ).astDot( 'prototype' ).astDot( 'newUID' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'newUID' )
			);
	}

	if( this.ray )
	{
		capsule =
			capsule
			.astComment( 'Appends an entry to the ray.' )
			.astAssign(
				aVar( 'prototype' ).astDot( 'append' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'rayAppend' )
			)
			.astComment(
				'Returns the length of the ray.'
			)
			.astCall(
				aVar( 'jools' ).astDot( 'lazyValue' ),
				aVar( 'prototype' ),
				aStringLiteral( 'length' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'rayLength' )
			)
			.astComment(
				'Gets one entry from the ray.'
			)
			.astAssign(
				aVar( 'prototype' ).astDot( 'get' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'rayGet' )
			)
			.astComment( 'Returns a jion with one entry inserted to the ray.' )
			.astAssign(
				aVar( 'prototype' ).astDot( 'insert' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'rayInsert' )
			)
			.astComment(
				'Returns the jion with one entry of the ray set.'
			)
			.astAssign(
				aVar( 'prototype' ).astDot( 'set' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'raySet' )
			)
			.astComment( 'Returns a jion with one entry from the ray removed.' )
			.astAssign(
				aVar( 'prototype' ).astDot( 'remove' ),
				aVar( 'jion' ).astDot( 'proto' ).astDot( 'rayRemove' )
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
		astObjLiteral( )
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
				aThis.astDot( attr.assign )
			);
	}

	if( this.twig )
	{
		olit =
			olit
			.add(
				'ranks',
				aThis.astDot( 'ranks' )
			)
			.add(
				'twig',
				aThis.astDot( 'twig' )
			);
	}

	block =
		block
		.astAssign(
			aVar( 'json' ),
			astCall(
				aVar( 'Object' ).astDot( 'freeze' ),
				olit
			)
		)
		.astReturn(
			astFunc(
				astBlock( )
				.astReturn(
					aVar( 'json' )
				)
			)
		);

	capsule =
		capsule
		.astComment( 'Converts a ' + this.name + ' into JSON.' )
		.astCall(
			aVar( 'jools' ).astDot( 'lazyValue' ),
			// FIXME use proto
			aVar( 'Constructor' ).astDot( 'prototype' ),
			aStringLiteral( 'toJSON' ),
			astFunc( block )
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

			ceq = astEquals( le, re );

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
					astOr(
						astEquals( le, re ),
						astAnd(
							astDiffers( le, astNull ),
							astCall( le.astDot( 'equals' ), re )
						)
					);
			}
			else if( attr.allowsUndefined )
			{
				ceq =
					astOr(
						astEquals( le, re ),
						astAnd(
							astDiffers( le, anUndefined ),
							astCall( le.astDot( 'equals' ), re )
						)
					);
			}
			else
			{
				ceq = astCall( le.astDot( 'equals' ), re );
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
				.astComment( 'Tests equality of object.' )
				.astAssign(
					aVar( 'Constructor' )
					.astDot( 'prototype' )
					.astDot( 'equals' ),
					astFunc(
						astBlock( )
						.astReturn(
							astEquals(
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
		.astComment( 'Tests equality of object.' );

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
		.astIf(
			astEquals(
				aThis,
				aVar( 'obj' )
			),
			astBlock( )
			.astReturn( aTrue )
		)
		.astIf(
			astNot(
				aVar( 'obj' )
			),
			astBlock( ).astReturn( aFalse )
		);

	// XXX

	if( this.twig )
	{
		vA = aVar( 'a' );

		vKey = aVar( 'key' );

		twigTestLoopBody =
			astBlock( )
			.astAssign(
				vKey,
				aThis.astDot( 'ranks' ).astMember( vA )
			)
			.astIf(
				astOr(
					astDiffers(
						aVar( 'key' ),
						aVar( 'obj' ).astDot( 'ranks' ).astMember( vA )
					),
					astCall(
						astCondition(
							aThis.astDot( 'twig' ).astMember( vKey ).astDot( 'equals' ),
							astNot(
								astCall(
									aThis
									.astDot( 'twig' )
									.astMember( vKey )
									.astDot( 'equals' ),

									aVar( 'obj' )
									.astDot( 'twig' )
									.astMember( vKey )
								)
							),
							astDiffers(
								aThis
									.astDot( 'twig' )
									.astMember( vKey ),
								aVar( 'obj' )
									.astDot( 'twig' )
									.astMember( vKey )
							)
						)
					)
				),
				astBlock( ).astReturn( aFalse )
			);

		twigTest =
			astBlock( )
			.astIf(
				astDiffers(
					aThis.astDot( 'ranks' ).astDot( 'length' ),
					aVar( 'obj' ).astDot( 'ranks' ).astDot( 'length' )
				),
				astBlock( ).astReturn( aFalse )
			)
			.astFor(
				astCommaList( ) // FIXME add astAssign to astCommaList
				.append(
					astAssign( aVar( 'a' ),
					astNumberLiteral( 0 ) )
				)
				.append(
					astAssign(
						aVar( 'aZ' ),
						aThis
							.astDot( 'ranks' )
							.astDot( 'length' ) )
				),
				astLessThan( aVar( 'a' ), aVar( 'aZ' ) ),
				aPreIncrement( aVar( 'a' ) ),
				twigTestLoopBody
			);

		block =
			block
			.astIf(
				astOr(
					astDiffers(
						aThis.astDot( 'tree' ),
						aVar( 'obj' ).astDot( 'tree' )
					),
					astDiffers(
						aThis.astDot( 'ranks' ),
						aVar( 'obj' ).astDot( 'ranks' )
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
				aThis.astDot( attr.assign ),
				aVar( 'obj' ).astDot( attr.assign )
			);

		cond =
			cond === null
			? ceq
			: astAnd( cond, ceq );
	}

	if( cond )
	{
		block = block.astReturn( cond );
	}
	else
	{
		block = block.astReturn( aTrue );
	}

	capsule =
		capsule
		.astAssign(
			// FIXME use proto
			aVar( 'Constructor' ).astDot( 'prototype' ).astDot( 'equals' ),
			astFunc( block )
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

		capsule = capsule.astComment( 'Tests partial equality.' );

		block =
			astBlock( )
			.astIf(
				astEquals( aThis, aVar( 'obj' ) ),
				// FIXME make an astReturn shorthand that creates a block
				astBlock( ).astReturn( aTrue )
			)
			.astIf(
				astNot( aVar( 'obj' ) ),
				astBlock( ).astReturn( aFalse )
			);

		if( this.twig )
		{
			// FIXME same test as in equals
			cond =
				astAnd(
					astEquals(
						aThis.astDot( 'tree' ),
						aVar( 'obj' ).astDot( 'tree' )
					),
					astEquals(
						aThis.astDot( 'ranks' ),
						aVar( 'obj' ).astDot( 'ranks' )
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
					aThis.astDot( attr.assign ),
					aVar( 'obj' ).astDot( attr.assign )
				);

			cond =
				cond === null
				? ceq
				: astAnd( cond, ceq );
		}

		block = block.astReturn( cond );

		capsule =
			capsule
			.astAssign(
				// FIXME use proto
				aVar( 'Constructor' )
				.astDot( 'prototype' )
				.astDot( alikeName ),

				astFunc( block )
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
		.astComment( 'Node export.' )
		.astIf(
			aVar( 'SERVER' ),
			astBlock( )
			.astAssign(
				aVar( 'module' ).astDot( 'exports' ),
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
	block = block.astComment( 'Export.' );

	block =
		block
		.aVarDec(
			this.unit,
			astOr(
				aVar( this.unit ),
				astObjLiteral( )
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
			astFile( )
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
			astFile( )
			.create(
				'header',
					astComment.create(
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
