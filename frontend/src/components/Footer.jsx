import {
    FaPhoneAlt,
    FaEnvelope,
    FaGithub,
    FaLinkedin,
    FaYoutube,
    FaInstagram,
    } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#071a35] text-white">
        <div className="max-w-7xl mx-auto px-8 py-4">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Contact Us */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Contact Us</h3>

                <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                    <FaPhoneAlt size={12} />
                    <span>Phone : +91 5643565462</span>
                </div>

                <div className="flex items-center gap-2">
                    <FaEnvelope size={12} />
                    <span>Email : sivaofficial@gmail.com</span>
                </div>
                </div>
            </div>

            {/* Follow Me */}
            <div>
                <h3 className="text-lg font-semibold mb-3">Follow Me</h3>

                <div className="flex gap-4 text-xl text-gray-300">
                <FaGithub className="cursor-pointer hover:text-white" />
                <FaLinkedin className="cursor-pointer hover:text-white" />
                <FaYoutube className="cursor-pointer hover:text-white" />
                <FaInstagram className="cursor-pointer hover:text-white" />
                </div>
            </div>

            {/* About */}
            <div>
                <h3 className="text-lg font-semibold mb-3">About</h3>

                <p className="text-sm text-gray-300 leading-6">
                Providing professional e-commerce solutions to
                help you grow your online business.
                </p>
            </div>

            </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-700 py-3 text-center text-xs text-gray-400">
            © 2026 siva. All rights reserved
        </div>
        </footer>
    );
};

export default Footer;