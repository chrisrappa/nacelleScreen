import { faker } from '@faker-js/faker';
import { State, City, StateOption } from '../interfaces/GridDataInterfaces';

export const generateMockStateData = (selectedState: StateOption): State => {
  return {
    name: selectedState.label,
    abbreviation: selectedState.value,
    capital: faker.location.city(),
    population: faker.number.int({ min: 500000, max: 40000000 }),
    totalArea: faker.number.int({ min: 1000, max: 700000 }), // square miles
    dateAdmittedToUnion: faker.date.between({ 
      from: '1787-12-07', 
      to: '1959-08-21' 
    }),
    governor: faker.person.fullName(),
    largestCities: Array.from({ length: 5 }, (): City => ({
      name: faker.location.city(),
      population: faker.number.int({ min: 50000, max: 8000000 }),
      mayorName: faker.person.fullName(),
      foundedYear: faker.number.int({ min: 1600, max: 1900 })
    })),
    gdp: faker.number.int({ min: 30000000000, max: 3000000000000 }),
    medianIncome: faker.number.int({ min: 40000, max: 85000 })
  };
};
