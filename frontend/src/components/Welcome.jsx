import { useContext, useState } from 'react';
import { BsInfoCircle, BsClipboard, BsClipboardCheck, BsHourglass } from "react-icons/bs";
import PropTypes from 'prop-types';
import { TransactionContext } from '../context/TransactionContext';
import { Loader } from "./";

const commonStyles = "min-h-[60px] sm:px-0 px-2 sm:min-w-[120px] flex justify-center items-center border-[0.5px] border-gray-400 text-sm font-light text-white";

const Input = ({ placeholder, name, type, value, handleChange }) => (
    <input
        placeholder={placeholder}
        type={type}
        step="0.0001"
        value={value}
        onChange={(e) => handleChange(e, name)}
        className="my-2 w-full rounded-sm p-2 outline-none bg-transparent text-white border-none text-sm white-glassmorphism"
    />
);

Input.propTypes = {
    placeholder: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
    handleChange: PropTypes.func,
}

const Welcome = () => {
    const { connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, shortUrl, urlsRemaining } = useContext(TransactionContext);
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.url) return;
        setIsLoading(true);
        await sendTransaction();
        setIsLoading(false);
    };

    const handleCopy = async () => {
        console.log('Copy button clicked');
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(shortUrl);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = shortUrl;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="flex w-full justify-center items-center">
            <div className="flex mf:flex-row flex-col items-start justify-between md:p-20 py-12 px-4">
                <div className="flex flex-1 justify-start flex-col mf:mr-10">
                    <h1 className="text-left text-3xl sm:text-5xl text-white text-gradient py-1">
                        Transforme URLs em <br /> Links Poderosos
                    </h1>
                    <p className="text-left mt-5 text-white font-light md:w-9/12 w-11/12 text-base">
                        Encurte suas URLs de forma rápida, gratuita e sem complicações. Torne seus links mais simples e fáceis de compartilhar.
                    </p>

                    <div className="grid sm:grid-cols-3 grid-cols-2 w-full mt-10">
                        <div className={`rounded-tl-2xl ${commonStyles}`}>
                            Velocidade
                        </div>
                        <div className={commonStyles}>
                            Segurança
                        </div>
                        <div className={`rounded-tr-2xl ${commonStyles}`}>
                            Gratuito
                        </div>
                        <div className={`rounded-bl-2xl ${commonStyles}`}>
                            Escalável
                        </div>
                        <div className={commonStyles}>
                            Inovação
                        </div>
                        <div className={`rounded-br-2xl ${commonStyles}`}>
                            Anonimato
                        </div>
                    </div>
                </div>

                <div className="flex flex-col flex-1 items-center justify-start w-full mf:mt-0 mt-10">
                    <div className="p-3 justify-end items-start flex-col rounded-xl h-40 sm:w-72 w-full my-5 eth-card white-glassmorphism">
                        <div className="relative flex justify-between flex-col w-full h-full">
                            <div className="flex justify-between items-start">
                                <div className="relative group">
                                    <BsInfoCircle fontSize={17} color="#fff" />
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                        Cada usuário possui 100 encurtamentos de URL por dia.
                                    </div>
                                </div>
                            </div>
                            <div>
                                {shortUrl ? (
                                    <>
                                        <p className="text-white font-semibold text-lg">
                                            {shortUrl}
                                        </p>
                                        <p className="text-white font-light text-sm mt-1">
                                            {`URLs restantes: ${urlsRemaining}`}
                                        </p>
                                        <div className="flex items-center mt-2">
                                            <button
                                                onClick={handleCopy}
                                                className="relative flex items-center px-3 py-1 bg-blue-400 text-white rounded-md hover:bg-blue-600"
                                            >
                                                {isCopied ? <BsClipboardCheck className="mr-2" /> : <BsClipboard className="mr-2" />}
                                                {isCopied ? "Copiado!" : "Copiar"}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full">
                                        {isLoading ? (
                                            <Loader />
                                        ) : (
                                            <>
                                                <BsHourglass className="text-white text-3xl" />
                                                <p className="text-white font-light text-sm mt-2">
                                                    Estamos aguardando sua URL...
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-5 sm:w-96 w-full flex flex-col justify-start items-center blue-glassmorphism">
                        <Input placeholder="Digite aqui sua URL" name="url" type="text" handleChange={handleChange} />

                        <div className="h-[1px] w-full bg-gray-400 my-2" />

                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="text-white w-full mt-2 border-[1px] p-2 border-[#3d4f7c] rounded-full cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Gerando...' : 'Gerar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;
