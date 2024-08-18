import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
import PropTypes from 'prop-types';

import logo from "../../images/logo.png";

const NavbarItem = ({ title, classprops }) => (
    <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>
);

NavbarItem.propTypes = {
    title: PropTypes.string.isRequired,
    classprops: PropTypes.string,
}

const Navbar = () => {
    return (
        <nav className="w-full flex md:justify-start justify-between items-center p-4">
            <div className="mt-4 ml-14 md:flex-[0.5] flex-initial justify-start items-center flex">
                <img src={logo} alt="logo" className="w-32 cursor-pointer" />
                <h1 className="text-3xl font-bold text-white ml-4 animate-text">FW7 Shorten</h1>
            </div>
        </nav>
    );
};

export default Navbar;
