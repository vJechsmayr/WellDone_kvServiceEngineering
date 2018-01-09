var crypto = require('crypto');

module.exports = {
	setup: function (app, db, session, toDate, sendResponse) {

		app.post('/user/login', function (req, res) {
			//console.log(req.body.email + " " + req.body.passwd);

			var hash = crypto.createHash('sha256').update(req.body.passwd).digest('base64');
			//console.log(hash);

			db.query('SELECT id, active, admin from users where email=? AND passwort=?', [req.body.email, hash], function (err, rows, fields) {
				if (err) throw err;
				var suc = false;

				if (rows.length > 0 && rows[0].active == 1) {
					req.session.userid = rows[0].id;
					req.session.admin = rows[0].admin;
					suc = true;
				}

				sendResponse(res, suc, "");
			});
		}); //end login

		app.post('/user/logout', function (req, res) {

			req.session.destroy();

			sendResponse(res, true);

		});

		app.post('/user/register', function (req, res) {
			var regsuc = false;
			var message = "";


			if (req.body.firstname == null || req.body.firstname == "") {
				message = "Bitte Vorname eingeben!";

			} else if (req.body.lastname == null || req.body.lastname == "") {
				message = "Bitte Nachname eingeben!";

			} else if (req.body.email == null || req.body.email == "") {
				message = "Bitte gültige Email eingeben!";

			} else if (req.body.password == null || req.body.password == "" || req.body.password2 == "" || req.body.password != req.body.password2) {
				message = "Bitte zweimal das gleiche Passwort eingeben!";

			} else {
				regsuc = true;
			}

			if (regsuc) {
				db.query('SELECT email from users where email=?', [req.body.email], function (err, result, fields) {
					if (err) {
						message = "Fehler mit DB";
						sendResponse(res, false, message);
					} else {
						if (result.length > 0) {
							message = "Email schon vorhanden!";
							sendResponse(res, false, message);
						} else {
							//	console.log('email: ' + req.body.email + ' firstname: ' + req.body.firstname + ' Nachname: ' + req.body.nachname + ' Passwort: ' + req.body.password);
							var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
							//	console.log('hash: ' + hash);

							db.query('INSERT INTO users (email, firstname, lastname, passwort) VALUES (?,?,?,?)', [req.body.email, req.body.firstname, req.body.lastname, hash], function (err, result) {
								if (err) {
									message = "Fehler mit DB";
									sendResponse(res, false, message);
								} else {
									sendResponse(res, true, message);
								}

							});
						}
					}

				});

			} else {
				sendResponse(res, false, message);
			}

		}); //end register

		//Mitarbeiterverwaltung übersicht
		app.get('/users/get', function (req, res) {

			if (req.session.userid && req.session.admin) {
				var regsuc = false;
				var message = "";

				db.query('SELECT id, firstname, lastname, email, active, admin from users', function (err, result, fields) {
					if (err) {
						message = "Fehler mit DB";
						sendResponse(res, false, message);
					} else {
						sendResponse(res, true, "", result);
					}
				});
			} else {
				sendResponse(res, false, "Keine Berechtigung!");
			}
		}); //end users

		app.post('/user/info', function (req, res) {
			if (req.session.userid) {

				var parameter = [];
				var suc = false;

				if (req.body.userid) {
					if (req.session.admin) {
						parameter = [req.body.userid];
						suc = true;
					} else {
						sendResponse(res, false, "Keine Berechtigung!");
					}
				} else {
					parameter = [req.session.userid];
					suc = true;
				}

				if (suc) {
					db.query('SELECT id, firstname, lastname, email, active, admin from users where id=?', parameter, function (err, rows, fields) {
						if (err) throw err;

						if (rows.length == 0) {
							sendResponse(res, false, "Benutzer nicht gefunden!");
						} else {
							var user = rows[0];

							user.isloggedinUser = !req.body.userid || req.body.userid == req.session.userid;

							sendResponse(res, true, "", user);
						}
					});
				}
			}
			else {
				//res.end();
				sendResponse(res, false, "Kein Benutzer eingeloggt!");
			}
		}); //end userinfo


		app.post('/user/update', function (req, res) {

			if (req.session.userid && (!req.body.userid || req.body.userid == req.session.userid || req.session.admin)) {
				var suc = false;
				var message = "";
				var update = "";
				var parameters = [];
				var userid = req.session.userid;

				if (req.body.userid) {
					userid = req.body.userid;
				}


				if (req.body.firstname == null || req.body.firstname == "") {
					message = "Bitte Vorname eingeben!";

				} else if (req.body.lastname == null || req.body.lastname == "") {
					message = "Bitte Nachname eingeben!";

				} else if (req.body.password != null && req.body.password != "" && req.body.password2 != "") {
					if (req.body.password == req.body.password2) {
						suc = true;
						var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
						update = 'UPDATE users SET firstname=?, lastname=?, passwort=?, admin=?, active=? where id=?';
						parameters = [req.body.firstname, req.body.lastname, hash, req.body.admin == 1, req.body.active == 1, userid];
					} else {
						message = "Passwörter müssen übereinstimmen!";
					}

				} else {
					suc = true;
					update = 'UPDATE users SET firstname=?, lastname=?, admin=?, active=? where id=?';
					parameters = [req.body.firstname, req.body.lastname, req.body.admin == 1, req.body.active == 1, userid];
				}



				if (suc) {
					db.query(update, parameters, function (err, result, fields) {
						if (err) {
							message = "Fehler mit DB";
							sendResponse(res, false, message);
						} else {
							sendResponse(res, true, "Daten wurden gespeicher!");
						}

					});

				} else {
					sendResponse(res, false, message);
				}
			} else {
				sendResponse(res, false, "Keine Berechtigung!");
			}



		}); //end userupdate


		app.post('/user/save', function (req, res) {

			if (req.session.admin) {
				var suc = false;
				var message = "";

				if (req.body.firstname == null || req.body.firstname == "") {
					message = "Bitte Vorname eingeben!";
				} else if (req.body.lastname == null || req.body.lastname == "") {
					message = "Bitte Nachname eingeben!";
				} else if (req.body.email == null || req.body.email == "") {
					message = "Bitte gültige E-Mail eingeben!";
				} else if (req.body.password == null || req.body.password == "" || req.body.password2 == "" || req.body.password != req.body.password2) {
					message = "Bitte zweimal das gleiche Passwort eingeben!";
				} else {
					suc = true;
				}



				if (suc) {

					db.query('SELECT email from users where email=?', [req.body.email], function (emerr, emrows, emfields) {
						if (emerr) {
							sendResponse(res, false, "Fehler mit DB");
						} else {
							if (emrows.length > 0) {
								sendResponse(res, false, "Email schon vorhanden!");
							} else {
								var hash = crypto.createHash('sha256').update(req.body.password).digest('base64');
								var query = "INSERT INTO users (firstname, lastname, email, passwort, admin, active) VALUES (?,?,?,?,?,?)";
								var parameters = [req.body.firstname, req.body.lastname, req.body.email, hash, req.body.admin == 1, req.body.active == 1];


								db.query(query, parameters, function (err, result, fields) {
									if (err) {
										message = "Fehler mit DB";
										sendResponse(res, false, message);
									} else {
										sendResponse(res, true, "Daten wurden gespeicher!");
									}

								});
							}
						}
					});
				} else {
					sendResponse(res, false, message);
				}
			} else {
				sendResponse(res, false, "Keine Berechtigung!");
			}



		}); //end usersave



	}//end setup-function
};// end module export