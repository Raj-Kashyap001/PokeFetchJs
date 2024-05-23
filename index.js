#!/usr/bin/env node
import { setTimeout as sleep } from "timers/promises";
import axios from "axios";
import asciify from "asciify-image";
import boxen from "boxen";
import ora from "ora";

const [, , pokemonName] = process.argv;

if (!pokemonName) {
  console.log(`${boxen(
    `   pokefetchjs usage:
   -----------------------------------
        pokefetchjs <pokemon_name>
        
        Example:
        pokefetchjs pikachu ==> Prints ASCII art of Pikachu with some details.`,
    { padding: 1 }
  )}
    `);
  process.exit(0);
}

const API_URL = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;

const infoBoxOpt = {
  padding: 1,
  margin: 1,
  borderColor: "yellow",
  borderStyle: "single",
};

const spinner = ora("Fetching Pokémon data.").start();

const getPokemonData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.clear();
    console.log(
      boxen("Cannot Find Pokémon With Given Name!", {
        padding: 1,
        borderColor: "red",
      })
    );

    spinner.fail("Please try again with valid name.");
    process.exit(1);
  }
};

const data = await getPokemonData();

if (data) spinner.succeed("Pokémon data fetched successfully!");

const imgUrl = data.sprites.front_default;

const displayAsciiImg = () => {
  asciify(imgUrl, {
    fit: "width",
    width: 35,
    height: 40,
  })
    .then((asciiText) => {
      console.log(asciiText);
    })
    .catch((err) => {
      console.log(err);
    });
};

const displayInfoBox = () => {
  console.log(
    boxen(
      `NAME:    ${data.name}\nTYPE:    ${data.types[0].type.name}\nMOVES:   ${[
        ...data.moves.map((move) => move.move.name),
      ].slice(1, 5)}`,
      infoBoxOpt
    )
  );
};

displayAsciiImg();
await sleep(1500);
displayInfoBox();
