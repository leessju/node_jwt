const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.get('/api', verifyToken, (req, res) => {
    res.json({
        message: 'Welcome to the API',
        headers: req.headers
    });
});

app.get('/api_test', (req, res) => {
    res.json({
        message: 'Welcome to the API Test',
        headers: req.headers
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secret_key', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'brad',
        email: 'brad@gmail.com'
    };

    //jwt.sign({user}, 'secret_key', (err, token) => {
    jwt.sign({user}, 'secret_key', { expiresIn: '30m' }, (err, token) => {
        res.json({
            token
        });
    });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>
// Verify Token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        // Set the token
        req.token = bearer[1];
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(404);
    }
}

app.listen(5000, () => console.log('Server started on port 5000'));

// app.post('/api/posts', (req, res) => {
//
//     const bearerHeader = req.headers['authorization'];
//
//     if(typeof bearerHeader !== 'undefined') {
//         const bearer = bearerHeader.split(' ');
//         const bearerToken = bearer[1];
//
//         jwt.verify(bearerToken, 'secret_key', (err, authData) => {
//             if(err) {
//                 res.sendStatus(403);
//             } else {
//                 res.json({
//                     message: 'Post created...',
//                     authData
//                 });
//             }
//         });
//
//     } else {
//         res.sendStatus(404);
//     }
// });




// public ActionResult Token()
// {
//     Dictionary<string, object> payload = new Dictionary<string, object>();
//     payload["id"] = 1;
//     payload["username"] = "brad";
//     payload["email"] = "brad@gmail.com";
//
//     //const string secret = "GQDstcKsx0NHjPOuXOYg5MbeJ1XT0uFiwDVvVBrk";
//     const string secret = "secret_key";
//
//     IJwtAlgorithm algorithm = new HMACSHA256Algorithm();
//     IJsonSerializer serializer = new JsonNetSerializer();
//     IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
//     IJwtEncoder encoder = new JwtEncoder(algorithm, serializer, urlEncoder);
//
//     var token = encoder.Encode(payload, secret);
//
//     //string json = JsonConvert.SerializeObject(token);
//     return Content("{\"token\": \"" + token + "\" }", "application/json", System.Text.Encoding.UTF8);
//
//     //return Content(JsonConvert.SerializeObject(payload), "application/json", System.Text.Encoding.UTF8);
// }
//
// public ActionResult Decode()
// {
//     const string token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJicmFkIiwiZW1haWwiOiJicmFkQGdtYWlsLmNvbSJ9.iMAPqFvOWEcUOojqYVqDGNSsm4ui3p5vuemnOGShvV4";
//     const string secret = "secret_key";
//
//     try
//     {
//         IJsonSerializer serializer = new JsonNetSerializer();
//         IDateTimeProvider provider = new UtcDateTimeProvider();
//         IJwtValidator validator = new JwtValidator(serializer, provider);
//         IBase64UrlEncoder urlEncoder = new JwtBase64UrlEncoder();
//         IJwtDecoder decoder = new JwtDecoder(serializer, validator, urlEncoder);
//
//         var json = decoder.Decode(token, secret, verify: true);
//         return Content(json, "application/json", System.Text.Encoding.UTF8);
//     }
//     catch (TokenExpiredException)
//     {
//         Console.WriteLine("Token has expired");
//         return Content("{\"token\": \"" + "" + "\" }", "application/json", System.Text.Encoding.UTF8);
//     }
//     catch (SignatureVerificationException)
//     {
//         return Content("{\"token\": \"" + "" + "\" }", "application/json", System.Text.Encoding.UTF8);
//     }
//
//     //string json = JsonConvert.SerializeObject(token);
//
//
//     //return Content(JsonConvert.SerializeObject(payload), "application/json", System.Text.Encoding.UTF8);
// }