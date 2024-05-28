import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

export default function Footer() {
  const chatOnWhatsApp = () => {
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
                href="https://www.instagram.com/shamzbridge/"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="instagram"
              >
                <InstagramLogoIcon className="w-10 h-10 shadow-md rounded-full p-2" />
              </a>
            </li>
            <li className="ml-4">
              <a
                href="https://x.com/shamzbridge"
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
                href="https://www.youtube.com/channel/UCCT69YW8WVJeEbjPEtomkQg/"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="youtube"
              >
                <svg
                  className="w-10 h-10 shadow-md rounded-full p-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.615 7.072c-.204-.72-.801-1.286-1.524-1.49-1.341-.362-6.73-.362-6.73-.362s-5.389 0-6.73.362c-.723.204-1.32.77-1.524 1.49-.364 1.356-.364 4.183-.364 4.183s0 2.827.364 4.183c.204.72.801 1.286 1.524 1.49 1.341.362 6.73.362 6.73.362s5.389 0 6.73-.362c.723-.204 1.32-.77 1.524-1.49.364-1.356.364-4.183.364-4.183s0-2.827-.364-4.183zM9.927 13.803v-4.006l4.14 2.003-4.14 2.003z" />
                </svg>
              </a>
            </li>

            <li className="ml-4">
              <button
                onClick={chatOnWhatsApp}
                className="flex justify-center items-center text-gray-600  bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out "
                aria-label="whatsapp"
              >
                <svg
                  className="w-10 h-10 shadow-md rounded-full p-2"
                  viewBox="0 0 448 512"
                  width="16"
                  height="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4B5563"
                    d="M380.9 97.1C339 55.1 284.8 32 226.9 32 101.7 32 0 133.7 0 258.9c0 45.6 11.9 90.1 34.5 129.4L0 512l127.8-33.8c38.8 20.9 82 32 126.1 32h.1c125.1 0 226.8-101.7 226.8-226.9 0-57.9-22.3-112.1-63.9-153.2zM226.9 450.3c-38.7 0-76.3-10.4-109.2-30.1l-7.8-4.6-75.9 20.1 20.3-74.1-5.1-8C31.8 320 20 289.9 20 258.9 20 147.7 115.7 52 226.9 52c60.1 0 116.7 23.4 159.2 66 42.6 42.6 66 99.2 66 159.3 0 124.2-100.8 225-225.2 225z"
                  />
                  <path
                    fill="#4B5563"
                    d="M331.1 274.6c-5.5-2.7-32.4-15.9-37.4-17.7-5.1-1.8-8.8-2.7-12.5 2.7s-14.3 17.7-17.5 21.4-6.4 4.1-11.9 1.4c-32.4-16.2-53.6-28.9-75.1-65.3-5.7-9.8 5.7-9.1 16.2-30.3 1.8-3.6.9-6.8-.5-9.5s-12.5-30.1-17.1-41.2c-4.5-10.9-9.1-9.3-12.5-9.5-3.2-.2-6.8-.2-10.5-.2-3.6 0-9.5 1.4-14.5 6.8-5 5.5-19 18.6-19 45.5s19.5 52.7 22.3 56.3c2.7 3.6 37.5 57.3 90.7 80.2 53.2 22.9 53.2 15.3 62.6 14.3 9.5-.9 31.7-12.9 36.2-25.4 4.5-12.4 4.5-23.2 3.2-25.4-1.3-2.1-5-3.5-10.5-6.2z"
                  />
                </svg>
              </button>
            </li>
            <li className="ml-4">
              <a
                href="tel:+2348135153620"
                className="flex justify-center items-center text-gray-600 hover:text-gray-900 bg-white hover:bg-white-100 rounded-full shadow transition duration-150 ease-in-out"
                aria-label="youtube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-10 h-10 shadow-md rounded-full p-2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
              </a>
            </li>
          </ul>

          {/* Copyrights note */}
          <div className="text-sm text-gray-600 mr-4 flex flex-col gap-1 mt-8 lg:mt-0">
            <div className="">&copy; ShamzBridge. All rights reserved.</div>
            <p>
              <span className="text-orange-600">Locate Us@</span> 4th Floor,
              Labour House, Central Business District, Abuja
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
