
	
	var   Class 			= require('ee-class')
		, log 				= require('ee-log')
		, assert 			= require('assert');



	var   TestEnvironment 	= require('../')
		, TestService 		= require('ee-soa-testservice')
		, service
		, env
		, config;




	try {
		config = require('../config.js').db
	} catch(e) {
		config = {
			ee_soa_test: {
				  type: 'postgres'
				, hosts: [
					{
						  host 		: 'localhost'
						, username 	: 'postgres'
						, password 	: ''
						, port 		: 5432
						, mode 		: 'readwrite'
						, database 	: 'test'
					}
				]
			}
		};
	}





	describe('The TestEnvironment', function(){
		it('should not crash when instantiated', function(){
			env = new TestEnvironment();
		});

		it('should laod the orm', function(){
			env.orm(config);
		});

		it('should accept an instance of the testservice', function(){
			service = new TestService();
			env.use(service);
		});	

		it('should execute a bunch of sql files', function(){
			env.sql('ee_soa_test', __dirname+'/sqlFiles');
		});

		it('should execute a bunch of sql files (cordered)', function(){
			env.sql('ee_soa_test', __dirname+'/sqlOrderedFiles');			
		});

		it('should wait until everything is executed', function(done){
			this.timeout(10000);
			env.load(done);
		});

		it('should accept requests', function(done){
			new env.Request().send('test', function(status, data){
				assert.equal(status, 1);
				assert.equal(JSON.stringify(data), '[{"id":1}]');
				done();
			});
		});
	});
	