// Licensed under the Apache License. See footer for details.
var
	express = require('express'),
	app = express(),
	cfenv = require('cfenv');

// load local VCAP configuration
var vcapLocal = null
try {
  vcapLocal = require("./vcap-local.json");
  console.log("Loaded local VCAP", vcapLocal);
} catch (e) {
  console.error(e);
}

// get the app environment from Cloud Foundry, defaulting to local VCAP
var appEnvOpts = vcapLocal ? {
  vcap: vcapLocal
} : {}
var appEnv = cfenv.getAppEnv(appEnvOpts);

// currently send a static list
app.get("/api/1/products.json", function(req, res) {
  res.sendFile(__dirname + "/products.json");
})

// currently send a static list
var pricers = JSON.parse(require('fs').readFileSync('pricers.json', 'utf8'));
app.get("/api/1/pricers.json", function(req, res) {
  res.send(pricers);
})

//$http.get("/api/1/price.json?pricer=" + engine.id + "&price=" + price + "&quantity=" + quantity + "&state=" + state)
app.get("/api/1/price.json", function(req, res) {
  res.sendStatus(501)
});

var monitor = {
	count: 0,
	total: 0,
	prices: {}
}
//$http.get("/api/1/monitor.json
app.get("/api/1/monitor.json", function(req, res) {
  res.send(monitor)
});

//$http.get("/api/1/monitorLog.json?total=" + (cart.price * cart.quantity))
app.get("/api/1/monitorLog.json", function(req, res) {
  monitor.count++
	monitor.total += Number(req.query.total)
	res.send(monitor)
});

//$http.get("/api/1/monitorPrice.json?name=" + name + "&price=" + price
app.get("/api/1/monitorPrice.json", function(req, res) {
	if ( !monitor.prices[req.query.name] ) {
		monitor.prices[req.query.name] = 0;
	}
  monitor.prices[req.query.name] += Number(req.query.price)
	res.send(monitor)
});

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// start server on the specified port and binding host
app.listen(appEnv.port, "0.0.0.0", function () {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
