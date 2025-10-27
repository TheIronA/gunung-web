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
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-2xl font-bold font-heading mb-2">Climbing Gym Growth in Malaysia</h3>
              <p className="text-gray-500 font-mono text-sm">2019–2025 (Projected)</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-accent-dark font-heading">+250%</div>
              <p className="text-sm text-gray-500">Growth Rate</p>
            </div>
          </div>

          <div className="relative h-64 flex items-end gap-4">
            {[
              { year: '2019', height: '25%' },
              { year: '2020', height: '35%' },
              { year: '2021', height: '45%' },
              { year: '2022', height: '65%' },
              { year: '2023', height: '80%' },
              { year: '2024', height: '90%' },
              { year: '2025', height: '100%', projected: true },
            ].map((item) => (
              <div key={item.year} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full ${item.projected ? 'bg-accent-light border-dashed' : 'bg-accent'} border border-primary rounded-t shadow-brutal-sm`}
                  style={{ height: item.height }}
                ></div>
                <span className="mt-3 font-mono text-xs text-gray-500">{item.year}</span>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-gray-500 font-mono text-center">Number of indoor climbing facilities</p>
        </div>
      </div>
    </section>
  );
}
