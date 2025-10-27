export default function Opportunity() {
  return (
    <section id="opportunity" className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-wider text-accent-dark font-medium mb-4 block">
            WHY GUNUNG
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
            The perfect moment for connection
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Malaysia's climbing community is at an inflection point — big enough to matter, small enough to build something real together.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Real Growth */}
          <div className="bg-bg border border-accent-dark rounded p-8 shadow-brutal hover-lift">
            <div className="w-16 h-16 bg-accent-dark border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">A scene coming into its own</h3>
            <p className="text-gray-600 mb-4">
              From KL to Penang to JB, climbing gyms are multiplying fast. What started as a niche sport is becoming a real community — with real needs that aren't being met. That's where we come in.
            </p>
            <span className="font-mono text-xs text-accent-dark font-medium">+247% growth since 2019</span>
          </div>

          {/* Strategic Bridge */}
          <div className="bg-bg border border-accent rounded p-8 shadow-brutal hover-lift">
            <div className="w-16 h-16 bg-accent border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">The Southeast Asian gateway</h3>
            <p className="text-gray-600 mb-4">
              We're uniquely positioned to be a bridge between global climbing brands and Southeast Asia's emerging markets. Malaysia first, then the region. Partnerships built on trust and local knowledge.
            </p>
            <span className="font-mono text-xs text-accent font-medium">Regional connector</span>
          </div>

          {/* Community */}
          <div className="bg-bg border border-amber-500 rounded p-8 shadow-brutal hover-lift md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 bg-amber-500 border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Built on passion, not hype</h3>
            <p className="text-gray-600 mb-4">
              Malaysian climbers are loyal, engaged, and hungry for gear they can trust. We're tapping into that energy — connecting brands with real customers who care about quality, not just chasing trends.
            </p>
            <span className="font-mono text-xs text-amber-600 font-medium">Community-driven</span>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mt-16 bg-primary border border-primary rounded p-12 lg:p-16 shadow-brutal-lg text-center">
          <h3 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
            Malaysia's climbing scene deserves better access
          </h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The gear exists. The brands exist. But the connection between them and Malaysian climbers? That's what we're building. Partnerships that work for everyone, prices that make sense, and a community that finally gets the attention it deserves.
          </p>
        </div>
      </div>
    </section>
  );
}
