import { faker } from '@faker-js/faker';

export function novoAluno() {
    const timestamp = Date.now();
    return {
        nome: `QA ${faker.person.fullName()}`,
        email: `qa.aluno.${timestamp}@mailinator.com`,
        matricula: `QA-${timestamp}`,
        senha: faker.internet.password()
    };
}