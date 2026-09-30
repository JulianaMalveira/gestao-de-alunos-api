import request from 'supertest';
import 'dotenv/config';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let adminToken = null;
const userTokens = new Map();

// Helper para obter o token do Administrador com cache
export async function getAdminToken() {
    if (!adminToken) {
        const resposta = await request(BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_USER,
                senha: process.env.ADMIN_PASSWORD
            });
        adminToken = resposta.body.token;
    }
    return `Bearer ${adminToken}`;
}

// Helper para obter o token de um Aluno específico gerado dinamicamente
export async function getUserToken({ email, senha }) {
    const chaveCache = `${email}:${senha}`;
    if (!userTokens.has(chaveCache)) {
        const resposta = await request(BASE_URL)
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: email,
                senha: senha
            });
        userTokens.set(chaveCache, resposta.body.token);
    }
    return `Bearer ${userTokens.get(chaveCache)}`;
}