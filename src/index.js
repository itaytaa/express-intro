const express = require('express')        // retriving express module
const app = express()                     // using express function in a veriable
const bodyParser = require('body-parser') // module for reading json
const port = 3000                         // port we will use 
const users = [];                         // empty array to fill with users 
let counter = 1;                        // counter for adding Id to each user 
const photos = [];                       // empty array to fill with photos
let PhotosCounter = 1;                      // counter for adding Id to each photo  

app.use(bodyParser.urlencoded({ extended: false }))   // in-order for using body-parser
app.use(bodyParser.json())

// LOGIN //

app.post('/user/login', (req, res) => {
    const { username, password } = req.body;
    const requestedUser = users.find(user => (username === user.username && password.toString() === user.password))
    if (requestedUser) {
        res.status(200).send('Login successfully')
    } else {
        res.status(403).send('Login failed')
    }
})

// CREATE USER //

app.put('/user', (req, res) => {
    // const username= req.body.username;
    // const password= req.body.password;
    const { username, password } = req.body;  //shorter way {Destructuring i ES6}
    if (!username || !password) {
        res.status(400).send('Incorrect body')
        return;
    }
    if (username.length < 3 || password.length < 6) {
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


// GET ALL USERS //

app.get('/user', (req, res) => {
    res.send(users)
})

// GET USER BY ID //

app.get('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id)
    const requestedUser = users.find(user => user.id === userId)
    if (!requestedUser) {
        res.status(404).send('user not found')
        return;
    }
    res.send(requestedUser)

});

// DELETE USER BY ID //

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

// EDIT USER BY ID //

app.post('/user/:id', (req, res) => {
    const userId = parseInt(req.params.id)
    const requestedUser = users.find(user => user.id === userId)
    if (!requestedUser) {   //Checking if exist
        res.status(404).send(`user not found`)
        return;
    }
    const { username, password } = req.body;
    if (username) {
        if (!username.length >= 3) {    // if the value length isn't >= 3 
            res.sendStatus(400).send('Username must contain 3 letters or more ')
        } else {                 //if username length is correct :
            users[users.indexOf(requestedUser)].username = username

        }
    }
    if (password) {
        if (!(password.toString().length >= 6)) {    // if the value length isn't >= 6
            res.status(400).send('password must contain 3 letters or more')
        } else {                 //if password length is correct :
            users[users.indexOf(requestedUser)].password = password

        }
    }
    res.status(200).send(`username was changed`)

})



//// insert image file


app.put('/photo', (req, res) => {
    const { title, filename } = req.body;
    if (!title || !filename) {
        res.status(400).send('Incorrect body')
        return;
    }
    /// if file-name doesnt include jpg png or jpeg than return error msg
    if (!isImage(filename)) {
        res.status(400).send('Incorrect image type')
        return
    }
    const newPhoto = {
        id: PhotosCounter,
        title,
        filename
    };
    PhotosCounter++
    photos.push(newPhoto)
    res.sendStatus(201)

})
// function that  checks if "filsname" is image file 

function isImage(filename) {
    let arr = ["jpg", "png", "jpeg"]
    let type = filename.split('.')[1]
    if (!type){
        return false
    }
    var value = 0;
    arr.forEach((word) => {
        value = value + type.includes(word);
    });
    return (value === 1)
}


// Get all images files 
app.get('/photo', (req, res) => {
    res.send(photos)
})


// Get single photo file by id 

app.get('/photo/:id', (req, res) => {
    const photoId = parseInt(req.params.id)
    const requestedPhoto = photos.find(photo => photo.id === photoId)
    if (!requestedPhoto) {
        res.status(404).send('photo not found ')
        return
    }
    res.send(requestedPhoto)
})

// delete image file by id 

app.delete('/photo/:id', (req, res) => {
    const photoId = parseInt(req.params.id)
    const requestedPhoto = photos.find(photo => photo.id === photoId)
    if (!requestedPhoto) {
        res.status(404).send('photo not found')
    }
    photos.splice(photos.indexOf(requestedPhoto), 1)
    res.sendStatus(204)

})
// edit image file by id 

app.post('/photo/:id', (req, res) => {
    const photoId = parseInt(req.params.id)
    const requestedPhoto = photos.find(photo => photo.id === photoId)
    if (!requestedPhoto) {
        res.status(404).send('photo not found')
    }
    const { title, filename } = req.body;
    if (!isImage(filename)) {
        res.status(400).send('Incorrect image type')
        return
    }
    if (title.length < 1) {
        res.status(400).send('title should include 1 or more characters')
        return
    }
    photos[photos.indexOf(requestedPhoto)].title = title;
    photos[photos.indexOf(requestedPhoto)].filename = filename;
    res.status(200).send(`image details were edited`)
})




app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})