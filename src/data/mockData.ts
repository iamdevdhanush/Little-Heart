export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  pregnancyMonth: number;
  region: string;
  bp?: string;
  sugar?: string;
  language: 'en' | 'hi' | 'kn';
  dueDate?: string;
  medicalConditions?: string[];
  allergies?: string[];
}

export interface BabyGrowthData {
  month: number;
  sizeComparison: string;
  emoji: string;
  insight: string;
  bodyChanges: string;
}

export interface DietData {
  region: string;
  eat: string[];
  avoid: string[];
}

export const BABY_GROWTH: BabyGrowthData[] = [
  { month: 1, sizeComparison: "a poppy seed", emoji: "🌱", insight: "Your baby is just starting to grow!", bodyChanges: "You might feel slightly more tired than usual." },
  { month: 2, sizeComparison: "a raspberry", emoji: "🍓", insight: "Baby's heart is starting to beat.", bodyChanges: "Morning sickness might kick in now." },
  { month: 3, sizeComparison: "a lime", emoji: "🍋", insight: "Baby is moving their tiny limbs!", bodyChanges: "Your clothes might start feeling a bit tight." },
  { month: 4, sizeComparison: "an avocado", emoji: "🥑", insight: "Baby can now hear your voice.", bodyChanges: "You might start to see a small baby bump." },
  { month: 5, sizeComparison: "a banana", emoji: "🍌", insight: "Baby is developing their fingerprints.", bodyChanges: "You'll likely feel the first kicks (quickening)." },
  { month: 6, sizeComparison: "a pomegranate", emoji: "🍎", insight: "Baby's lungs are developing.", bodyChanges: "Backaches might become more common." },
  { month: 7, sizeComparison: "a pineapple", emoji: "🍍", insight: "Baby can open and close their eyes.", bodyChanges: "You might experience some swelling in feet." },
  { month: 8, sizeComparison: "a cantaloupe", emoji: "🍈", insight: "Baby is gaining weight rapidly.", bodyChanges: "Shortness of breath is normal as baby grows." },
  { month: 9, sizeComparison: "a watermelon", emoji: "🍉", insight: "Baby is getting ready to meet you!", bodyChanges: "Frequent trips to the bathroom are expected." },
];

export const DIET_DATA: DietData[] = [
  {
    region: "North India",
    eat: ["Dal & Paneer", "Whole wheat Roti", "Fresh Curd", "Seasonal Fruits"],
    avoid: ["Excessive Ghee", "Very Spicy Pickles", "Unpasteurized Milk"]
  },
  {
    region: "South India",
    eat: ["Ragi Mudde/Malt", "Coconut Water", "Idli/Dosa", "Drumstick leaves"],
    avoid: ["Excessive Tamarind", "Deep fried snacks", "Raw Papaya"]
  },
  {
    region: "East India",
    eat: ["Fish (well cooked)", "Rice & Lentils", "Leafy Greens", "Milk sweets"],
    avoid: ["Raw Fish", "Mustard oil in excess", "Street food"]
  },
  {
    region: "West India",
    eat: ["Bajra/Jowar Rotla", "Sprouted Moong", "Buttermilk", "Nuts"],
    avoid: ["High salt Farsan", "Spicy Masalas", "Caffeine"]
  }
];

export interface Post {
  id: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  time: string;
  avatar: string;
}

export const COMMUNITY_POSTS: Post[] = [
  {
    id: '1',
    author: 'Ananya Sharma',
    content: 'Feeling the first kicks today! It is the most magical feeling in the world. ❤️ #20Weeks',
    likes: 24,
    comments: 5,
    time: '2h ago',
    avatar: 'https://picsum.photos/seed/ananya/100/100'
  },
  {
    id: '2',
    author: 'Priya Patel',
    content: 'Any tips for morning sickness? It has been quite rough this week. 🤢',
    likes: 12,
    comments: 18,
    time: '4h ago',
    avatar: 'https://picsum.photos/seed/priya/100/100'
  },
  {
    id: '3',
    author: 'Meera Reddy',
    content: 'Just had my 7th-month scan. Baby is growing perfectly! So grateful. 🙏',
    likes: 45,
    comments: 8,
    time: '6h ago',
    avatar: 'https://picsum.photos/seed/meera/100/100'
  }
];

export const INSIGHTS_CONTENT = [
  { title: "Sleep Better", category: "Wellness", content: "Try sleeping on your left side to improve blood flow to the placenta.", icon: "🌙" },
  { title: "Hydration Key", category: "Health", content: "Drinking enough water helps maintain amniotic fluid levels.", icon: "💧" },
  { title: "Gentle Yoga", category: "Exercise", content: "Prenatal yoga can help reduce back pain and prepare for labor.", icon: "🧘" },
  { title: "Iron Intake", category: "Nutrition", content: "Include spinach and lentils in your diet to prevent anemia.", icon: "🥬" }
];

export const TRANSLATIONS = {
  en: {
    dashboard: "Home",
    insights: "Insights",
    community: "Community",
    chat: "Assistant",
    profile: "Profile",
    babySize: "Your baby is about the size of",
    insight: "Today's Insight",
    diet: "Regional Diet",
    eat: "Foods to Eat",
    avoid: "Foods to Avoid",
    emergencyHelp: "Emergency Help",
    emergencyWarning: "HIGH RISK WARNING",
    emergencyAction: "Go to nearest hospital immediately",
    callHospital: "Call Hospital",
    riskSummary: "Risk Summary",
    latestResult: "Latest AI Result",
    newPost: "New Post",
    shareExperience: "Share your experience...",
    symptoms: "Symptoms",
    education: "Education",
    bodySupport: "Body Support",
    care: "Care",
    language: "Language"
  },
  hi: {
    dashboard: "होम",
    insights: "इनसाइट्स",
    community: "कम्युनिटी",
    chat: "असिस्टेंट",
    profile: "प्रोफ़ाइल",
    babySize: "आपका बच्चा लगभग इस आकार का है",
    insight: "आज का विचार",
    diet: "क्षेत्रीय आहार",
    eat: "खाने योग्य भोजन",
    avoid: "परहेज करें",
    emergencyHelp: "आपातकालीन सहायता",
    emergencyWarning: "उच्च जोखिम चेतावनी",
    emergencyAction: "तुरंत नजदीकी अस्पताल जाएं",
    callHospital: "अस्पताल को कॉल करें",
    riskSummary: "जोखिम सारांश",
    latestResult: "नवीनतम AI परिणाम",
    newPost: "नई पोस्ट",
    shareExperience: "अपना अनुभव साझा करें...",
    symptoms: "लक्षण",
    education: "शिक्षा",
    bodySupport: "शरीर सहायता",
    care: "देखभाल",
    language: "भाषा"
  },
  kn: {
    dashboard: "ಮುಖಪುಟ",
    insights: "ಒಳನೋಟಗಳು",
    community: "ಸಮುದಾಯ",
    chat: "ಸಹಾಯಕ",
    profile: "ಪ್ರೊಫೈಲ್",
    babySize: "ನಿಮ್ಮ ಮಗುವಿನ ಗಾತ್ರವು ಸುಮಾರು",
    insight: "ಇಂದಿನ ಒಳನೋಟ",
    diet: "ಪ್ರಾದೇಶಿಕ ಆಹಾರ",
    eat: "ತಿನ್ನಬೇಕಾದ ಆಹಾರಗಳು",
    avoid: "ತಪ್ಪಿಸಬೇಕಾದ ಆಹಾರಗಳು",
    emergencyHelp: "ತುರ್ತು ಸಹಾಯ",
    emergencyWarning: "ಹೆಚ್ಚಿನ ಅಪಾಯದ ಎಚ್ಚರಿಕೆ",
    emergencyAction: "ತಕ್ಷಣ ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ",
    callHospital: "ಆಸ್ಪತ್ರೆಗೆ ಕರೆ ಮಾಡಿ",
    riskSummary: "ಅಪಾಯದ ಸಾರಾಂಶ",
    latestResult: "ಇತ್ತೀಚಿನ AI ಫಲಿತಾಂಶ",
    newPost: "ಹೊಸ ಪೋಸ್ಟ್",
    shareExperience: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ...",
    symptoms: "ರೋಗಲಕ್ಷಣಗಳು",
    education: "ಶಿಕ್ಷಣ",
    bodySupport: "ದೇಹದ ಬೆಂಬಲ",
    care: "ಆರೈಕೆ",
    language: "ಭಾಷೆ"
  }
};
