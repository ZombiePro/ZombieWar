/**
 * Created by tomasj on 29/01/14.
 */



function login(req, res) {
    if (req.body.email != null) {
        // TODO: check if user in mongo
    }
};


function setup(app) {
    app.post('/login', express.bodyParser(), createUser);
}

module.exports = setup