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


const uri = 'mongodb+srv://JNYE:jason95291995@cluster0.7ajdc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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

function isAuthenticated(req, res, next) {
    if (!req.session.userId) {
    	return res.redirect('/login'); // Redirect if not logged in
    }
    next();
}

app.get('', (req, res) => {
    res.redirect('/login');
});

app.post('', (req, res) => {
    res.redirect('/login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { userName, userPassword } = req.body;
    const hashedPassword = await bcrypt.hash(userPassword, 10);
    const newUser = new User({ userName, userPassword: hashedPassword });
    let user = await newUser.save();
    console.log("Added user: " + user);
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
        console.log(`User ${userName} has logged in`);
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

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Could not log out');
        }
        res.redirect('/login');
    });
});


app.get('/database', isAuthenticated, async (req, res) => {
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


app.post('/database/add', isAuthenticated, async (req, res) => {
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

app.post('/database/delete', isAuthenticated, async (req, res) => {
    const { animeName } = req.body;
    const result = await Anime.deleteOne({ animeName });
    res.redirect('/database');
});

app.post('/database/update', isAuthenticated, async (req, res) => {
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

/* RESTful */

//add new anime
app.post('/database/anime', async (req, res) => {
    try {
		const {
		animeName,
		originalRun,
		language,
		studio,
		director,
		episodes,
		genre,
		cartoonist
		} = req.body;

		const newAnime = new Anime({
		animeName,
		originalRun,
		language,
		studio,
		director,
		episodes,
		genre,
		cartoonist,
		});

		const anime = await newAnime.save();

		res.status(200).json({message: 'Successfully added Anime', data: anime});
		} catch (error) {
		res.status(500).json({message: 'Error occurred when adding', error: error.message});
    }
  }
);
/* Dynamic RESTful (gave up impmenenting, you can try if you want to)
app.get('/database/anime', async (req, res) => {
	try {
		const { animeName,
				originalRun,
				language,
				studio,
				director,
				episodes,
				genre,
				cartoonist
				} = req.query;
		let query = {};
		if (animeName)
			query.animeName = animeName;
		if (originalRun)
			query.originalRun = originalRun;
		if (language)
			query.language = language;
		if (studio)
			query.studio = studio;
		if (director)
			query.director = director;
		if (episodes)
			query.episodes = episodes;
		if (genre)
			query.genre = genre;
		if (cartoonist)
			query.cartoonist = cartoonist;
			
		const results = await Anime.find(query);
		const results = await Anime.find();
		if (results.length != 0) 
			res.status(200).json({'Search Results:': results});
		else
			res.status(404).json({error: 'No result found'});
	} catch (error) {
		res.status(500).json({ message: 'Error occured when searching', error: error.message});
	}
});

app.get('/database/anime/:keyValuePairs*', async (req, res) => {
    try {
        const keyValuePairs = req.params.keyValuePairs;

        let query = {};
        if (keyValuePairs) {
            const pairs = keyValuePairs.split('/');
			console.log(`keyValuePairs: ${keyValuePairs}\npairs: ${pairs}`);
            if (pairs.length % 2 !== 0) {
                return res.status(400).json({ error: 'Invalid key-value pair format in the URL' });
            }

            for (let i = 0; i < pairs.length; i += 2) {
                const key = pairs[i];
                const value = pairs[i + 1];
                query[key] = value;
            }
        }

        const results = await Anime.find(query);

        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'An error occurred while searching', error: error.message });
    }
});
*/

// retrieve by animeName
app.get('/database/anime/animeName/:animeName', async (req, res) => {
    try {
        const { animeName } = req.params;
        const results = await Anime.find({ animeName });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for animeName' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// retrieve by originalRun
app.get('/database/anime/originalRun/:originalRun', async (req, res) => {
    try {
        const { originalRun } = req.params;
        const results = await Anime.find({ originalRun });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for originalRun' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// retrieve by director
app.get('/database/anime/director/:director', async (req, res) => {
    try {
        const { director } = req.params;
        const results = await Anime.find({ director });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for director' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// retrieve by language
app.get('/database/anime/language/:language', async (req, res) => {
    try {
        const { language } = req.params;
        const results = await Anime.find({ language });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for language' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// retrieve by episodes
app.get('/database/anime/episodes/:episodes', async (req, res) => {
    try {
        const { episodes } = req.params;
        const results = await Anime.find({ episodes });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for episodes' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// retrieve by studio
app.get('/database/anime/studio/:studio', async (req, res) => {
    try {
        const { studio } = req.params;
        const results = await Anime.find({ studio });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for studio' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// retrieve by genre
app.get('/database/anime/genre/:genre', async (req, res) => {
    try {
        const { genre } = req.params;
        const results = await Anime.find({ genre });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for genre' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// retrieve by cartoonist
app.get('/database/anime/cartoonist/:cartoonist', async (req, res) => {
    try {
        const { cartoonist } = req.params;
        const results = await Anime.find({ cartoonist });
        if (results.length > 0) {
            res.status(200).json({ 'Search Results': results });
        } else {
            res.status(404).json({ error: 'No results found for cartoonist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error occurred while searching', error: error.message });
    }
});

// update

app.put('/database/anime/id/:id', async (req, res) => {
    try {
    	const { id } = req.params;
        const {
        	animeName,
            originalRun,
            language,
            studio,
            director,
            episodes,
            genre,
            cartoonist
        } = req.body; 
		
		const updatedAnime = await Anime.findByIdAndUpdate( id, {
		    animeName,
		    originalRun,
		    language,
		    studio,
		    director,
		    episodes,
		    genre,
		    cartoonist
		}, { new: true, runValidators: true });

        res.status(200).json({ message: "Successfully updated", updatedAnime });
    } catch (error) {
        res.status(500).json({ message: 'Error occurred when updating', error: error.message });
    }
});

//delete by animeName
app.delete('/database/anime/animeName/:animeName', async (req, res) => {
	try {
		const result = await Anime.deleteOne({ animeName: req.params.animeName });
		res.status(200).json({message: "Successfully deleted", data: result})
	} catch (error) {
		res.status(500).json({message: 'Error occured when deleting', error: error.message});
	}
});

//Default route
app.get('/', (req, res) => {
    if (req.session.userId) {
        res.redirect('/database');
    } else {
        res.redirect('/login');
    }
});

//Error route
app.use((req, res) => {
	res.status(404).send('Page Not Found');
});

const server = app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

main()
    .then(console.log('Insert Data'))
    .catch((err) => console.log(err))
    .finally()
