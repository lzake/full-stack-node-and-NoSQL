import { searchFilms } from '../src/searchService';

describe('searchFilms', () => {
    it('should aggregate and dedupe films correctly', async () => {
        const requestPayload = {
            currentPage: 1,
            pageSize: 10,
            sortField: 'title',
            sortDirection: 'ASC',
            excludeVHS: false,
            excludeDVD: false,
            excludeProjector: false,
            search: {
                title: '',
                releaseYear: 0,
                director: '',
                distributor: ''
            }
        };

        const result = await searchFilms(requestPayload);
        expect(result).toEqual([
            {
                title: "Psycho",
                releaseYear: 1960,
                numberOfCopiesAvailable: 6,
                director: "Alfred Hitchcock",
                distributor: "Paramount Pictures"
            },
            {
                title: "Avengers: Endgame",
                releaseYear: 2019,
                numberOfCopiesAvailable: 10,
                director: "Anthony Russo, Joe Russo",
                distributor: "Marvel Studios"
            }
        ]);
    });
});