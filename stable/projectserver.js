module.exports = {
    setup: function (app, db, session, toDate, sendResponse) {

        //Projektübersicht
        app.post('/projects/get', function (req, res) {


            if (req.session.userid) {
                var query = "SELECT p.id, p.title, p.start, p.end, p.owner, u.firstname as ownerfirstname, u.lastname as ownerlastname, s.title as status, t.title as type \
                            from projects p \
                            JOIN users u ON p.owner=u.id \
                            JOIN projectstatus s on p.status=s.id \
                            JOIN projecttypes t on p.type=t.id";
                var parameters = [];
                var showuserprojects = req.body.showuserprojects; //True = nur user, false = alle projekte


                if (showuserprojects) {
                    query += ' where p.owner=?';
                    parameters = [req.session.userid];
                }

                db.query(query, parameters, function (err, rows, fields) {
                    if (err) throw err;

                    sendResponse(res, true, "", rows);
                });

            }
            else {
                //res.end();
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }


        });

        //Projektdetail Ansicht
        app.post('/projects/detail', function (req, res) {
            if (req.session.userid) {
                var query = "SELECT p.id, p.title, p.start, p.end, p.owner, p.status, t.title as type \
                            from projects p \
                            JOIN projecttypes t on p.type=t.id \
                            where p.id=?";
                var usrquery = "SELECT id, firstname, lastname from users order by lastname,firstname";
                var actquery = "SELECT a.title, u.firstname, u.lastname, s.title as status, t.title as type, a.start, a.end from activity a\
                                JOIN users u ON a.responsibleUser=u.id \
                                JOIN activitystatus s ON a.activitystatus=s.id \
                                JOIN activitytype t ON a.activitytype=t.id \
                                where a.projectid=?";

                var pjstatquery = "SELECT id, title from projectstatus order by id";

                var parameters = [req.body.projectid];

                db.query(query, parameters, function (err, rows, fields) {
                    if (err) throw err;

                    db.query(usrquery, function (usererr, userrows, userfields) {
                        if (usererr) throw usererr;

                        db.query(pjstatquery, function (pjstaterr, pjstatrows, pjstatfields) {
                            if (pjstaterr) throw pjstaterr;

                            db.query(actquery, parameters, function (acterr, actrows, actfields) {
                                if (acterr) throw acterr;

                                var result = {
                                    project: rows[0],
                                    users: userrows,
                                    status: pjstatrows,
                                    activities: actrows
                                };

                                sendResponse(res, true, "", result);

                            });

                        });

                    });

                });
            }
            else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });

        //Projekt editieren
        app.post('/projects/update', function (req, res) {
            if (req.session.userid) {
                var suc = false;
                var message = "";
                var update = "";
                var parameters = [];


                if (req.body.id == null) {
                    message = "Keine ProjektID übertragen!";

                } else if (req.body.title == null || req.body.title == "") {
                    message = "Bitte einen Projekttitel eingeben!";

                } else if (req.body.owner == null) {
                    message = "Bitte Projektleiter auswählen!";

                } else if (req.body.status == null) {
                    message = "Bitte Projektstatus auswählen!";

                } else if (req.body.start == null) {
                    message = "Bitte Start-Datum auswählen!";
                } else if (req.body.end == null) {
                    message = "Bitte Ende-Datum auswählen!";
                } else {
                    suc = true;
                }



                if (suc) {
                    db.query('UPDATE projects SET title=?, owner=?, status=?, start=?, end=? where id=?',
                        [req.body.title, req.body.owner, req.body.status, toDate(req.body.start), toDate(req.body.end), req.body.id],
                        function (err, result, fields) {
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

            }
            else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });

        //Daten laden für neues Projekt anlegen
        app.post('/projects/data', function (req, res) {
            if (req.session.userid) {
                var typequery = "SELECT id, title from projecttypes order by id";
                var usrquery = "SELECT id, firstname, lastname from users order by lastname,firstname";
                var pjstatquery = "SELECT id, title from projectstatus order by id";

                db.query(typequery, function (typeerr, typerows, typefields) {
                    if (typeerr) throw typeerr;

                    db.query(usrquery, function (usererr, userrows, userfields) {
                        if (usererr) throw usererr;

                        db.query(pjstatquery, function (pjstaterr, pjstatrows, pjstatfields) {
                            if (pjstaterr) throw pjstaterr;

                            var result = {
                                types: typerows,
                                users: userrows,
                                status: pjstatrows
                            };

                            sendResponse(res, true, "", result);
                        });

                    });

                });
            }
            else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });


        //Neues Projekt speichern
        app.post('/projects/save', function (req, res) {
            if (req.session.userid) {
                var suc = false;

                if (req.body.title == null || req.body.title == "") {
                    message = "Bitte einen Projekttitel eingeben!";

                } else if (req.body.owner == null) {
                    message = "Bitte Projektleiter auswählen!";

                } else if (req.body.status == null) {
                    message = "Bitte Projektstatus auswählen!";

                } else if (req.body.type == null) {
                    message = "Bitte Projekttyp auswählen!";
                } else if (req.body.start == null) {
                    message = "Bitte Start-Datum auswählen!";
                } else if (req.body.end == null) {
                    message = "Bitte Ende-Datum auswählen!";
                } else {
                    suc = true;
                }

                if (suc) {
                    db.query('INSERT into projects (title, owner, status, type, start, end) VALUES (?,?,?,?,?,?)',
                        [req.body.title, req.body.owner, req.body.status, req.body.type, toDate(req.body.start), toDate(req.body.end)],
                        function (err, result, fields) {
                            if (err) {
                                message = "Fehler mit DB";
                                sendResponse(res, false, message);
                            } else {
                                sendResponse(res, true, "Daten wurden gespeicher!", { projectid: result.insertId });
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

    }
};