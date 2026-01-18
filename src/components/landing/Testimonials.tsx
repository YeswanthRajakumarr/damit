import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
    {
        content: "DAMit! has completely changed how I approach my daily habits. The visualizations make it addictive to stay consistent.",
        author: "Sarah J.",
        role: "Product Designer",
        initial: "S"
    },
    {
        content: "Simple, beautiful, and effective. I love that it doesn't feel like a chore to use. The gratitude journal is a game changer.",
        author: "Michael C.",
        role: "Software Engineer",
        initial: "M"
    },
    {
        content: "Finally, a tracking app that respects my privacy and looks good doing it. Highly recommended for anyone wanting to improve.",
        author: "v0_fan",
        role: "Digital Nomad",
        initial: "V"
    }
];

export const Testimonials = () => {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold mb-4">Loved by Productive People</h2>
                    <p className="text-muted-foreground text-lg">
                        Join a community of individuals committed to self-improvement.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl bg-card border border-border/50 shadow-soft"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <Avatar>
                                    <AvatarFallback className="bg-primary/10 text-primary">{testimonial.initial}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-semibold">{testimonial.author}</div>
                                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                </div>
                            </div>
                            <p className="text-muted-foreground italic leading-relaxed">
                                "{testimonial.content}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
