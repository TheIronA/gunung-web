export default function Problem() {
  return (
    <section id="problem" className="py-20 lg:py-32 bg-bg">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-mono text-xs tracking-wider text-red-500 font-medium mb-4 block">THE PROBLEM</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
            Growing demand, limited access
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Indoor climbing is exploding in Malaysia, but climbers face significant barriers to accessing quality gear.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-border rounded p-8 shadow-brutal hover-lift">
            <div className="text-5xl font-bold text-red-500 mb-4 font-heading">3x</div>
            <h3 className="text-xl font-bold mb-2 font-heading">Price Markup</h3>
            <p className="text-gray-600">
              Import duties and limited distribution make quality shoes prohibitively expensive
            </p>
          </div>

          <div className="bg-white border border-border rounded p-8 shadow-brutal hover-lift">
            <div className="text-5xl font-bold text-red-500 mb-4 font-heading">Limited</div>
            <h3 className="text-xl font-bold mb-2 font-heading">Selection</h3>
            <p className="text-gray-600">Only a handful of brands and models are readily available in Malaysia</p>
          </div>

          <div className="bg-white border border-border rounded p-8 shadow-brutal hover-lift">
            <div className="text-5xl font-bold text-red-500 mb-4 font-heading">Few</div>
            <h3 className="text-xl font-bold mb-2 font-heading">Retailers</h3>
            <p className="text-gray-600">Sparse retail presence means no opportunity to try before buying</p>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="bg-white border border-primary rounded p-8 lg:p-12 shadow-brutal-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold font-heading mb-2">Climbing Gym Growth in Malaysia</h3>
              <p className="text-gray-500 font-mono text-sm">2019–2025 (Est.)</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-accent-dark font-heading">+247%</div>
              <p className="text-sm text-gray-500">Growth Rate</p>
            </div>
          </div>

          <div className="relative h-80 flex items-end justify-between gap-2 sm:gap-3 px-4">
            {[
              { year: '2019', count: 15 },
              { year: '2020', count: 18 },
              { year: '2021', count: 22 },
              { year: '2022', count: 28 },
              { year: '2023', count: 36 },
              { year: '2024', count: 45 },
              { year: '2025', count: 52, projected: true },
            ].map((item) => {
              const maxCount = 52;
              const maxHeightPx = 320; // h-80 = 320px
              const heightPx = Math.round((item.count / maxCount) * maxHeightPx);

              return (
                <div key={item.year} className="flex-1 flex flex-col items-center group relative min-w-0">
                  <div
                    className={`w-full ${item.projected ? 'bg-accent-light border-dashed' : 'bg-accent'} border border-primary rounded-t shadow-brutal-sm transition-all hover:opacity-80 relative flex items-center justify-center`}
                    style={{ height: `${heightPx}px` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 font-mono text-xs font-bold text-accent-dark opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white px-2 py-1 rounded shadow-sm">
                      {item.count}
                    </span>
                  </div>
                  <span className="mt-3 font-mono text-xs text-gray-500">{item.year}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-sm text-gray-500 font-mono text-center">Number of indoor climbing facilities</p>
            <p className="text-xs text-gray-400 text-center">Estimated based on industry growth trends. Hover over bars for counts.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
