import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const TransactionContext = React.createContext();

export const TransactionsProvider = ({ children }) => {

    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ url: '' });
    const [shortUrl, setShortUrl] = useState('');
    const [urlsRemaining, setUrlsRemaining] = useState(100);

    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    };

    const sendTransaction = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/urls/shorten', {
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
        } catch (error) {
            console.error('Erro ao enviar a transação:', error);
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
