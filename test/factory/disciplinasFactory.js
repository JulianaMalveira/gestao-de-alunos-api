import { faker } from '@faker-js/faker';

export function novaDisciplina() {
    const timestamp = Date.now();
    return {
        nome: `Automação - ${faker.book.genre()}`,
        codigo: `AUTO-${timestamp}`,
        cargaHoraria: 80
    };
}