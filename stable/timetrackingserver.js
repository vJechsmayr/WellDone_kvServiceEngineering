module.exports = {
    setup: function (app, db, session, toDate, sendResponse) {

        app.get('/timetracking/info', function (req, res) {

            if (req.session.userid) {
                var query = "SELECT a.id, a.title as acttitle, p.title as pjtitle  FROM activity a \
                               JOIN projects p ON a.projectid=p.id \
                                WHERE a.responsibleUser=?";

                var parameters = [req.session.userid];


                db.query(query, parameters, function (err, rows, fields) {
                    if (err) throw err;

                    var result = {
                        activities: rows

                    };


                    sendResponse(res, true, "", result);



                });
            } else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });//end app.post(timetracking/info)

        app.post('/timetracking/save', function (req, res) {

            if (req.session.userid) {


                var query = "SELECT id FROM timetracking WHERE ((TIME(?) between timefrom and timeto) OR \
                             (TIME(?) between timefrom and timeto)) AND DATE(day)=DATE(?)";
                var parameters = [toDate(req.body.start), toDate(req.body.end), toDate(req.body.date)];

                db.query(query, parameters, function (checkerr, checkres, checkfields) {
                    if (checkerr) {
                        sendResponse(res, false, "Fehler mit DB");
                    } else {

                        if (checkres.length > 0) {
                            sendResponse(res, false, "Zeiteintrag nicht möglich! Überschneidung vorhanden!");
                        } else {

                            db.query("INSERT INTO timetracking (userid, day, timefrom, timeto, activityid) VALUES (?,?,?,?,?)",
                                [req.session.userid, toDate(req.body.date), toDate(req.body.start), toDate(req.body.end), req.body.activityid], function (err, result, fields) {
                                    if (err) {
                                        sendResponse(res, false, "Fehler mit DB");
                                    } else {

                                        sendResponse(res, true, "Daten wurden gespeicher!");
                                    }

                                });
                        }
                    }

                });



            } else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }
        });//end app.post(timetracking/save)

        app.post('/timetracking/loadtimes', function (req, res) {

            if (req.session.userid) {


                var query = "SELECT t.timefrom, t.timeto, a.title as acttitle, p.title as projecttitle \
                            FROM timetracking t \
                            JOIN activity a ON a.id=t.activityid \
                            JOIN projects p ON p.id=a.projectid \
                            WHERE DATE(t.day)=DATE(?) AND t.userid=? \
                            ORDER BY t.timefrom";
                var parameters = [toDate(req.body.date), req.session.userid];

                db.query(query, parameters, function (err, rows, fields) {
                    if (err) {
                        sendResponse(res, false, "Fehler mit DB");
                    } else {

                        sendResponse(res, true, "", rows);
                    }

                });



            } else {
                sendResponse(res, false, "Kein Benutzer eingeloggt!");
            }

        });


    }//end setup-function
};