$(document).ready(function() {




  var currentPrice = {}
  var socket = io.connect('https://streamer.cryptocompare.com/')

// connect to socket
  var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~ZEC~USD', '5~CCCAGG~XRP~USD', '5~CCCAGG~XMR~USD']
  socket.emit('SubAdd', {subs: subscription})
  socket.on("m", function(message) {
    var messageType = message.substring(0, message.indexOf("~"))
    var res = {}
    if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
      res = CCC.CURRENT.unpack(message)
      dataUnpack(res)
    }
  })

// format incoming message
  var dataUnpack = function(data) {
    var from = data['FROMSYMBOL']
    var to = data['TOSYMBOL']
    var fsym = CCC.STATIC.CURRENCY.getSymbol(from)
    var tsym = CCC.STATIC.CURRENCY.getSymbol(to)
    var pair = from + to

    if (!currentPrice.hasOwnProperty(pair)) {
      currentPrice[pair] = {}
    }

    for (var key in data) {
      currentPrice[pair][key] = data[key]
    }

    if (currentPrice[pair]['LASTTRADEID']) {
      currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0)
    }
    currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']))
    currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%"

    const currentObj = {
      name: currentPrice[pair]['FROMSYMBOL'],
      price: currentPrice[pair]['PRICE']
    }

    createBubbles(currentObj)
  }



// display each incoming data message
  function createBubbles(incomingData) {
    console.log(incomingData)

    // d3.select('svg')
    //   .append('g')
    //   .attr('id', 'indexesG')
    //   .attr('transform', 'translate(50,300)')
    //   .selectAll('g')
    //   .data(incomingData)
    //   .enter()
    //   .append('g')
    //   .attr('class', 'overallG')
    //   // .attr('transform', function (d) {return "translate(30, 0)"})
    //
    // var indexG = d3.selectAll('g.overallG')

    // indexG
    //   .append('circle')
    //   .attr('r', 20)
    //   .style('fill', 'pink')

    // indexG
    //   .append('text')
    //   .style('text-anchor', 'middle')
    //   .attr('y', 30)
    //   .style('font-size', '10px')
    //   .text(function(d) {return d.})
  }

})
