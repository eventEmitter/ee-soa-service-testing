!function(){

	var   Class 			= require('ee-class')
		, type 				= require('ee-types')
		, async 			= require('ee-async')
		, EventEmitter 		= require('ee-event-emitter')
		, log 				= require('ee-log')
		, ORM 				= require('ee-orm')
		, fs 				= require('fs')
		, path 				= require('path')
		, RPCRequest 		= require('ee-soa-rpc-request')
		, ServiceManager 	= require('ee-soa-service-manager');



	module.exports = new Class({
		inherits: EventEmitter

		, init: function() {
			this.Request = new RPCRequest(this);
			this._sqlJobsStarted = 0;
			this._sqlJobscompleted = 0;


			this.services = new ServiceManager();

			// loop back all traffic
			this.services.on('request', this.services.bind(this.services));
		}


		, orm: function(config) {
			if (config) {
				this._orm = new ORM(config);
			}
			return this.orm;
		}



		, request: function(request, response) {
			this.services.request(request, response);
		}

		

		, use: function(service) {
			this.services.use(service);
			return this;
		}


		, sql: function(dbName, directory) {
			if (this.orm) {
				this._sqlJobsStarted++;

				if (this.orm.isLoaded()) {
					if (this.orm[dbName]) this._execeuteSQL(dbName, directory);
					else throw new Error('Cannot execute SQL, db «'+dbName+'» not found!');
				}
				else {
					this.orm.on('load', function(){
						this._execeuteSQL(dbName, directory);
					}.bind(this));
				}
			}
			else throw new Error('Cannot execute SQL, please initialize the ORM first!');
		}


		, load: function(callback) {
			if (this._sqlJobscompleted === this._sqlJobsStarted) {
				this.services.onLoad(callback);
			}
			else {
				this.once('SQLLoad', function(){
					this.load(callback);
				}.bind(this));
			}
		}


		, _execeuteSQL: function(dbName, directory) {
			fs.readdir(directory, function(err, files){
				if (err) throw err;
				else {
					if (files.indexOf('execution-order.js')){
						var config;
						try {
							config = require(path.join(directory, 'execution-order.js'));
						} catch(err) {
							log.error('Failed to laod execution-order.js:');
							log(err);
							return;
						}

						if (type.array(config)) {
							this._loadFiles(directory, config, dbName);
						}
						else throw new Error('execution-order.js must export an array');
					}
					else this._loadFiles(directory, files, dbName);
				}
			}.bind(this));
		}


		, _loadFiles: function(directory, files, dbName) {
			var sql = [];

			files = files.filter(function(item){
				return item.substr(-4) === '.sql';
			});

			async.each(files, function(fileName, next){
				fs.readFile(path.join(directory, fileName), function(err, data){
					if (err) next(err);
					else {
						var sqlStatements = data.toString().toString().split(';').map(function(input){
							return input.trim().replace(/\n/gi, ' ').replace(/\s{2,}/g, ' ')
						}).filter(function(item){
							return !!item.length;
						});

						next(null, sqlStatements);
					}
				}.bind(this));
			}.bind(this), function(err, results){
				if (err) throw err;
				else {
					results.forEach(function(statements){
						sql = sql.concat(statements);
					}.bind(this));
					
					this._runSQL(sql, dbName);
				}
			}.bind(this));
		}


		, _runSQL: function(sqlStatements, dbName) {
			this._orm.getDatabase(dbName).getConnection(function(err, connection){
				if (err) throw err;
				else {
					async.each(sqlStatements, connection.queryRaw.bind(connection), function(err){
						if (err) throw err;
						else {
							this._orm.reload(this._sqlComplete.bind(this));
						}
					}.bind(this));
				}
			});	
		}


		, _sqlComplete: function(err) {
			if (err) throw err;
			else {
				if (++this._sqlJobscompleted === this._sqlJobsStarted) {
					this.emit('SQLLoad');
				}
			}
		}
	});
}();
