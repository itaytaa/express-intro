const express = require('express')        // retriving express module
const app = express()                     // using express function in a veriable
const bodyParser = require('body-parser') // module for reading json
const port = 3000                         // port we will use 
const users = [];                         // empty array to fill with users 
let counter = 1;                          // counter for adding Id to each user

app.use(bodyParser.urlencoded({ extended: false }))   // in-order for using body-parser
app.use(bodyParser.json())


app.post('/user/login', (req, res) => {
    const { username, password } = req.body;
    const requestedUser = users.find(user => (username === user.username && password === user.password))
    if (requestedUser) {
        res.status(200).send('Login successfully')
    } else {
        res.status(403).send('Login failed')
    }
})

app.put('/user', (req, res) => {
    // const username= req.body.username;
    // const password= req.body.password;
    const { username, password } = req.body;  //shorter way {Destructuring i ES6}
    if (!username || !password) {
        res.status(400).send('Incorrect body')
        return;
    }
    if (username.length < 3 || password.toString().length < 6) {
        res.status(400).send('Incorrect body')
        return;
    }
    const newUser = {
        id: counter,
        username,
        password
    };
    counter++;
    users.push(newUser)
    res.sendStatus(201)
})

app.get('/user', (req, res) => {
    res.send(users)
})

app.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id)
    const requestedUser = users.find(user => user.id === userId)
    if (!requestedUser) {
        res.status(404).send('user not found')
        return;
    }
    res.send(requestedUser)

});

app.delete('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id)
    const requestedUser = users.find(user => user.id === userId)
    if (!requestedUser) {
        res.status(404).send(`user not found`)
        return;
    }
    users.splice(users.indexOf(requestedUser), 1);
    res.sendStatus(204);  /// 204 Won’t Return Content
});

app.post('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id)
    const requestedUser = users.find(user => user.id === userId)
    if (!requestedUser) {
        res.status(404).send(`user not found`)
        return;
    }
    const { username, password } = req.body;
    if (!password) {              // if ONLY username is what we want to update
        if (!username.length >= 3) {    // if the value length isn't >= 3 
            res.sendStatus(400).send('Username must contain 3 letters or more ')
        } else {                 //if username length is correct :
            changeUsername(requestedUser, username)
            res.status(200).send(`username was changed`)
        }
    }
    if (!username) {             // if ONLY password is what we want to update
        if (!(password.toString().length >= 6)) {    // if the value length isn't >= 6
            res.status(400).send('password must contain 3 letters or more')
        } else {                 //if password length is correct :
            changePassword(requestedUser, password)
            res.status(200).send(`password was changed`)
        }
    }
    if (username && password) {      //if we want to change both :
        if (!(password.toString().length >= 6) || !(username.length >= 3)) {  //if one of them is incorrect:
            res.status(400).send('Incorrect body')
        } else {                       //if both are correct :
            changePassword(requestedUser, password)
            changeUsername(requestedUser, username)
            res.status(200).send(`user was changed`)
        }
    }
})




function changePassword(user, password) {
    users[users.indexOf(user)].password = password
}
function changeUsername(user, username) {
    users[users.indexOf(user)].username = username
}

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})