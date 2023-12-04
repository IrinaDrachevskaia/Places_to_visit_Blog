import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

function findPlaceIdByName(name) {
  for (var i = 0; i < places.length; i++) {
    if (places[i].place_name === name) {
      return i;
    }
  }
  return null; 
}

var places = [{"image": "/images/hever.jpg",
"place_name": "Hever Castle",
"description": "Set in 125 acres of glorious grounds, Hever Castle was once the childhood home of Anne Boleyn. During your visit you will discover award-winning gardens and a rich and varied history.",
"full_description": "Beautiful and richly planted, the grounds include a 110m-long herbaceous border, a Tudor garden, yew maze, rose garden and water maze with hidden surprises. The four-acre Italian garden has classical statues, a pergola, colonnade and fountains. You can also take a walk around the ornamental lake, where wildlife and meadow flowers thrive.",
"comments": [{"autor": "Irina", "comment": "It's a beatiful place. Recommend it to visit."}]}, 
            {"image": "/images/leeds.jpg",
          "place_name": "Leeds Castle",
        "description": "Leeds Castle offers a vast array of exciting events throughout the year. Whether you’re seeking thrilling activities, cultural enrichment, or simply a day out with family and friends, there’s something for everyone at this magnificent castle and its idyllic grounds.",
        "full_description": "There are so many things to do at Leeds Castle and it’s more than just a great day out. We are the perfect spot for a romantic break or weekend getaway too, a place of contrasts from thrilling experiences to tranquil escape and quiet reflection. With your ticket you can enjoy all we have to offer at your leisure, with a whole year to explore this unique chapter in the story of historic England. Whether you’re a couple proposing or a history buff exploring, or a lover of wildlife wandering, what you do is up to you. This is your Leeds Castle waiting to be discovered.",
        "comments": {"autor": "Irina", "comment": "It's a beatoful place. Recommend it to visit."}
      }];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs", {placesToVisit: places});
  });

app.get("/add_place", (req, res) => {
  res.render("addplace.ejs");
  });

app.get('/main.css', (req, res) => {
  res.type('text/css');
  res.sendFile(path.join(__dirname, 'public', 'styles/main.css'));
});

app.get("/post/:index", (req, res) => {
  const index = req.params.index;
  res.render("post.ejs", { place: places[index] });
});

app.get('/add-comment/:place', (req, res) => {
  const place = req.params.place;
  res.render('add-comment.ejs', { place }); 
});

app.get('/change_description/:place', (req, res) => {
  const place = req.params.place;
  res.render('change_description.ejs', { place }); 
});

app.post("/add/:place", (req, res) => {
  const place = req.params.place;
  var newComment = {"autor": req.body.autor, "comment": req.body.comment}
  var updatedPlaceId = findPlaceIdByName(place);
  var updatedPlaces = places[updatedPlaceId];
  updatedPlaces["comments"].push(newComment);
  res.render("post.ejs", {place: updatedPlaces});
});

app.post("/submit", (req, res) => {
  var newPlace = {"image": req.body.image, 
  "place_name": req.body.place_name,
  "description": req.body.description,
  "full_description": req.body.full_description}
  places.push(newPlace);
  res.render("index.ejs", {placesToVisit: places});
  });

app.post("/changed/:place", (req, res) => {
  const place = req.params.place;
  var placeIdToChange = findPlaceIdByName(place);
  places[placeIdToChange].description = req.body.description;
  places[placeIdToChange].full_description = req.body.full_description;
  res.render("index.ejs", { placesToVisit: places });
});

app.post("/delete/:place", (req, res) => {
  const place = req.params.place;
  const placeIdToDelete = findPlaceIdByName(place);
  if (placeIdToDelete !== -1) {
    places.splice(placeIdToDelete, 1);
    res.render("index.ejs", { placesToVisit: places });
  } else {
    console.error("Place not found");
    res.status(404).send("Place not found");
  }
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});