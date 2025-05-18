const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral p-10 text-neutral-content">
      <div className="footer mx-auto max-w-7xl flex justify-between">
        <div className="space-y-2">
          <span className="footer-title">Services</span>
          <a href='#' className="link-hover link transition hover:text-primary">
            Branding
          </a>
          <a href="#" className="link-hover link transition hover:text-primary">
            Design
          </a>
          <a href="#" className="link-hover link transition hover:text-primary">
            Marketing
          </a>
          <a href="#" className="link-hover link transition hover:text-primary">
            Advertisement
          </a>
        </div>
        <div className="space-y-2">
          <span className="footer-title">Company</span>
          <a href="#" className="link link-hover transition hover:text-primary">
            About us
          </a>
          <a href="#" className="link link-hover transition hover:text-primary">
            Contact
          </a>
          <a href="#" className="link link-hover transition hover:text-primary">Jobs</a>
          <a href="#" className="link link-hover transition hover:text-primary">
            Press kit
          </a>
        </div>
        <div className="space-y-2">
          <span className="footer-title">Legal</span>
          <a href="#" className="link link-hover transition hover:text-primary">
            Terms of use
          </a>
          <a href="#" className="link link-hover transition hover:text-primary">
            Privacy policy
          </a>
          <a href="#" className="link link-hover transition hover:text-primary">
            Cookie policy
          </a>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm opacity-80">
          Copyright © {currentYear} - All right reserved by{" "}
          <a href="#" className="link link-hover transition hover:text-primary">
            Flowmazon
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
