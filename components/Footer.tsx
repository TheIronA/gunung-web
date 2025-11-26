import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-primary py-12">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 relative bg-white rounded p-1">
              <Image
                src="/gunung-logo.png"
                alt="Gunung Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight text-white">GUNUNG</span>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <p className="text-gray-400 text-sm font-mono text-center md:text-right">© 2025 Gunung. Born from our soil, built for ascent.</p>
            <a 
              href="https://alwialhaddad.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 text-xs font-mono hover:text-white transition-colors"
            >
              Created by Alwi Al-Haddad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
