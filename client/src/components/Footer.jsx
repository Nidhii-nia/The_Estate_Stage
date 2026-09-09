import { FaEnvelope, FaArrowRight } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-10 border-t border-amber-200 bg-slate-900 text-amber-50">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-heading text-2xl font-bold">the Estate Stage</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            A considered way to discover places with character, comfort, and room for what comes next.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Explore</p>
          <NavLink to="/about" className="mt-3 flex items-center gap-2 text-sm text-slate-200 transition hover:text-amber-300">
            About Estate Stage <FaArrowRight className="text-xs" />
          </NavLink>
          <NavLink to="/search" className="mt-2 flex items-center gap-2 text-sm text-slate-200 transition hover:text-amber-300">
            Browse listings <FaArrowRight className="text-xs" />
          </NavLink>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Have a question?</p>
          <a href="mailto:contact@estateStage.com" className="mt-3 flex items-center gap-2 break-all text-sm text-slate-200 transition hover:text-amber-300">
            <FaEnvelope className="shrink-0 text-amber-300" /> contact@estateStage.com
          </a>
          <p className="mt-2 text-xs leading-5 text-slate-400">Reach out for listing queries, partnerships, or general help.</p>
        </div>
      </div>
      <div className="border-t border-slate-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} the Estate Stage. All rights reserved.</p>
          <p>Made for better moves.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
