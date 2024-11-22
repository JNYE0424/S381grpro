const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Anime = require('./models/anime_data');
const User = require('./models/user_data')
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcrypt');


const uri = 'mongodb+srv://JNYE:jason95291995@cluster0.7ajdc.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key', // Change this to a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));


async function main() {
    await mongoose.connect(uri);
    console.log('Mongoose Connected!')
}


async function connectToDatabase() {
        await client.connect();
        console.log('Connected to MongoDB');
}

connectToDatabase();

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { userName, userPassword } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = new User({ userName, userPassword: hashedPassword });
    await newUser.save();
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    const { userName, userPassword } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
        console.log('User not found:', userName);
        return res.status(401).send('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(userPassword, user.userPassword);
    if (isMatch) {
        req.session.userId = user._id; 
        res.redirect('/database');
    } else {
        console.log('Password does not match for user:', userName);
        res.status(401).send('Invalid username or password');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.redirect('/login');
    });
});


app.get('/database', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login'); // Redirect if not logged in
    }

    try {
        const animeList = await Anime.find(); // Fetch all anime entries from the database
        res.render('animeDataWeb', { data: animeList }); // Render the view with anime data
    } catch (error) {
        console.error('Error fetching anime data:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.post('/database/add', async (req, res) => {
    const animeInfo = new Anime ({animeName: req.body.createName,
    originalRun: req.body.createOriginalRun,
    director: req.body.createDirector, 
    language: req.body.createLanguage, 
    studio: req.body.createStudio,
    episodes: req.body.createEpisodes,
    genre: req.body.createGenre,
    cartoonist: req.body.createCartoonist});

    await animeInfo.save();
    res.redirect('/database');
});

app.post('/database/delete', async (req, res) => {
    const { animeName } = req.body;
    const result = await Anime.deleteOne({ animeName });
    res.redirect('/database');
});

app.post('/database/update', async (req, res) => {
    const { id, animeName, originalRun, language, studio, director, episodes, genre, cartoonist } = req.body;

    const updatedAnime = await Anime.findByIdAndUpdate(id, {
        animeName,
        originalRun,
        language,
        studio,
        director,
        episodes,
        genre,
        cartoonist
    }, { new: true, runValidators: true });

    res.redirect('/database'); // Redirect upon success
});

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

main()
    .then(console.log('Insert Data'))
    .catch((err) => console.log(err))
    .finally()
