$(document).ready(function() {

const prices = {
  'ETH': {
    price: 1,
    highPrice: 1
  },
  'BTC': {
    price: 1,
    highPrice: 1
  },
  'LTC': {
    price: 1,
    highPrice: 1
  }
}

// hamburger menu
$('.hamburger-menu').on('click', function() {
  $('.bar').toggleClass('animate')
  $('.menu').toggleClass('show')
})

// Get highest historical
// BTC
$.ajax({
  url: 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=100&aggregate=3&e=CCCAGG',
  type: 'GET',
  dataType: 'json',
  success: function (data) {
    const history = data['Data']
    const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
    prices['BTC'] = highest
    console.log(`BTC highest=${highest}`)
  }
})

// ETH
$.ajax({
  url: 'https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=2000&aggregate=3&e=CCCAGG',
  method: 'GET',
  dataType: 'json',
  success: function (data) {
    const history = data['Data']
    const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
    prices['ETH'] = highest
    console.log(`ETH highest=${highest}`)
  }
})

// LTC
$.ajax({
  url: 'https://min-api.cryptocompare.com/data/histominute?fsym=LTC&tsym=USD&limit=2000&aggregate=3&e=CCCAGG',
  method: 'GET',
  dataType: 'json',
  success: function (data) {
    const history = data['Data']
    const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
    prices['LTC'] = highest
    console.log(`LTC highest=${highest}`)
  }
})

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

// Update prices
let socketResults = {}
var socket = io.connect('https://streamer.cryptocompare.com/')

// var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~ZEC~USD', '5~CCCAGG~XRP~USD', '5~CCCAGG~XMR~USD']
var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~LTC~USD']
socket.emit('SubAdd', {subs: subscription})
socket.on('m', function(message) {
  var messageType = message.substring(0, message.indexOf('~'))
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

  if (!socketResults.hasOwnProperty(pair)) {
    socketResults[pair] = {}
  }

  for (var key in data) {
    socketResults[pair][key] = data[key]
  }

  if (socketResults[pair]['LASTTRADEID']) {
    socketResults[pair]['LASTTRADEID'] = parseInt(socketResults[pair]['LASTTRADEID']).toFixed(0)
  }
  socketResults[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (socketResults[pair]['PRICE'] - socketResults[pair]['OPEN24HOUR']))
  socketResults[pair]['CHANGE24HOURPCT'] = ((socketResults[pair]['PRICE'] - socketResults[pair]['OPEN24HOUR']) / socketResults[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%"

  const currentObj = {
    name: socketResults[pair]['FROMSYMBOL'],
    price: socketResults[pair]['PRICE']
  }

  updateBubbles()
  // updateBubbles(socketResults[pair])
}

function updateBubbles() {
  console.log(prices);
}

//
//
//
// // initial bubbles
//   function updateBubbles(incomingData) {
//     console.log(incomingData)
//
//     switch(incomingData['FROMSYMBOL']) {
//       case 'BTC':
//         d3.select('#BTC')
//           .transition()
//           .attr('r', incomingData['PRICE']/100)
//         break
//       case 'ETH':
//         d3.select('#ETH')
//           .transition()
//           .attr('r', incomingData['PRICE']/100)
//         break
//       case 'LTC':
//         d3.select('#LTC')
//           .transition()
//           .attr('r', incomingData['PRICE']/50)
//         break
//       case 'ZEC':
//         d3.select('#ZEC')
//           .transition()
//           .attr('r', incomingData['PRICE']/50)
//         break
//       case 'XRP':
//         d3.select('#XRP')
//           .transition()
//           .attr('r', incomingData['PRICE'])
//         break
//       case 'XMR':
//         d3.select('#XMR')
//           .transition()
//           .attr('r', incomingData['PRICE']/50)
//         break
//     }
//   }
})
