$(document).ready(function() {

    // const histBTC = $.get('https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=100&aggregate=3&e=CCCAGG')


  // const histETH = $.get('https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=2000&aggregate=3&e=CCCAGG')
  // const histLTC = $.get('https://min-api.cryptocompare.com/data/histominute?fsym=LTC&tsym=USD&limit=2000&aggregate=3&e=CCCAGG')
  // const histZEC = $.get('https://min-api.cryptocompare.com/data/histominute?fsym=ZEC&tsym=USD&limit=2000&aggregate=3&e=CCCAGG')
  // const histXRP = $.get('https://min-api.cryptocompare.com/data/histominute?fsym=XRP&tsym=USD&limit=2000&aggregate=3&e=CCCAGG')
  // const histXMR = $.get('https://min-api.cryptocompare.com/data/histominute?fsym=XMR&tsym=USD&limit=2000&aggregate=3&e=CCCAGG')
  //
  // const head1 = histBTC['responseJSON']['Data'][0]
  // const tail1 = histBTC['responseJSON']['Data'].slice(1)
  //
  // const lowestBTC = tail.reduce((x, y) => Math.min(x, y.low), Number.MAX_SAFE_INTEGER)
  // const highestBTC = tail.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
  // const normalizedBTC = head.high / highest

// circle node array
// const svgContainer = document.querySelector('.bubbles')
//
// const BTC = document.querySelector('#BTC')
// const ETH = document.querySelector('#ETH')
// const LTC = document.querySelector('#LTC')
// const ZEC = document.querySelector('#ZEC')
// const XRP = document.querySelector('#XRP')
// const XMR = document.querySelector('#XMR')
//
//
// let nodeArray = new Array()
// nodeArray[0] = {id: '0', label:'BTC', ui: BTC}
// nodeArray[1] = {id: '1', label:'ETH', ui: ETH}
// nodeArray[2] = {id: '2', label:'LTC', ui: LTC}
// nodeArray[3] = {id: '3', label:'ZEC', ui: ZEC}
// nodeArray[4] = {id: '4', label:'XRP', ui: XRP}
// nodeArray[5] = {id: '5', label:'XMR', ui: XMR}
//
// let linkArray = new Array()
//
// const force =  d3.forceSimulation()
//     .nodes(nodeArray)
//     .links(linkArray)
//     .gravity(.05)
//     .distance(30)
//     .charge(-100)
//     .size([800, 800])
//     .start()
//
// let node = svgContainer.selectAll('g.node')
//   .data(nodeArray)
//   .call(force.drag)

// hamburger menu
(function () {
	$('.hamburger-menu').on('click', function() {
		$('.bar').toggleClass('animate')
    $('.menu').toggleClass('show')
	})
})();

// clock
const greeting = document.querySelector('.greeting')

const hours = document.querySelector('.hours')
const minutes = document.querySelector('.minutes')
const ampm = document.querySelector('.ampm')

const month = document.querySelector('.month')
const day = document.querySelector('.day')
const year = document.querySelector('.year')

function setDate() {
	const now = new Date()
	const mm = now.getMonth()
	const dd = now.getDate()
	const yyyy = now.getFullYear()
	const mins = now.getMinutes()
	const hrs = now.getHours()
	const monthName = [
		'January','February','March','April',
		'May','June','July','August','September',
		'October','November','December'
	]

  if(hrs >= 17) {
    greeting.innerHTML = 'Good Evening'
    ampm.innerHTML = 'pm'
    hours.innerHTML = hrs - 12
  } else if (hrs > 12 && hrs < 17) {
    greeting.innerHTML = 'Good Afternoon'
    ampm.innerHTML = 'pm'
		hours.innerHTML = hrs - 12
	} else {
    greeting.innerHTML = 'Good Morning'
    ampm.innerHTML = 'am'
		hours.innerHTML = hrs
	}


	if (mins < 10) {
		minutes.innerHTML = '0' + mins
	} else {
		minutes.innerHTML = mins
	}

	month.innerHTML = monthName[mm]
	day.innerHTML = dd + ','
	year.innerHTML = yyyy
}

setInterval(setDate,1000)



// connect to socket
  var currentPrice = {}
  var socket = io.connect('https://streamer.cryptocompare.com/')


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

    updateBubbles(currentPrice[pair])
  }



// initial bubbles
  function updateBubbles(incomingData) {
    console.log(incomingData)

    switch(incomingData['FROMSYMBOL']) {
      case 'BTC':
        d3.select('#BTC')
          .transition()
          .attr('r', incomingData['PRICE']/100)
        break
      case 'ETH':
        d3.select('#ETH')
          .transition()
          .attr('r', incomingData['PRICE']/100)
        break
      case 'LTC':
        d3.select('#LTC')
          .transition()
          .attr('r', incomingData['PRICE']/50)
        break
      case 'ZEC':
        d3.select('#ZEC')
          .transition()
          .attr('r', incomingData['PRICE']/50)
        break
      case 'XRP':
        d3.select('#XRP')
          .transition()
          .attr('r', incomingData['PRICE'])
        break
      case 'XMR':
        d3.select('#XMR')
          .transition()
          .attr('r', incomingData['PRICE']/50)
        break
    }
  }
})
