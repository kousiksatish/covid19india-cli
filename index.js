#!/usr/bin/env node

const yargs = require('yargs');
const axios = require('axios');
const dataToTable = require('./utils/dataToTable.js')

const parsedYargs = yargs
    .command('$0', 'All states information')
    .command('[State Code/Name]', 'Specific state info', (yargs) => {
        yargs.positional('state', {
            type: 'string',
            describe: 'Case insensitive state name or code for which info is needed'
        })
    })
    .help()
    .argv

const inputCommands = parsedYargs._;

if (inputCommands.length < 1) {
    getAllStates();
} else if (inputCommands.length < 2) {
    getSpecificState(inputCommands[0]);
}

function getAllStates() {
    axios.get(`https://api.covid19india.org/data.json`)
        .then((response) => {
            if (!(response && response.data && response.data.statewise)) {
                console.log(`Unidentified format. Please raise an issue.`);
                return;
            }
            const stateWiseData = response.data.statewise;
            dataToTable(stateWiseData);
        })
        .catch((err) => {
            console.log(`Error occured while fetching data! ${err}`);
        });
}

function getSpecificState(stateNameOrCode) {
    console.log(`Fetching info for ${stateNameOrCode}...`);
    axios.get(`https://api.covid19india.org/data.json`)
        .then((response) => {
            if (!(response && response.data && response.data.statewise)) {
                console.log(`Unidentified format. Please raise an issue.`);
                return;
            }
            const stateWiseData = response.data.statewise;
            const successfullyPrinted = dataToTable(stateWiseData, stateNameOrCode);
            if (!successfullyPrinted) {
                console.log('Invalid state name or code! Please check the input!')
            }
        })
        .catch((err) => {
            console.log(`Error occured while fetching data! ${err}`);
        });
}
