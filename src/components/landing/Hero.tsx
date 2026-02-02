import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Shield, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

export const Hero = () => {
    const { user } = useAuthContext();
    return (
        <div className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
            {/* Abstract Background Elemets */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
                            Daily Accountability Made Simple
                        </span>

                        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight mb-8">
                            Master Your Health <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-teal-400">
                                One Day at a Time
                            </span>
                        </h1>

                        <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
                            Track your daily wins, visualize your progress, with Daily Accountable Messages(DAM).
                            The simple, premium way to stay accountable to yourself.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                            {user ? (
                                <Link to="/app">
                                    <Button size="lg" className="h-12 px-8 rounded-full text-lg w-full sm:w-auto">
                                        Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link to="/auth?mode=signup">
                                    <Button size="lg" className="h-12 px-8 rounded-full text-lg w-full sm:w-auto">
                                        Start for Free <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            )}
                            <a href="https://damit.vercel.app/p/42167fe0-097f-48aa-99c0-b77087a69d89" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg" className="h-12 px-8 rounded-full text-lg w-full sm:w-auto hover:bg-secondary/50">
                                    View Public Demo
                                </Button>
                            </a>
                        </div>

                        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>Free Forever Plan</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-primary" />
                                <span>Private & Secure</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" />
                                <span>No Ads</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Dashboard Preview / Visual */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-20 relative mx-auto max-w-5xl px-4"
                >
                    <div className="relative">
                        {/* Desktop App */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-card mx-auto relative z-10"
                        >
                            <img
                                src="/mockups/desktop-analytics.png"
                                alt="Dashboard Analytics"
                                className="w-full h-auto rounded-xl"
                            />
                        </motion.div>

                        {/* Mobile App - Left */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="absolute -bottom-6 -left-4 w-[25%] sm:w-[20%] z-20 hidden sm:block"
                        >
                            <img
                                src="/mockups/mobile-question.png"
                                alt="Mobile Question Interface"
                                className="w-full h-auto rounded-xl shadow-2xl border border-white/10"
                            />
                        </motion.div>

                        {/* Mobile App - Right */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="absolute -bottom-12 -right-4 w-[25%] sm:w-[20%] z-30 hidden sm:block"
                        >
                            <img
                                src="/mockups/mobile-success.png"
                                alt="Mobile Success Screen"
                                className="w-full h-auto rounded-xl shadow-2xl border border-white/10"
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div >
    );
};
