import { expect } from 'chai';
import { getAdminToken, getUserToken } from './helpers/authHelper.js';
import { api } from './helpers/api.js';
import { novoAluno } from './factory/alunosFactory.js';
import { novaDisciplina } from './factory/disciplinasFactory.js';
import dadosTeste from './fixtures/payloads.json' with { type: 'json' };
import mongoose from 'mongoose';

describe('Fluxo Acadêmico - Passos Separados', () => {
    
    // Variáveis partilhadas entre os testes sequenciais
    let aluno;
    let idAluno;
    let idDisciplina;

    after(async () => {
        await mongoose.connection.close();
    });

    it('1. Deve fazer login como Administrador e cadastrar um novo aluno', async () => {
        aluno = novoAluno();
        const resposta = await api()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await getAdminToken())
            .send(aluno);
        
        expect(resposta.status).to.equal(201);
        idAluno = resposta.body.id;
        expect(idAluno).to.be.a('string');
    });

    it('2. Deve cadastrar uma nova disciplina como Administrador', async () => {
        const resposta = await api()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await getAdminToken())
            .send(novaDisciplina());
        
        expect(resposta.status).to.equal(201);
        idDisciplina = resposta.body.id;
        expect(idDisciplina).to.be.a('string');
    });

    it('3. Deve matricular o aluno recém-criado na disciplina', async () => {
        const resposta = await api()
            .post(`/api/admin/disciplinas/${idDisciplina}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await getAdminToken())
            .send({ alunoId: idAluno });
        
        expect(resposta.status).to.equal(201);
        expect(resposta.body.alunoId).to.equal(idAluno);
        expect(resposta.body.disciplinaId).to.equal(idDisciplina);
    });

    // Mantemos o Data-Driven para a entrega dos trabalhos baseados no JSON
    for (const dadosTrabalho of dadosTeste.trabalhos) {
        it(`4. Deve fazer login como Aluno e registrar a entrega: "${dadosTrabalho.titulo}"`, async () => {
            const resposta = await api()
                .post(`/api/alunos/${idAluno}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await getUserToken(aluno))
                .send({ 
                    disciplinaId: idDisciplina, 
                    ...dadosTrabalho 
                });
            
            expect(resposta.status).to.equal(201);
            expect(resposta.body.alunoId).to.equal(idAluno);
            expect(resposta.body.disciplinaId).to.equal(idDisciplina);
        });
    }
});