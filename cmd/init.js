{
  cmd: 'alter',
  time: -1,
  src: {
    val: {
      type: 'Space',
      items: {
        type: 'ItemCopse',
        '0' : {
          type: 'Note',
          zone: {
		    type: 'Rect',
 	        pnw : { type: 'Point', x: 100, y: 100 },
	        pse : { type: 'Point', x: 300, y: 200 },
	      },
	      doc: {
			 type  : 'Doc',
	         paras : {
              type : 'ParaCopse',
	          '0' : {
                type: 'Para',
                text: 'If you can dream---and not make dreams your master;',
              },
			  '1' : {
                type: 'Para',
                text: 'If you can think---and not make thoughts your aim,',
              },
			  '2' : {
                type: 'Para',
                text: 'If you can meet with Triumph and Disaster',
              },
			  '3' : {
                type: 'Para',
                text: 'And treat those two impostors just the same',
              },
            },
			alley : ['0', '1', '2', '3'],
          },
        },
      },
      z : [ '0', ],
    },
  },
  trg: {
    path: ['welcome'],
  },
}

