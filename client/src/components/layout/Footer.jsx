const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#031008] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8 sm:px-8 lg:px-10">

        {/* Main Footer */}
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
            <a
              href="/"
              className="inline-block text-3xl font-bold tracking-wider"
            >
              Fernwood<span className="text-[#A3B18A]">.</span>
            </a>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Thoughtfully designed furniture that brings comfort,
              elegance, and character into every living space.
            </p>

            {/* Social Media */}
            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-gray-300 transition hover:border-[#A3B18A] hover:bg-[#A3B18A] hover:text-[#031008]"
              >
                f
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-lg text-gray-300 transition hover:border-[#A3B18A] hover:bg-[#A3B18A] hover:text-[#031008]"
              >
                ◎
              </a>

              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-sm font-semibold text-gray-300 transition hover:border-[#A3B18A] hover:bg-[#A3B18A] hover:text-[#031008]"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Customer Support
            </h3>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Have a question or need assistance? We're here to help
              you find the right furniture for your space.
            </p>

            <a
              href="mailto:info@fernwood.com"
              className="mt-5 inline-block text-sm text-[#A3B18A] transition hover:text-white"
            >
              Get in touch →
            </a>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-white">
              Contact Information
            </h3>

            <ul className="mt-5 space-y-5">

              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.6}
                  stroke="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#A3B18A]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75"
                  />
                </svg>

                <a
                  href="mailto:info@fernwood.com"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  info@fernwood.com
                </a>
              </li>

              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.6}
                  stroke="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#A3B18A]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372a1.5 1.5 0 0 0-1.064-1.436l-4.426-1.36a1.5 1.5 0 0 0-1.5.357l-.97.97a12.035 12.035 0 0 1-5.249-5.249l.97-.97a1.5 1.5 0 0 0 .357-1.5l-1.36-4.426A1.5 1.5 0 0 0 7.07 3.75H5.75A2.25 2.25 0 0 0 3.5 6v.75"
                  />
                </svg>

                <a
                  href="tel:+251900000000"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  +251 900 000 000
                </a>
              </li>

              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.6}
                  stroke="currentColor"
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#A3B18A]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>

                <span className="text-sm leading-6 text-gray-400">
                  Addis Ababa, Ethiopia
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 border-t border-white/10" />

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

          <p className="text-center text-xs text-gray-500 sm:text-left">
            © {currentYear} Fernwood Furniture. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/privacy"
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="text-xs text-gray-500 transition hover:text-white"
            >
              Terms & Conditions
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;