module.exports = {
    setup: function (app, db, session, toDate, sendResponse) {

        //Aktivitätsübersicht
        app.post('/activities/get', function (req, res) {

            if (req.session.userid) {
                var query = "select a.id, a.title, u.firstname, u.lastname, a.start, a.end, s.title as astatus, t.title as atype, p.title as project \
                    from activity a \
                    JOIN users u ON a.responsibleUser=u.id \
                    JOIN activitystatus s ON a.activitystatus=s.id \
                    JOIN activitytype t ON a.activitytype=t.id \
                    JOIN projects p ON a.projectid=p.id";

                var typequery = "SELECT id, title, headline from activitytype where id=?";

                var parameters = [];

                var typeparameters = [req.body.activitytype];

                var showuseractivities = req.body.showuseractivities; //true = nur user, false = alle activities

                if (showuseractivities) {
                    query += ' where a.responsibleUser=? and a.activitytype=?';

                    parameters = [req.session.userid, req.body.activitytype];
                } else {
                    query += ' where a.activitytype=?';

                    parameters = [req.body.activitytype];
                }

                db.query(query, parameters, function (err, rows, fields) {
                    if (err) throw err;

                    db.query(typequery, typeparameters, function (typeerr, typerows, typefields) {
                        if (typeerr) throw typeerr;

                        var result = {
                            activities: rows,
                            type: typerows[0]
                        };


                        sendResponse(res, true, "", result);
                    });


                });
            } else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });//end app.post(activities/get)

        app.post('/activities/detail', function (req, res) {
            if (req.session.userid) {
                var query = "SELECT id, title, activitystatus, responsibleUser, start, end, description, previousid, projectid, activitytype, priority \
                                 FROM activity \
                                 WHERE id=?";
                var parameters = [req.body.activityid];
                var usrquery = "SELECT id, firstname, lastname from users order by lastname,firstname";
                var actstatquery = "SELECT id, title from activitystatus order by id";
                var acttypequery = "SELECT id, title, haspriority from activitytype order by id";
                var actquery = "SELECT id, title from activity order by projectid,start";
                var pjquery = "SELECT id, title from projects order by id";
                var prioquery = "SELECT id, title from priority order by id";
                var commentquery = "SELECT c.id, c.comment, c.created_at, u.firstname, u.lastname from activitycomments c \
                                        JOIN users u ON u.id=c.userid \
                                        WHERE activityid=? \
                                        ORDER BY c.created_at desc";

                db.query(query, parameters, function (err, rows, fields) {
                    if (err) throw err;

                    db.query(usrquery, function (usrerr, usrrows, usrfields) {
                        if (usrerr) throw usrerr;

                        db.query(actstatquery, function (aserr, asrows, asfields) {
                            if (aserr) throw aserr;

                            db.query(acttypequery, function (aterr, atrows, atfields) {
                                if (aterr) throw aterr;

                                db.query(actquery, function (aerr, arows, afields) {
                                    if (aerr) throw aerr;

                                    db.query(pjquery, function (pjerr, pjrows, pjfields) {
                                        if (pjerr) throw pjerr;

                                        db.query(prioquery, function (prierr, prirows, prifields) {
                                            if (prierr) throw prierr;

                                            db.query(commentquery, parameters, function (comerr, commrows, commfields) {
                                                if (comerr) throw comerr;

                                                var result = {
                                                    activity: rows[0],
                                                    users: usrrows,
                                                    status: asrows,
                                                    types: atrows,
                                                    previous: arows,
                                                    projects: pjrows,
                                                    priorities: prirows,
                                                    comments: commrows
                                                };
                                                sendResponse(res, true, "", result);

                                            });


                                        });
                                    });
                                });
                            });
                        });
                    });

                });


            } else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });

        app.post('/activities/update', function (req, res) {
            if (req.session.userid) {
                var suc = false;
                var message = "";
                var update = "";
                var parameters = [];

                if (req.body.id == null) {
                    message = "Keine Activity-ID übertragen!";
                } else if (req.body.title == null || req.body.title == "") {
                    message = "Bitte einen Aktivitäts-Titel eintragen!";
                } else if (req.body.status == null) {
                    message = "Bitte einen Aktivitäts-Status auswählen!";
                } else if (req.body.type == null) {
                    message = "Bitte einen Aktivitäts-Typ auswählen!";
                } else if (req.body.responsibleUser == null) {
                    message = "Bitte einen Verantwortlichen Mitarbeiter auswählen!";
                } else if (req.body.start == null) {
                    message = "Bitte ein Start-Datum auswählen!";
                } else if (req.body.end == null) {
                    message = "Bitte ein Ende-Datum auswählen!";
                } else if (req.body.projectid == null) {
                    message = "Bitte das zugehörige Projekt auswählen!";
                } else {
                    suc = true;
                }

                if (suc) {
                    db.query('UPDATE activity SET title=?, activitystatus=?, activitytype=?, responsibleUser=?, \
                                        start=?, end=?, projectid=?, description=?, previousid=? where id=?',
                        [req.body.title, req.body.status, req.body.type, req.body.responsibleUser, toDate(req.body.start),
                            toDate(req.body.end), req.body.projectid, req.body.description, req.body.previous, req.body.id],
                        function (err, result, fields) {
                            if (err) {
                                message = "Fehler mit DB";
                                sendResponse(res, false, message);
                            } else {
                                sendResponse(res, true, "Daten wurden gespeichert!");
                            }
                        });
                } else {
                    sendResponse(res, false, message);
                }
            } else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });


        app.post('/activities/addComment', function (req, res) {
            if (req.session.userid) {
                if (req.body.text != null && req.body.text != "") {
                    db.query('INSERT into activitycomments (comment, userid, activityid) VALUES (?,?,?)',
                        [req.body.text, req.session.userid, req.body.activityid],
                        function (err, result, fields) {
                            if (err) {
                                message = "Fehler mit DB";
                                sendResponse(res, false, message);
                            } else {
                                db.query("SELECT c.id, c.comment, c.created_at, u.firstname, u.lastname from activitycomments c \
                                        JOIN users u ON u.id=c.userid \
                                        WHERE activityid=? \
                                        ORDER BY c.created_at desc", [req.body.activityid], function (cerr, crows, cfields) {
                                        if (cerr) {
                                            message = "Fehler mit DB";
                                            sendResponse(res, false, message);
                                        } else {


                                            sendResponse(res, true, "Daten wurden gespeicher!", crows);
                                        }
                                    });

                            }

                        });

                } else {
                    sendResponse(res, false, "Bitte ein Kommentar einfügen!");
                }

            } else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }

        });



        //Daten laden für neues Aufgabe anlegen
        app.post('/activities/data', function (req, res) {
            if (req.session.userid) {

                var usrquery = "SELECT id, firstname, lastname from users order by lastname,firstname";
                var actstatquery = "SELECT id, title from activitystatus order by id";
                var acttypequery = "SELECT id, title from activitytype order by id";
                var actquery = "SELECT id, title from activity order by projectid,start";
                var pjquery = "SELECT id, title from projects order by id";


                db.query(usrquery, function (usrerr, usrrows, usrfields) {
                    if (usrerr) throw usrerr;

                    db.query(actstatquery, function (aserr, asrows, asfields) {
                        if (aserr) throw aserr;

                        db.query(acttypequery, function (aterr, atrows, atfields) {
                            if (aterr) throw aterr;

                            db.query(actquery, function (aerr, arows, afields) {
                                if (aerr) throw aerr;

                                db.query(pjquery, function (pjerr, pjrows, pjfields) {
                                    if (pjerr) throw pjerr;

                                    var result = {
                                        users: usrrows,
                                        status: asrows,
                                        types: atrows,
                                        previous: arows,
                                        projects: pjrows

                                    };
                                    sendResponse(res, true, "", result);
                                });
                            });
                        });
                    });
                });


            }
            else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });


        //Neues Projekt speichern
        app.post('/activities/save', function (req, res) {
            if (req.session.userid) {
                var suc = false;

                if (req.body.title == null || req.body.title == "") {
                    message = "Bitte einen Projekttitel eingeben!";

                } else if (req.body.responsibleUser == null) {
                    message = "Bitte einen Verantwortlichen auswählen!";

                } else if (req.body.status == null) {
                    message = "Bitte Projektstatus auswählen!";

                } else if (req.body.type == null) {
                    message = "Bitte Projekttyp auswählen!";
                } else if (req.body.start == null) {
                    message = "Bitte Start-Datum auswählen!";
                } else if (req.body.end == null) {
                    message = "Bitte Ende-Datum auswählen!";
                } else if (req.body.projectid == null) {
                    message = "Bitte zugehöriges Projekt auswählen!";
                } else {
                    suc = true;
                }


                if (suc) {
                    db.query('INSERT into activity (title, activitystatus, responsibleUser, start, end, description, previousid, projectid, activitytype) VALUES (?,?,?,?,?,?,?,?,?)',
                        [req.body.title, req.body.status, req.body.responsibleUser, toDate(req.body.start), toDate(req.body.end), req.body.description, req.body.previous, req.body.projectid, req.body.type],
                        function (err, result, fields) {
                            if (err) {
                                message = "Fehler mit DB";
                                sendResponse(res, false, message);
                            } else {
                                sendResponse(res, true, "Daten wurden gespeicher!", { activityid: result.insertId });
                            }

                        });

                } else {
                    sendResponse(res, false, message);
                }


            }
            else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }


        });

        //Anzeigen der ActivityTypes in der SideBar
        app.get('/activitytypes/get', function (req, res) {

            if (req.session.userid) {
                db.query('SELECT id, title, headline from activitytype', function (err, rows, fields) {
                    if (err) throw err;

                    sendResponse(res, true, "", rows);
                });
            }
            else {
                //res.end();
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        }); //end activitytypes/get   




    }  //end setup-function
};