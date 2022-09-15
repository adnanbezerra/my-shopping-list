import { faker } from '@faker-js/faker';

export function getNewRandomItem() {
    return {
        title: faker.company.name(),
        url: faker.internet.url(),
        description: faker.random.words(40),
        amount: faker.internet.port()
    }
}