import { createTeamString, createMatchString } from './util';

describe('createTeamString', () => {
    it('should return team string for team', () => {
        expect(createTeamString('OL Reign', 'RGN')).toBe('    Team: OL Reign (RGN)');
    });
});

describe('createMatchString', () => {
    it('should return match string', () => {
        const match = {
            date: '6/12/22',
            time: '5:00 PM',
            homeTeam: 'SD',
            awayTeam: 'RGN',
            score: '1-1'
        };
        expect(createMatchString(match)).toBe('6/12/22  5:00 PM  SD  1-1  RGN');
    });
});
