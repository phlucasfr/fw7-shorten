import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const TransactionContext = React.createContext();

const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), timeout)
        )
    ]);
};

export const TransactionsProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ url: '' });
    const [shortUrl, setShortUrl] = useState('');
    const [urlsRemaining, setUrlsRemaining] = useState(100);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const sendTransaction = async () => {
        const urls = [
            'https://fw7-shorten.up.railway.app/api/urls/shorten',
            'https://fw7-shorten.onrender.com/api/urls/shorten',
            'https://fw7-shorten-1.onrender.com/api/urls/shorten'
        ];

        for (const url of urls) {
            try {
                const response = await fetchWithTimeout(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url: formData.url }),
                });

                if (!response.ok) {
                    throw new Error('Erro ao encurtar a URL');
                }

                const data = await response.json();
                setShortUrl(data.shortUrl);
                setUrlsRemaining(data.remaining);
                return;
            } catch (error) {
                throw new Error(`Erro ao enviar a transação com a URL ${url}:`, erro);
            }
        }
    };

    return (
        <TransactionContext.Provider
            value={{
                currentAccount,
                formData,
                setFormData,
                handleChange,
                sendTransaction,
                shortUrl,
                urlsRemaining,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}

TransactionsProvider.propTypes = {
    children: PropTypes.any,
};
