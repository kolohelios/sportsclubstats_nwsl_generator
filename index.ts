import axios from 'axios';
import { readFile } from 'fs/promises';
import { createMatchString, createTeamString } from './util';

const apiUrl = 'https://d2nkt8hgeld8zj.cloudfront.net/services/nwsl.ashx/schedule';
const seasonIdFor2022 = 'bus8n60i95d4ka5frxvgcrspg';

(async function() {
    try {
        const fileContents = await readFile('data.json', 'utf8');
        const { data } = await axios.get(apiUrl);
        // To run against the sample captured API data, uncomment the following line
        // const data = JSON.parse(fileContents);

        const { data: responseData, error } = data;
        // It is unclear what the error might look like, but hopefully the following will handle it
        if (error) {
            throw new Error(`API error: ${JSON.stringify(error)}`);
        }

        const { season_id, matches } = responseData;

        const gameData: {
            date: string;
            time: string;
            homeTeam: string;
            awayTeam: string;
            score: string;
        }[] = [];

        const teamList: { [key: string]: string } = {};

        if (season_id !== seasonIdFor2022) {
            throw new Error('Season ID does match expected ID')
        } else {
            matches.forEach((match: any) => {
                match.events.forEach((event: any) => {
                    const eventDate = new Date(event.date);
                    // We need two-digit year
                    const year = eventDate.getFullYear().toString().slice(2);
                    const month = eventDate.getMonth() + 1;
                    const day = eventDate.getDate();

                    const homeScore = event.results.team_score;
                    const awayScore = event.results.opponent_score;

                    teamList[event.team.abbreviation] = event.team.title;
                    teamList[event.opponent.abbreviation] = event.opponent.title;

                    gameData.push({
                        date: `${month}/${day}/${year}`,
                        time: event.time,
                        homeTeam: event.team.title,
                        awayTeam: event.opponent.title,
                        score: event.is_final ? `${homeScore}-${awayScore}` : ''
                    });
                });
            });

            const teamString = Object.entries(teamList).map(([abbreviation, teamName]) => {
                return `${createTeamString(teamName, abbreviation)}`;
            }).join('\r\n');

            const gamesString = gameData.map(d => createMatchString(d)).join('\r\n');

            let template = await readFile('template.txt', 'utf8');

            template = template.replace('%%TEAMS%%', teamString);
            template = template.replace('%%GAMES%%', gamesString);

            console.log(template);
        }
    } catch (error) {
        console.error(error);
    }
})()
