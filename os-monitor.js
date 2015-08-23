/**
 * Example usage of os-monitor with loggly
 * @author David Christian Liedle
 * @link   http://davidcanhelp.me/
 * @link   https://www.loggly.com/
 *
 */

var loggly  = require('loggly'),
    monitor = require('os-monitor');

var client = loggly.createClient({
               token:     "your-really-long-input-token",
               subdomain: "your-subdomain",
               auth: {
                 username: "your-username",
                 password: "your-password"
               },
               json: true // to send logs as JSON
             });
monitor.start({
  delay: monitor.seconds(5),
  critical1: 1, // will alert when 1 minute load average is higher than value 1
  freemem: 0.2 // will alert when free memory left is under 20% of total memory
});

// defining event handler
var handler = function(event) {
 
  // here, add optional data to event object
  event.formattedDate = new Date(event.timestamp * 1000).toString();
 
  // log to Loggly
  client.log(event);
};

// observing 1 minute load average and free memory events
monitor.on('loadavg1', handler);
monitor.on('freemem', handler);
 
// observing monitor events, which always happen on every cycle
monitor.on('monitor',  handler);

monitor.start({
  delay: monitor.seconds(5),
  critical1: 1,
  freemem: 0.2,
  stream: true // use as readable data stream
});
 
// observing all streaming events (in that case: 'monitor', 'loadavg1', 'freemem')
// using readable stream 'data' event
monitor.on('data', function(buf) {
 
  // get event object from Buffer
  var event = JSON.parse( buf.toString() );
 
  // here, add optional data to event object
  event.formattedDate = new Date(event.timestamp * 1000).toString();
 
  // log to Loggly
  client.log(event);
});
