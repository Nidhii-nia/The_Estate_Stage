import { FaArrowRight, FaHeart, FaLeaf, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <main className="bg-amber-50/60 text-slate-800">
      <section className="relative isolate overflow-hidden bg-slate-900 text-amber-50">
        <img
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=85"
          alt="Warm modern home interior"
          className="absolute inset-0 -z-20 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-r from-slate-950/90 via-slate-900/50 to-slate-900/20" />
        <div className="mx-auto flex min-h-130 w-full max-w-7xl items-end px-4 py-16 sm:min-h-150 sm:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-amber-300">A better way home</p>
            <h1 className="mt-4 font-heading text-5xl font-bold leading-[1.05] sm:text-7xl">Places with a story worth entering.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
              Estate Stage brings thoughtful homes and the people looking for them a little closer together.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:py-24">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Why we exist</p>
          <h2 className="mt-3 font-heading text-4xl font-bold leading-tight text-amber-950 sm:text-5xl">Real homes. Clear choices. Less noise.</h2>
          <p className="mt-6 text-base leading-8 text-slate-600">
            Finding a home is more than comparing rooms and numbers. It is about recognizing the light in a kitchen, the calm of a neighborhood, and the possibility of a new routine. We built Estate Stage to make that feeling easier to find.
          </p>
          <Link to="/search" className="mt-7 inline-flex items-center gap-3 text-sm font-bold text-cyan-800 transition hover:text-cyan-950">
            Explore available places <FaArrowRight />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5">
          <img src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85" alt="Bright living room" className="h-56 w-full object-cover sm:h-80" />
          <img src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85" alt="Sunlit dining space" className="mt-10 h-56 w-full object-cover sm:mt-16 sm:h-80" />
        </div>
      </section>

      <section className="border-y border-amber-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:py-20">
          <div className="max-w-xl">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">The Estate Stage principles</p>
            <h2 className="mt-3 font-heading text-4xl font-bold text-amber-950">A little more human.</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <article className="border-t-2 border-amber-400 pt-5">
              <FaHeart className="text-xl text-rose-600" />
              <h3 className="mt-4 font-heading text-2xl font-bold text-slate-900">Lead with care</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Every search represents a real move, a real budget, and a real next chapter.</p>
            </article>
            <article className="border-t-2 border-cyan-600 pt-5">
              <FaMapMarkerAlt className="text-xl text-cyan-700" />
              <h3 className="mt-4 font-heading text-2xl font-bold text-slate-900">Know the place</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">We make the details easy to scan so you can focus on how a place feels.</p>
            </article>
            <article className="border-t-2 border-emerald-600 pt-5">
              <FaLeaf className="text-xl text-emerald-700" />
              <h3 className="mt-4 font-heading text-2xl font-bold text-slate-900">Choose what lasts</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">Good homes support better days, from the first viewing to years after.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:py-20 lg:grid-cols-[1fr_0.8fr] lg:items-center">
        <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85" alt="Exterior of a modern home" className="h-80 w-full object-cover sm:h-105" />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-700">Come look around</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-amber-950">Your next address may be closer than you think.</h2>
          <p className="mt-5 text-base leading-7 text-slate-600">Start with a simple search, save the places that catch your eye, and take the next step when it feels right.</p>
          <Link to="/search" className="mt-7 inline-flex items-center gap-3 rounded-md bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-950">
            Find your place <FaArrowRight />
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;