export const createTeamString = (name: string, abbreviation: string) => `    Team: ${name} (${abbreviation})`;

export const createMatchString = ({ date, time, homeTeam, awayTeam, score }: {
    date: string;
    time: string;
    homeTeam: string;
    awayTeam: string;
    score: string;
}) => `${date}  ${time}  ${homeTeam}  ${score}  ${awayTeam}`;
