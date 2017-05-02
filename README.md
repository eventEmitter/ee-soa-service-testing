# ee-soa-service-testing

[![Greenkeeper badge](https://badges.greenkeeper.io/eventEmitter/ee-soa-service-testing.svg)](https://greenkeeper.io/)

easy testing for ee-soa services

## installation

	npm install ee-soa-service-testing

## build status

[![Build Status](https://travis-ci.org/eventEmitter/ee-soa-service-testing.png?branch=master)](https://travis-ci.org/eventEmitter/ee-soa-service-testing)


## usage


	var env = new TestEnvironment();
	var Request = env.Request;

	// add classic orm config
	env.orm(config);

	// execute sql on the myDbName db, expects the path to a directory containig
	// sql files whcih should be executed. if therer is a «execution-order.js»
	// file which exports an array all files in the array will be executed
	env.sql('myDbName', __dirname+'/dbSetup');


	// create a service instance of your service you want to test
	// you may retreive the orm using the orm function
	var service = new MyService({
		controllerOptions: {
			orm: env.orm()
		}
	});

	// register the service, you may register as many service as you like
	env.use(service);

	// load everything, the callback get executed when everything is loaded
	env.load(function() {
		// you may start your test when now :)
		new Request({}).send('myService', function(status, data){

		});

		env.request(new SOARequest(), new SOAResponse());
	});
