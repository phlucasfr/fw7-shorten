import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const fetchWithTimeout = (url, timeout = 5000) => {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
    ]);
};

const Redirect = () => {
    const { shortUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUrl = async () => {
            const urls = [
                `https://fw7-shorten.up.railway.app/api/urls/${shortUrl}`,
                `https://fw7-shorten.onrender.com/api/urls/${shortUrl}`,
                `https://fw7-shorten-1.onrender.com/api/urls/${shortUrl}`
            ];

            for (const url of urls) {
                try {
                    const response = await fetchWithTimeout(url);
                    const data = await response.json();
                    if (data.originalUrl) {
                        window.location.href = data.originalUrl;
                        return;
                    } else {
                        console.error('URL não encontrada:', url);
                    }
                } catch (error) {
                    console.error(`Erro ao buscar a URL ${url}:`, error);
                }
            }

            navigate('/404');
        };

        fetchUrl();
    }, [shortUrl, navigate]);

    return (
        <div className="text-white">Redirecionando...</div>
    );
};

export default Redirect;
