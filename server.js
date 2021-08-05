const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const app = express();

let PORT = process.env.PORT || 1911;

app.get('/ss', (req, res) => {
  getSetCards(res, 'https://www.pokellector.com/sets/SH01-Sword-Shield');
});

app.get('/rc', (req, res) => {
  getSetCards(res, 'https://www.pokellector.com/sets/SWSH2-Rebel-Clash');
});

app.get('/dab', (req, res) => {
  getSetCards(res, 'https://www.pokellector.com/sets/SWSH3-Darkness-Ablaze');
});

app.listen(PORT, () => {
  console.log(`Working on port: ${PORT}`);
});

// pass url into getSetCards function

async function getSetCards(res, url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const pokemon_names = $('.plaque').text().split(' - ');
  // get image attribute
  const pokemonArray = [];
  let cards_in_set = pokemon_names.length - 1;
  for (let i = 0; i < pokemon_names.length; i++) {
    const pokemon = pokemon_names[i];
    let pokemonStr = '';
    let pokemonNum = '';

    for (let index = 0; index < pokemon.length; index++) {
      const element = pokemon[index];
      if (!element.match(/[0-9#]/g)) {
        pokemonStr += element;
      }
      if (element.match(/[0-9]/)) {
        pokemonNum += element;
      }
    }

    if (pokemonStr !== '') {
      pokemonArray.push({
        pokemon_name: pokemonStr,
        pokemon_num: `${Number(pokemonNum - 1)}/${cards_in_set}`,
      });
    }
  }

  res.send(JSON.stringify(pokemonArray));
}
