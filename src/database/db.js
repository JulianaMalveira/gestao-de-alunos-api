import 'dotenv/config';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gestao-de-alunos';

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão com o MongoDB:', err.message);
});

// Função com tentativas automáticas (Retry) para evitar ECONNREFUSED
const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log('MongoDB conectado.');
      return;
    } catch (err) {
      console.error(`Tentativa ${i + 1} de conexão falhou: ${err.message}. A tentar novamente em ${delay / 1000}s...`);
      if (i === retries - 1) {
        throw new Error(`Não foi possível conectar ao MongoDB após ${retries} tentativas.`, { cause: err });
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

await connectWithRetry();

export default mongoose;