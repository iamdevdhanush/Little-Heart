import React, { useState, useCallback } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Plus, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Card } from '../components/UI';
import { COMMUNITY_POSTS } from '../data/mockData';

export function CommunityScreen({ t }: { t: any }) {
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 80], [0, 1]);
  const scale = useTransform(y, [0, 80], [0.5, 1]);
  const rotate = useTransform(y, [0, 150], [0, 360]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add a new mock post to show update
    const newPost = {
      id: Date.now().toString(),
      author: "New Mom",
      avatar: "https://picsum.photos/seed/newmom/100/100",
      content: "Just refreshed! Loving this community support. ✨",
      time: "Just now",
      likes: 0,
      comments: 0
    };
    
    setPosts(prev => [newPost, ...prev]);
    setIsRefreshing(false);
    y.set(0);

    // Celebrate new content
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.1 },
      colors: ['#FF6B9E', '#FFB6C1', '#87CEEB']
    });
  }, [y]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="relative">
      {/* Pull to Refresh Indicator */}
      <motion.div 
        style={{ y, opacity, scale, rotate }}
        className="absolute top-0 left-0 right-0 flex flex-col justify-center items-center h-24 z-0 pointer-events-none"
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-premium flex items-center justify-center text-brand-pink border border-slate-50 mb-2">
          <RefreshCw size={22} className={isRefreshing ? "animate-spin" : ""} />
        </div>
        <motion.span 
          style={{ opacity }}
          className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"
        >
          {isRefreshing ? "Refreshing..." : "Pull to refresh"}
        </motion.span>
      </motion.div>

      <motion.div 
        drag="y"
        dragConstraints={{ top: 0, bottom: 150 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80 && !isRefreshing) {
            handleRefresh();
          } else {
            y.set(0);
          }
        }}
        style={{ y }}
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6 pb-10 relative z-10 bg-transparent"
      >
        <div className="flex justify-between items-center bg-transparent">
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">{t.community}</h3>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 rounded-2xl pink-gradient text-white flex items-center justify-center shadow-lg shadow-brand-pink/20"
          >
            <Plus size={24} />
          </motion.button>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div 
                key={post.id} 
                variants={itemVariants}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">{post.author}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{post.time}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{post.content}</p>
                  <div className="flex gap-6 pt-2 border-t border-slate-50">
                    <button className="flex items-center gap-2 text-slate-400 hover:text-brand-pink transition-colors">
                      <Heart size={18} className="fill-none" />
                      <span className="text-xs font-bold">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-400 hover:text-brand-blue transition-colors">
                      <MessageCircle size={18} />
                      <span className="text-xs font-bold">{post.comments}</span>
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
