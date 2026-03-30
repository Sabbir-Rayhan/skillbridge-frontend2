import Link from "next/link";
import { BookOpen, Twitter, Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="text-xl font-display font-bold text-cream">
                Skill<span className="text-brand-400">Bridge</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs opacity-70">
              Connecting passionate learners with expert tutors. Learn anything, from anyone, anywhere.
            </p>
            <div className="flex gap-3 mt-4">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 hover:bg-brand-500 rounded-lg flex items-center justify-center transition-colors duration-200">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-cream mb-3">Platform</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link href="/tutors" className="hover:text-brand-400 transition-colors">Browse Tutors</Link></li>
              <li><Link href="/register" className="hover:text-brand-400 transition-colors">Become a Tutor</Link></li>
              <li><Link href="/login" className="hover:text-brand-400 transition-colors">Log In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-cream mb-3">Company</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:text-brand-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center text-sm opacity-50">
          <p>© 2026 SkillBridge. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Made with ❤️ for learners everywhere</p>
        </div>
      </div>
    </footer>
  );
}
