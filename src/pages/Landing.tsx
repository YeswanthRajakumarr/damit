import { useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";

const Landing = () => {
    useEffect(() => {
        document.title = "DAMit! - Daily Accountability Made Simple";
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
            <Navbar />
            <main>
                <Hero />
                <Features />

                {/* Footer CTA */}
                <section className="py-24 px-4 text-center">
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 to-transparent rounded-3xl p-12 border border-primary/10">
                        <h2 className="text-4xl font-bold mb-6">Ready to Take Control?</h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Join thousands of others who are building better habits today. No credit card required.
                        </p>
                        <a
                            href="/auth?mode=signup"
                            className="inline-flex h-12 animate-shimmer items-center justify-center rounded-full border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-8 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 dark:text-white dark:border-white/20 dark:bg-[linear-gradient(110deg,#ffffff10,45%,#ffffff20,55%,#ffffff10)]"
                        >
                            Get Started Now
                        </a>
                    </div>
                </section>

                <footer className="py-12 border-t border-border/40 text-center text-muted-foreground text-sm">
                    <p>© 2026 Yeswanth Rajakumar. All rights reserved.</p>
                </footer>
            </main>
        </div>
    );
};

export default Landing;
