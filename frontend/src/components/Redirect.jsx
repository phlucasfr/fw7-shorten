import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Redirect = () => {
    const { shortUrl } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUrl = async () => {
            try {
                const response = await fetch(`https://fw7-shrt.vercel.app/api/urls/${shortUrl}`);
                const data = await response.json();
                if (data.originalUrl) {
                    window.location.href = data.originalUrl;
                } else {
                    navigate('/404');
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
                navigate('/404');
            }
        };

        fetchUrl();
    }, [shortUrl, navigate]);

    return <div>Redirecionando...</div>;
};

export default Redirect;
