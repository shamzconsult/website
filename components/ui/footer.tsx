import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { CiYoutube } from "react-icons/ci";
// import Logo from "./logo";
import { BsWhatsapp } from "react-icons/bs";

export default function Footer() {
  const handleClick = () => {
    const url = `https://wa.me/${+2348177098608}?text=${encodeURIComponent(
      "Welcome to ShamzBridge, let's talk!"
    )}`;
    window.open(url, "_blank");
  };
  return (
    <footer>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top area: Blocks */}
        {/* grid sm:grid-cols-12 gap-8 py-8 md:py-12 border-t border-gray-200 */}
        <div className="hidden ">
          {/* 1st block */}
          <div className="sm:col-span-12 lg:col-span-3">
            <div className="mb-2">{/* <Logo /> */}</div>
            <div className="text-sm text-gray-600">
              <a
                href=""
                className="text-gray-600 hover:text-gray-900 hover:underline transition duration-150 ease-in-out"
              >
                Terms
              </a>{" "}
              ·{" "}
              <a
                href=""
                className="text-gray-600 hover:text-gray-900 hover:underline transition duration-150 ease-in-out"
              >
                Privacy Policy
              </a>
            </div>
          </div>

          {/* 3rd block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Resources</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <a
                  href=""
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Blog
                </a>
              </li>
              <li className="mb-2">
                <a
                  href=""
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Support Center
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#partner"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Partners
                </a>
              </li>
            </ul>
          </div>

          {/* 4th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-2">
            <h6 className="text-gray-800 font-medium mb-2">Company</h6>
            <ul className="text-sm">
              <li className="mb-2">
                <a
                  href="#about"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  About us
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#service"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#testimonial"
                  className="text-gray-600 hover:text-gray-900 transition duration-150 ease-in-out"
                >
                  Testimonial
                </a>
              </li>
            </ul>
          </div>

          {/* 5th block */}
          <div className="sm:col-span-6 md:col-span-3 lg:col-span-3">
            <h6 className="text-gray-800 font-medium mb-2">Subscribe</h6>
            <p className="text-sm text-gray-600 mb-4">
              Get the latest news and articles to your inbox every month.
            </p>
            <form>
              <div className="flex flex-wrap mb-4">
                <div className="w-full">
                  <label className="block text-sm sr-only" htmlFor="newsletter">
                    Email
                  </label>
                  <div className="relative flex items-center max-w-xs">
                    <input
                      id="newsletter"
                      type="email"
                      className="form-input w-full text-gray-800 px-3 py-2 pr-12 text-sm"
                      placeholder="Your email"
                      required
                    />
                    <button
                      type="submit"
                      className="absolute inset-0 left-auto"
                      aria-label="Subscribe"
                    >
                      <span
                        className="absolute inset-0 right-auto w-px -ml-px my-2 bg-gray-300"
                        aria-hidden="true"
                      ></span>
                      <svg
                        className="w-3 h-3 fill-current text-orange-600 mx-3 shrink-0"
                        viewBox="0 0 12 12"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z"
                          fillRule="nonzero"
                        />
                      </svg>
                    </button>
                  </div>
                  {/* Success message */}
                  {/* <p className="mt-2 text-green-600 text-sm">Thanks for subscribing!</p> */}
                </div>
              </div>
            </form>
          </div>
        </div>
        {/* Bottom area */}
        <div className="md:flex md:items-center md:justify-between py-4 md:py-8 border-t border-gray-200">
          {/* Social as */}
          <ul className="flex mb-4 md:order-1 md:ml-4 md:mb-0">
            <li className="ml-4">
              <a
                href="https://www.instagram.com/shamsconsult/"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="instagram"
              >
                <InstagramLogoIcon className="w-10 h-10 shadow-md rounded-full p-2" />
              </a>
            </li>
            <li className="ml-4">
              <a
                href="https://twitter.com/ConsultsSh92270"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="instagram"
              >
                <TwitterLogoIcon className="w-10 h-10 shadow-md rounded-full p-2" />
              </a>
            </li>
            <li className="ml-4">
              <a
                href="https://www.linkedin.com/company/102454275/admin/feed/posts/"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="linkedin"
              >
                <LinkedInLogoIcon className="w-10 h-10 shadow-md rounded-full p-2" />
              </a>
            </li>
            <li className="ml-4">
              <a
                href="https://www.linkedin.com/company/102454275/admin/feed/posts/"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="linkedin"
              >
                <CiYoutube className="w-10 h-10 shadow-md rounded-full p-2" />
              </a>
            </li>
            <li className="ml-4">
              <button
                onClick={handleClick}
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="linkedin"
              >
                <BsWhatsapp className="w-10 h-10 shadow-md rounded-full p-2" />
              </button>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm text-gray-600 mr-4">
            &copy; Shamz. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
