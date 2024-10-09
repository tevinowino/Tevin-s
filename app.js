var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Fetch function

let spoonacularapikey = 'a92063cd1f834591bd6f74d9e90e4d97';
let openbreweryurl = 'https://api.openbrewerydb.org/v1/breweries?per_page=6';

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

//Routes
app.get('/', async (req, res) => {
   const reviews = [
    { name: 'John Doe', text: 'Best burgers in town! The flavors are out of this world.' },
    { name: 'Jane Smith', text: 'Great atmosphere and even better food. Highly recommend!' },
    { name: 'Mike Johnson', text: 'The service is top-notch and the burgers are always cooked to perfection.' }
  ]

  try {
    let data = await fetchData(`https://api.spoonacular.com/recipes/random?apiKey=${spoonacularapikey}&number=6`);
    res.render('home', { title: 'Food', recipes: data.recipes, reviews: reviews });
  } catch (error) {
    res.render('error', { message: 'Failed to fetch food data', error });
  }

});
app.get('/about', (req, res) => {
  res.render('about', { title: 'about' });
})
app.get('/blog', (req, res) => {
  res.render('blog', { title: 'blog' });
})
app.get('/events', (req, res) => {
  res.render('events', { title: 'Events' });
})
app.get('/gallery', (req, res) => {
  res.render('gallery', { title: 'gallery' });
})
app.get('/services', (req, res) => {
  res.render('services', { title: 'services' });
})


app.get('/food', async (req, res) => {
  try {
    // Fetch random recipes from Spoonacular API
    let data = await fetchData(`https://api.spoonacular.com/recipes/random?apiKey=${spoonacularapikey}&number=30`);

    // You can classify the recipes based on their types or manually set some categories.
    // Let's assume each recipe has a `dishTypes` property that tells us the type of recipe.
    
    // For example purposes, we'll classify them:
    let recipes = data.recipes.map(recipe => ({
      name: recipe.title,
      image: recipe.image,
      description: recipe.summary,
      price: Math.random() * 10 + 10, // Assign a random price for demonstration
      category: recipe.dishTypes.includes('main course') ? 'Main Courses' : (
        recipe.dishTypes.includes('salad') ? 'Salads' : (
          recipe.dishTypes.includes('dessert') ? 'Desserts' : 'Appetizers')),
      isSpecial: Math.random() > 0.8, // Randomly flag some as specials
      isSeasonal: Math.random() > 0.5, // Randomly flag some as seasonal
      winePairing: 'Chardonnay', // Example wine pairing
      dietaryInfo: recipe.diets // Example dietary info (vegetarian, vegan, etc.)
    }));

    res.render('food', { 
      title: 'Food Menu',
      recipes: recipes 
    });
  } catch (error) {
    res.render('error', { message: 'Failed to fetch food data', error });
  }
});

app.get('/drinks', async (req, res) => {
  try {
    let drinksData = await fetchData(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Alcoholic&number=10`);
    let drinks = drinksData.drinks.slice(0, 10);
    let breweries = await fetchData(openbreweryurl);
    console.log(drinks);
    res.render('drinks', { title: 'Drinks', drinks: drinks , breweries: breweries});
  } catch (error) {
    res.render('error', { message: 'Failed to fetch drinks data', error });
  }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//Server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = app;
