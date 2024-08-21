import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="text-center text-white p-4">
            <h1 className="text-4xl font-bold mb-4">404 - Link não encontrado</h1>
            <p className="mb-4">Desculpe, o link que você está tentando acessar não existe ou expirou.</p>
            <Link to="/" className="text-blue-500 hover:underline">Voltar para a página inicial</Link>
        </div>
    );
};

export default NotFound;
