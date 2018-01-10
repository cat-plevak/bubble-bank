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

    createBubbles(currentPrice[pair])
  }



// display each incoming data message
  function createBubbles(incomingData) {
    console.log(incomingData)

    switch(incomingData['FROMSYMBOL']) {
      case 'BTC':
        d3.select('#BTC')
          .attr('r', incomingData['PRICE']/100)
        break
      case 'ETH':
        d3.select('#ETH')
          .attr('r', incomingData['PRICE']/100)
        break
      case 'LTC':
        d3.select('#LTC')
          .attr('r', incomingData['PRICE']/50)
        break
      case 'ZEC':
        d3.select('#ZEC')
          .attr('r', incomingData['PRICE']/50)
        break
      case 'XRP':
        d3.select('#XRP')
          .attr('r', incomingData['PRICE'])
        break
      case 'XMR':
        d3.select('#XMR')
          .attr('r', incomingData['PRICE']/50)
        break
    }


  }

})
