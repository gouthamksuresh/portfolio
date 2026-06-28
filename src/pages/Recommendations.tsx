import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { useReveal } from "@/hooks/useReveal";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface Recommendation {
  id: string;
  title: string;
  description: string | null;
  url: string;
  category: string;
  icon: string;
  sort_order: number;
}

export default function Recommendations() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  useReveal([items]);

  useEffect(() => {
    supabase
      .from("recommendations")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => {
        const fetchedItems = data ?? [];
        
        const zerodhaRecommendation: Recommendation = {
          id: "zerodha-referral-manual",
          title: "Zerodha",
          description: "Open a free demat account with Zerodha and start investing in stocks, derivatives, mutual funds, ETFs, bonds, IPOs, and more.",
          url: "https://zerodha.com/open-account?c=VYG476",
          category: "Finance",
          icon: "https://zerodha.com/static/images/favicon.png",
          sort_order: 999,
        };

        const growwRecommendation: Recommendation = {
          id: "groww-referral-manual",
          title: "Groww",
          description: "Hey! Ready to start your investment journey? I use Groww for all my investing and trading needs. You can open a free demat account today using my referral code : NUI6SY",
          url: "https://app.groww.in/v3cO/dl6ugxk2",
          category: "Finance",
          icon: "https://www.google.com/s2/favicons?domain=groww.in&sz=128",
          sort_order: 1000,
        };

        const aliceBlueRecommendation: Recommendation = {
          id: "aliceblue-referral-manual",
          title: "AliceBlue",
          description: "Invest and trade with AliceBlue, India's largest retail stockbroker.",
          url: "https://ekyc.aliceblueonline.com/?source=2661247",
          category: "Finance",
          icon: "https://www.google.com/s2/favicons?domain=aliceblueonline.com&sz=128",
          sort_order: 1001,
        };

        const dhanRecommendation: Recommendation = {
          id: "dhan-referral-manual",
          title: "Dhan",
          description: "I shifted to Dhan and the experience has been smooth so far. Dhan has fast order execution, powerful charts, and solid tools for active traders & investors. 🔥 1 crore MTF funding 🔥 2500 Price Alerts 🔥 Instant Pledge Margin benefit. If you want to try it, use my link to open a free Demat account.",
          url: "https://join.dhan.co/?invite=EOUNQ26752",
          category: "Finance",
          icon: "https://www.google.com/s2/favicons?domain=dhan.co&sz=128",
          sort_order: 1002,
        };

        setItems([...fetchedItems, zerodhaRecommendation, growwRecommendation, aliceBlueRecommendation, dhanRecommendation]);
        setLoading(false);
      });
  }, []);

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="min-h-screen">
      <ScrollProgress />
      <Nav />
      <main className="pt-28 pb-20">
        <div className="container max-w-4xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-mono text-xs mb-8 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> cd ~/home
          </Link>

          <div className="mb-10 reveal">
            <p className="font-mono text-xs text-muted-foreground mb-2">
              <span className="text-primary">$</span> cat recommendations.md
            </p>
            <h1 className="font-mono text-3xl sm:text-4xl font-bold mb-3">
              <span className="text-primary text-glow">Recommendations</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Tools, resources, and products I genuinely use and recommend. Some links may be referral links.
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 rounded-lg border border-border bg-card animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 font-mono text-muted-foreground">
              <p className="text-primary mb-2">// no recommendations yet</p>
              <p>Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-10">
              {categories.map((cat) => (
                <div key={cat} className="reveal">
                  <h2 className="font-mono text-xs uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                    <span className="h-px flex-1 bg-border" />
                    {cat}
                    <span className="h-px flex-1 bg-border" />
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {items
                      .filter((i) => i.category === cat)
                      .map((item) => (
                        <a
                          key={item.id}
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group rounded-lg border border-border bg-card p-5 hover:border-primary/60 transition-colors glow-hover flex flex-col"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-3">
                              {item.icon && (item.icon.startsWith("http") || item.icon.startsWith("/")) && (
                                <img 
                                  src={item.icon} 
                                  alt={item.title} 
                                  className="w-5 h-5 rounded-sm object-contain bg-white/90 p-0.5" 
                                />
                              )}
                              <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                                {item.title}
                              </h3>
                            </div>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1 transition-colors" />
                          </div>
                          {item.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </a>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
