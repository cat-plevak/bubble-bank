$(document).ready(function() {

  const prices = [
     {
      symbol: 'ETH',
      price: 1,
      highPrice: 1,
      color: '#C7D593'
    },
    {
      symbol: 'BTC',
      price: 1,
      highPrice: 1,
      color: '#AEC5B3'
    },
    {
      symbol: 'LTC',
      price: 1,
      highPrice: 1,
      color: '#F4D16A'
    },
    {
      symbol: 'ZEC',
      price: 1,
      highPrice: 1,
      color: '#CC9553'
    },
    {
      symbol: 'XRP',
      price: 1,
      highPrice: 1,
      color: '#DF5F34'
    },
    {
      symbol: 'XMR',
      price: 1,
      highPrice: 1,
      color: '#812D4F'
    }
  ]

  d3.select('svg')
    .append('g')
    .attr('id', 'bubbleGroup')
    .attr('transform', 'translate(50,300)')
    .selectAll('g')
    .data(prices)
    .enter()
    .append('g')
    .attr('class', 'indexGroup')
    .attr('transform', function(d,i) {return "translate(" + (i * 150) + ", 0)"})

    const indexG = d3.selectAll('g.indexGroup')
    const color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#ffbf00", "#bfb8d6"])

    indexG
      .append('circle')
      .attr('r', 25)
      .style('fill', function(d) {return d.color})

    indexG
      .append('text')
      .style('text-anchor', 'middle')
      .attr('y', 50)
      .style('font-size', '10px')
      .text(function(d) {return d.symbol})


  // Get highest historical
  // BTC
  $.ajax({
    url: 'https://min-api.cryptocompare.com/data/histominute?fsym=BTC&tsym=USD&limit=480&aggregate=3&e=CCCAGG',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      const history = data['Data']
      const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
      prices[1].highPrice = highest
      console.log(`BTC highest=${highest}`)
    }
  })

  // ETH
  $.ajax({
    url: 'https://min-api.cryptocompare.com/data/histominute?fsym=ETH&tsym=USD&limit=480&aggregate=3&e=CCCAGG',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      const history = data['Data']
      const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
      const lowest = history.reduce((x, y) => Math.max(x, y.low), Number.MAX_SAFE_INTEGER)
      const average = (highest + lowest)/2
      prices[0].highPrice = highest
      console.log(`ETH highest=${highest}`)
    }
  })

  // LTC
  $.ajax({
    url: 'https://min-api.cryptocompare.com/data/histominute?fsym=LTC&tsym=USD&limit=480&aggregate=3&e=CCCAGG',
    method: 'GET',
    dataType: 'json',
    success: function (data) {
      const history = data['Data']
      const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
      prices[2].highPrice = highest
      console.log(`LTC highest=${highest}`)
    }
  })

  // ZEC
  $.ajax({
    url: 'https://min-api.cryptocompare.com/data/histominute?fsym=ZEC&tsym=USD&limit=480&aggregate=3&e=CCCAGG',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      const history = data['Data']
      const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
      prices[3].highPrice = highest
      console.log(`ZEC highest=${highest}`)
    }
  })

  // XRP
  $.ajax({
    url: 'https://min-api.cryptocompare.com/data/histominute?fsym=XRP&tsym=USD&limit=480&aggregate=3&e=CCCAGG',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      const history = data['Data']
      const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
      prices[4].highPrice = highest
      console.log(`XRP highest=${highest}`)
    }
  })

  // XMR
  $.ajax({
    url: 'https://min-api.cryptocompare.com/data/histominute?fsym=XMR&tsym=USD&limit=480&aggregate=3&e=CCCAGG',
    type: 'GET',
    dataType: 'json',
    success: function (data) {
      const history = data['Data']
      const highest = history.reduce((x, y) => Math.max(x, y.high), Number.MIN_SAFE_INTEGER)
      prices[5].highPrice = highest
      console.log(`XMR highest=${highest}`)
    }
  })



// hamburger menu
  $('.hamburger-menu').on('click', function() {
		$('.bar').toggleClass('animate')
    $('.menu').toggleClass('show')
    $('.menuItems').toggleClass('toggle')
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
    greeting.innerHTML = 'good evening'
    ampm.innerHTML = 'pm'
    hours.innerHTML = hrs - 12
  } else if (hrs > 12 && hrs < 17) {
    greeting.innerHTML = 'good afternoon'
    ampm.innerHTML = 'pm'
		hours.innerHTML = hrs - 12
	} else {
    greeting.innerHTML = 'good morning'
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



// // update prices
let socketResults = {}
const socket = io.connect('https://streamer.cryptocompare.com/')
const subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~LTC~USD', '5~CCCAGG~ZEC~USD', '5~CCCAGG~XRP~USD', '5~CCCAGG~XMR~USD']
socket.emit('SubAdd', {subs: subscription})
socket.on('m', function(message) {
    const messageType = message.substring(0, message.indexOf("~"))
    var res = {}
    if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
      res = CCC.CURRENT.unpack(message)
      dataUnpack(res)
    }
  })

// // format incoming message
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

    // prices[socketResults[pair]['FROMSYMBOL']].price = socketResults[pair]['PRICE']

    var index = socketResults[pair]['FROMSYMBOL']

    // function search(index, prices){
    //   console.log(index)
    //   for (var i=0; i < prices.length; i++) {
    //       if (prices[i].symbol === socketResults[pair].from) {
    //           prices[i].price = socketResults[pair]['PRICE']
    //           console.log(prices)
    //           return prices
    //       }
    //   }
    // }
//
//     updateBubbles(prices)
  }
//
//
// // initial bubbles
// const RADIUSCOEFF = 80
//
// function updateBubbles(prices) {
//
//   Object.keys(prices).forEach(sym => {
//     const bubbleId = `#${sym}`
//     const currency = prices[sym]
//     const change = ((currency.price - currency.highPrice)/currency.highPrice) * 150
//     let radius
//     if(change < 0) {
//       radius = (RADIUSCOEFF * currency.price / currency.highPrice) - Math.abs(change)
//     } else {
//       radius = (RADIUSCOEFF * currency.price / currency.highPrice) + change
//     }
//     d3.select(bubbleId)
//       .transition()
//       .attr('r', radius)
//       .style('opacity', '0.8')
//       .transition()
//       .style('opacity', '1')
//       .attr('r', RADIUSCOEFF * currency.price / currency.highPrice)
//   })
//
//   console.log(prices)
// }

})
