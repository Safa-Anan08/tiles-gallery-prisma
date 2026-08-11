
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    Star,
    ChevronDown,
    Sparkles,
    ShieldCheck,
    Clock,
} from "lucide-react";

const stats = [
    {
        val: "20+",
        label: "Curated Tiles",
        icon: <Sparkles className="w-4 h-4" />,
    },
    {
        val: "100%",
        label: "Quality Focused",
        icon: <ShieldCheck className="w-4 h-4" />,
    },
    {
        val: "24/7",
        label: "Easy Browsing",
        icon: <Clock className="w-4 h-4" />,
    },
    {
        val: "5★",
        label: "Customer Experience",
        icon: <Star className="w-4 h-4" />,
    },
];

const testimonials = [
    {
        name: "Clara Eldridge",
        role: "Interior Design Enthusiast",
        text: "The tile collection made it incredibly easy to find the right finish for my dining space. Everything feels much more intentional now.",
    },
    {
        name: "Marcus Dupont",
        role: "Architectural Collector",
        text: "I loved how simple the browsing experience was. The details, colors, and finishes helped me narrow down exactly what I was looking for.",
    },
    {
        name: "Sarah Sterling",
        role: "Homeowner",
        text: "Adding my favorite tiles to the wishlist and cart made planning my renovation so much easier. The whole experience feels clean and effortless.",
    },
];

const faqs = [
    {
        q: "How can I browse the available tiles?",
        a: "You can explore all available tiles from the Explore Tiles page. Use the search, category filters, and sorting options to quickly find what you need.",
    },
    {
        q: "Can I save tiles for later?",
        a: "Yes. Logged-in users can add tiles to their wishlist and access their saved items from their profile or wishlist area.",
    },
    {
        q: "How do I add a tile to my cart?",
        a: "Open a tile from the Explore Tiles page or View Details page and use the Add to Cart button. Your cart is connected to your account.",
    },
    {
        q: "Do I need an account to use the wishlist?",
        a: "Yes. Wishlist and cart actions require you to be logged in so your saved items can be associated with your account.",
    },
    {
        q: "Can I view the full details of a tile?",
        a: "Yes. Select any tile to open its details page and view its available information before adding it to your cart or wishlist.",
    },
];

export default function ExtraSections() {
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="w-full">


            <section className="px-6 py-16 max-w-5xl mx-auto w-full z-10 relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <div
                            key={idx}
                            className="glass-panel p-5 rounded-3xl text-center bg-white border border-lavender-grey/30 shadow-sm space-y-2"
                        >
                            <div className="w-9 h-9 rounded-xl bg-dusty-rose/10 flex items-center justify-center mx-auto text-dusty-rose">
                                {stat.icon}
                            </div>

                            <h3 className="text-2xl font-black text-charcoal">
                                {stat.val}
                            </h3>

                            <p className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>


            <section className="px-6 py-16 bg-white/40 border-t border-b border-lavender-grey/25 z-10 relative">
                <div className="max-w-7xl mx-auto w-full">

                    <div className="text-center space-y-2 mb-12">
                        <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">
                            Endorsements
                        </span>

                        <h2 className="text-2xl font-bold text-charcoal">
                            What Our Customers Say
                        </h2>

                        <p className="text-xs text-charcoal-light max-w-md mx-auto">
                            Thoughtful spaces, carefully selected tiles, and a smoother way
                            to bring your interior vision to life.
                        </p>
                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((review, idx) => (
                            <div
                                key={idx}
                                className="glass-panel p-6 rounded-3xl bg-white border border-lavender-grey/35 shadow-sm space-y-4"
                            >

                                <div className="flex gap-1 text-dusty-rose">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className="w-3.5 h-3.5 fill-current"
                                        />
                                    ))}
                                </div>

                                <p className="text-xs text-charcoal-light italic leading-relaxed">
                                    &ldquo;{review.text}&rdquo;
                                </p>

                                <div>
                                    <h4 className="text-[11px] font-bold text-charcoal">
                                        {review.name}
                                    </h4>

                                    <span className="text-[9px] text-lavender-grey-dark">
                                        {review.role}
                                    </span>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>
            </section>


            <section className="px-6 py-16 max-w-4xl mx-auto w-full z-10 relative">

                <div className="text-center space-y-2 mb-12">
                    <span className="text-[10px] text-dusty-rose font-bold uppercase tracking-wider block">
                        Support
                    </span>

                    <h2 className="text-2xl font-bold text-charcoal">
                        Frequently Asked Questions
                    </h2>

                    <p className="text-xs text-charcoal-light max-w-md mx-auto">
                        Everything you need to know before choosing your next tile.
                    </p>
                </div>


                <div className="space-y-4">

                    {faqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="glass-panel rounded-2xl bg-white border border-lavender-grey/30 overflow-hidden transition-all shadow-sm"
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setOpenFaq(openFaq === idx ? null : idx)
                                }
                                className="w-full px-5 py-4 text-left flex justify-between items-center text-xs font-bold text-charcoal hover:bg-slate-50 transition-colors"
                            >

                                <span>{faq.q}</span>

                                <ChevronDown
                                    className={`w-4 h-4 text-lavender-grey-dark transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""
                                        }`}
                                />

                            </button>


                            <AnimatePresence initial={false}>

                                {openFaq === idx && (
                                    <motion.div
                                        initial={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        animate={{
                                            height: "auto",
                                            opacity: 1,
                                        }}
                                        exit={{
                                            height: 0,
                                            opacity: 0,
                                        }}
                                        transition={{
                                            duration: 0.25,
                                        }}
                                        className="overflow-hidden"
                                    >

                                        <div className="px-5 pb-5 pt-1 text-xs text-charcoal-light leading-relaxed border-t border-slate-100">
                                            {faq.a}
                                        </div>

                                    </motion.div>
                                )}

                            </AnimatePresence>

                        </div>
                    ))}

                </div>

            </section>

        </div>
    );
}

