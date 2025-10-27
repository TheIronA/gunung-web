export default function Opportunity() {
  return (
    <section id="opportunity" className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-wider text-accent-dark font-medium mb-4 block">
            THE OPPORTUNITY
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
            Built on natural advantage
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Malaysia has everything needed to become a global player in climbing gear manufacturing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Natural Rubber */}
          <div className="bg-bg border border-accent-dark rounded p-8 shadow-brutal hover-lift">
            <div className="w-16 h-16 bg-accent-dark border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Natural Rubber Heritage</h3>
            <p className="text-gray-600 mb-4">
              Malaysia is one of the world's top natural rubber producers. We have the raw materials and expertise to
              create exceptional climbing shoe rubber.
            </p>
            <span className="font-mono text-xs text-accent-dark font-medium">#1 in Southeast Asia</span>
          </div>

          {/* Manufacturing */}
          <div className="bg-bg border border-accent rounded p-8 shadow-brutal hover-lift">
            <div className="w-16 h-16 bg-accent border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold font-heading mb-3">Skilled Manufacturing</h3>
            <p className="text-gray-600 mb-4">
              Decades of precision manufacturing in footwear, electronics, and industrial goods have built a skilled
              workforce ready for technical production.
            </p>
            <span className="font-mono text-xs text-accent font-medium">World-class facilities</span>
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
            <h3 className="text-xl font-bold font-heading mb-3">Passionate Community</h3>
            <p className="text-gray-600 mb-4">
              A rapidly growing climbing community eager to support local brands and drive product innovation through
              real-world testing.
            </p>
            <span className="font-mono text-xs text-amber-600 font-medium">Grassroots driven</span>
          </div>
        </div>

        {/* Vision Statement */}
        <div className="mt-16 bg-primary border border-primary rounded p-12 lg:p-16 shadow-brutal-lg text-center">
          <h3 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">
            From rubber trees to rock walls
          </h3>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We're not just importing gear. We're building the foundation for Malaysia to become a recognized name in
            global climbing equipment manufacturing — leveraging local materials, expertise, and passion.
          </p>
        </div>
      </div>
    </section>
  );
}
