const Footer = () => {
    return (
        <div className="w-full flex justify-center items-center flex-col p-4 gradient-bg-footer">
            <div className="flex justify-center items-center flex-col mt-5">
                <p className="text-white text-sm text-center">Entre em contato: phlucasfr@gmail.com</p>
            </div>

            <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-5" />

            <div className="w-full flex justify-center items-center mt-3">
                <p className="text-white text-sm text-center">© 2024 Phelipe Lucas. Todos os direitos reservados.</p>
            </div>
        </div>
    );
};

export default Footer;
