export default function WhatWeDo() {
  return (
    <section className="py-20 lg:py-32 bg-bg">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-wider text-accent font-medium mb-4 block">WHAT WE DO</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
            Official partnerships, local access
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Gunung connects Malaysian climbers with world-class climbing gear through official partnerships, distribution, and education.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white border border-border rounded p-8 shadow-brutal hover-lift">
            <div className="w-16 h-16 bg-accent border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Official partnerships</h3>
            <p className="text-gray-600">
              We work directly with leading international climbing brands — not grey market imports. Every product is authentic, backed by warranty, and competitively priced.
            </p>
          </div>

          <div className="bg-white border border-border rounded p-8 shadow-brutal hover-lift">
            <div className="w-16 h-16 bg-accent border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Distribution network</h3>
            <p className="text-gray-600">
              We supply climbing gyms and retailers across Malaysia with the gear they need — making quality equipment available where climbers actually train.
            </p>
          </div>

          <div className="bg-white border border-border rounded p-8 shadow-brutal hover-lift">
            <div className="w-16 h-16 bg-accent border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Education & support</h3>
            <p className="text-gray-600">
              From gear selection to maintenance, we help climbers make informed choices. Local knowledge, local support, backed by international expertise.
            </p>
          </div>
        </div>

        <div className="bg-white border border-primary rounded p-8 lg:p-12 shadow-brutal-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold font-heading mb-4">
              More than a reseller
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              We're building the foundation for Malaysia's climbing ecosystem by connecting brands, gyms, and the community. Fair pricing, easy access, and the support Malaysian climbers deserve.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
