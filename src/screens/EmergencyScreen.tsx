import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Phone, Plus, X, User, Trash2 } from 'lucide-react';
import { Button, Card, Input } from '../components/UI';
import { saveEmergencyContacts, getEmergencyContacts } from '../services/firebaseService';
import { auth } from '../lib/firebase';

export function EmergencyScreen({ t, onClose }: { t: any, onClose: () => void }) {
  const [contacts, setContacts] = useState<{ name: string, phone: string }[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const userId = auth?.currentUser?.uid || 'mock-user-123';

  useEffect(() => {
    const fetchContacts = async () => {
      const saved = await getEmergencyContacts(userId);
      setContacts(saved);
    };
    fetchContacts();
  }, [userId]);

  const saveContacts = async (newContacts: { name: string, phone: string }[]) => {
    setContacts(newContacts);
    await saveEmergencyContacts(userId, newContacts);
  };

  const addContact = async () => {
    if (newName && newPhone) {
      const updated = [...contacts, { name: newName, phone: newPhone }];
      await saveContacts(updated);
      setNewName('');
      setNewPhone('');
      setShowAdd(false);
    }
  };

  const removeContact = async (index: number) => {
    const updated = contacts.filter((_, i) => i !== index);
    await saveContacts(updated);
  };

  const handlePanicCall = () => {
    if (contacts.length > 0) {
      window.location.href = `tel:${contacts[0].phone}`;
    } else {
      window.location.href = 'tel:102'; // Default ambulance in India
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.1 }} 
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] bg-rose-600 flex flex-col p-8 overflow-y-auto"
    >
      <div className="flex justify-end mb-4">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="flex flex-col items-center text-center mb-10">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border-4 border-white/30"
        >
          <AlertCircle size={48} className="text-white" />
        </motion.div>
        
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">{t.emergencyWarning}</h2>
        <p className="text-white/90 text-sm font-bold leading-relaxed max-w-[280px]">{t.emergencyAction}</p>
      </div>

      <div className="space-y-6 flex-1">
        <Button 
          onClick={handlePanicCall}
          className="w-full py-5 text-xl bg-white text-rose-600 font-extrabold shadow-2xl flex items-center justify-center gap-3 rounded-[2rem] hover:bg-rose-50 transition-all active:scale-95"
        >
          <Phone size={28} className="fill-current" /> PANIC CALL
        </Button>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-extrabold text-sm uppercase tracking-widest">Emergency Contacts</h3>
            <button 
              onClick={() => setShowAdd(true)}
              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {contacts.map((contact, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={idx} 
                className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-[1.5rem] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-sm">{contact.name}</p>
                    <p className="text-white/70 text-xs font-bold">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={`tel:${contact.phone}`}
                    className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"
                  >
                    <Phone size={18} />
                  </a>
                  <button 
                    onClick={() => removeContact(idx)}
                    className="w-10 h-10 rounded-full bg-rose-500/50 flex items-center justify-center text-white hover:bg-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}

            {contacts.length === 0 && !showAdd && (
              <div className="text-center py-8 bg-white/5 rounded-[2rem] border border-dashed border-white/20">
                <p className="text-white/60 text-xs font-bold uppercase tracking-widest">No contacts saved</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-x-8 bottom-24 bg-white rounded-[2.5rem] p-6 shadow-2xl z-[110]"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-slate-900 font-extrabold text-lg tracking-tight">Add Contact</h4>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Name</label>
                <Input 
                  placeholder="e.g. Husband" 
                  value={newName} 
                  onChange={(e: any) => setNewName(e.target.value)} 
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 px-1">Phone Number</label>
                <Input 
                  placeholder="+91 98765 43210" 
                  value={newPhone} 
                  onChange={(e: any) => setNewPhone(e.target.value)} 
                />
              </div>
            </div>
            <Button className="w-full py-4 font-extrabold text-base" onClick={addContact}>
              Save Contact
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 text-center">
        <button 
          onClick={onClose}
          className="text-white/80 font-extrabold uppercase tracking-widest text-[10px] hover:text-white transition-colors"
        >
          {t.safeNow}
        </button>
      </div>
    </motion.div>
  );
}
