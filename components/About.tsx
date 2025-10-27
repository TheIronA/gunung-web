export default function About() {
  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <span className="font-mono text-xs tracking-wider text-accent font-medium mb-4 block">
              ABOUT GUNUNG
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 leading-tight">
              Local roots, global vision
            </h2>
            <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
              <p>
                Gunung is building the foundation for Malaysia's climbing future. We're starting by improving access to
                world-class climbing shoes through strategic partnerships with established international brands, making
                quality gear available to Malaysian climbers at accessible prices.
              </p>
              <p>
                Our long-term vision is to develop our own line of climbing equipment that leverages Malaysia's rich
                natural rubber heritage and skilled manufacturing base. We're not just importing gear — we're creating a
                homegrown brand that represents Malaysian craftsmanship on the global climbing stage.
              </p>
            </div>
          </div>

          <div className="bg-bg border border-border rounded p-8 lg:p-12 shadow-brutal-lg hover-lift">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gray-800 border border-primary rounded flex items-center justify-center mb-6 shadow-brutal-sm">
                <span className="text-white text-3xl font-bold">AA</span>
              </div>
              <h3 className="text-2xl font-bold font-heading mb-2">Founded by Alwi Al-haddad</h3>
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
              Combining engineering precision, technical expertise, and a passion for climbing, Syed Alwi is bridging the
              gap between Malaysia's industrial capabilities and the global climbing community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
