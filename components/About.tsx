export default function About() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <span className="font-mono text-xs tracking-wider text-accent font-medium mb-4 block text-center">
            ABOUT GUNUNG
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight text-center">
            Local roots, global vision
          </h2>
          <div className="space-y-4 text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            <p>
              Gunung is building a community platform that connects Malaysian climbers with world-class gear. Through strategic partnerships with established international brands, we're improving access to quality climbing equipment at prices that work for our community.
            </p>
            <p>
              We believe Malaysia's climbing scene deserves the same access to great gear as anywhere else in the world. By working with trusted brands and building relationships with retailers, we're creating a network that serves climbers from KL to Penang, from indoor gyms to outdoor crags. Our roots in Malaysia's industrial heritage — from rubber production to precision manufacturing — inspire us to think big about what's possible for our community.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Founder 1 */}
          <div className="bg-bg border border-border rounded p-8 shadow-brutal-lg hover-lift">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gray-800 border border-primary rounded flex items-center justify-center mb-4 shadow-brutal-sm">
                <span className="text-white text-3xl font-bold">AA</span>
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">Syed Alwi Al-haddad</h3>
              <p className="text-sm text-gray-500 mb-3 font-mono">Co-founder</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-mono text-xs bg-accent/10 text-accent px-3 py-1 border border-accent/20 rounded">
                  Biomedical Engineer
                </span>
                <span className="font-mono text-xs bg-green-500/10 text-green-600 px-3 py-1 border border-green-500/20 rounded">
                  Full-Stack Developer
                </span>
                <span className="font-mono text-xs bg-amber-500/10 text-amber-600 px-3 py-1 border border-amber-500/20 rounded">
                  Climber
                </span>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Combining technical expertise with a deep passion for climbing, Alwi is connecting Malaysia's growing climbing community with international partners and resources.
            </p>
          </div>

          {/* Placeholder Founder 2 */}
          <div className="bg-bg border border-border border-dashed rounded p-8 shadow-brutal-lg hover-lift opacity-60">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gray-300 border border-primary rounded flex items-center justify-center mb-4 shadow-brutal-sm">
                <span className="text-gray-600 text-3xl font-bold">?</span>
              </div>
              <h3 className="text-xl font-bold font-heading mb-2">Fulan bin Fulan</h3>
              <p className="text-sm text-gray-500 mb-3 font-mono">Co-founder</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="font-mono text-xs bg-gray-100 text-gray-500 px-3 py-1 border border-gray-300 rounded">
                  skill
                </span>
                <span className="font-mono text-xs bg-gray-100 text-gray-500 px-3 py-1 border border-gray-300 rounded">
                  skill
                </span>
                <span className="font-mono text-xs bg-gray-100 text-gray-500 px-3 py-1 border border-gray-300 rounded">
                  Climber
                </span>
              </div>
            </div>
            <p className="text-gray-500 leading-relaxed italic">
              Placeholder text.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
