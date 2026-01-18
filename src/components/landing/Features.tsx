import { motion } from "framer-motion";
import { BarChart3, Calendar, Lock, Share2, Heart, Smartphone } from "lucide-react";

const features = [
    {
        icon: Calendar,
        title: "Daily Logs",
        description: "Track your day in seconds. Rate your productivity, mood, and habits with our intuitive interface."
    },
    {
        icon: BarChart3,
        title: "Beautiful Analytics",
        description: "Visualize your growth with stunning charts. Spot trends and patterns in your behavior over time."
    },
    {
        icon: Share2,
        title: "Public Accountability",
        description: "Share your streak or monthly progress with a public link. Let the world celebrate your wins."
    },
    {
        icon: Heart,
        title: "Gratitude Journal",
        description: "End every day on a high note by recording what you're grateful for. Built-in mindfulness."
    },
    {
        icon: Lock,
        title: "Private by Default",
        description: "Your data is yours. We encrypt everything and never sell your personal information."
    },
    {
        icon: Smartphone,
        title: "PWA Ready",
        description: "Install DAMit! on your home screen. Works offline and feels just like a native app on iOS and Android."
    }
];

export const Features = () => {
    return (
        <section className="py-24 bg-secondary/30 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
                    <p className="text-muted-foreground text-lg">
                        Powerful tools wrapped in a beautiful, distraction-free interface designed for focus.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-colors shadow-sm hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
