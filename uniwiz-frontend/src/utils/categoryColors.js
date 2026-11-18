// FILE: src/utils/categoryColors.js (Bespoke Emerald & Academic Harmony)
// ========================================================================

// Predefined color schemes for categories (refined, modern, accessible)
const colorSchemes = [
    { bg: 'bg-emerald-50 border border-emerald-200/80', text: 'text-emerald-800' },
    { bg: 'bg-amber-50 border border-amber-200/80', text: 'text-amber-800' },
    { bg: 'bg-teal-50 border border-teal-200/80', text: 'text-teal-800' },
    { bg: 'bg-sky-50 border border-sky-200/80', text: 'text-sky-800' },
    { bg: 'bg-rose-50 border border-rose-200/80', text: 'text-rose-800' },
    { bg: 'bg-indigo-50 border border-indigo-200/80', text: 'text-indigo-800' },
    { bg: 'bg-orange-50 border border-orange-200/80', text: 'text-orange-800' },
    { bg: 'bg-slate-100 border border-slate-200/80', text: 'text-slate-800' },
    { bg: 'bg-violet-50 border border-violet-200/80', text: 'text-violet-800' },
    { bg: 'bg-cyan-50 border border-cyan-200/80', text: 'text-cyan-800' }
];

// Default color for unknown categories
const defaultColor = { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-800' };

// Predefined category mappings
const predefinedCategories = {
    'Web Development': { bg: 'bg-emerald-50 border border-emerald-200/90', text: 'text-emerald-800' },
    'IT & Software Development': { bg: 'bg-emerald-50 border border-emerald-200/90', text: 'text-emerald-800' },
    'Information Technology': { bg: 'bg-emerald-50 border border-emerald-200/90', text: 'text-emerald-800' },
    'Tutoring': { bg: 'bg-amber-50 border border-amber-200/90', text: 'text-amber-800' },
    'Tutoring & Education': { bg: 'bg-amber-50 border border-amber-200/90', text: 'text-amber-800' },
    'Graphic Design': { bg: 'bg-rose-50 border border-rose-200/90', text: 'text-rose-800' },
    'Design & Creative': { bg: 'bg-rose-50 border border-rose-200/90', text: 'text-rose-800' },
    'Content Writing': { bg: 'bg-teal-50 border border-teal-200/90', text: 'text-teal-800' },
    'Writing & Translation': { bg: 'bg-teal-50 border border-teal-200/90', text: 'text-teal-800' },
    'Writing & Content': { bg: 'bg-teal-50 border border-teal-200/90', text: 'text-teal-800' },
    'Digital Marketing & SEO': { bg: 'bg-sky-50 border border-sky-200/90', text: 'text-sky-800' },
    'Marketing & Sales': { bg: 'bg-sky-50 border border-sky-200/90', text: 'text-sky-800' },
    'Event Support': { bg: 'bg-orange-50 border border-orange-200/90', text: 'text-orange-800' },
    'Data Entry & Admin': { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-800' },
    'Administrative Support': { bg: 'bg-slate-100 border border-slate-200', text: 'text-slate-800' },
    'Customer Service': { bg: 'bg-indigo-50 border border-indigo-200/90', text: 'text-indigo-800' },
};

// Cache for dynamically assigned colors
const colorCache = new Map();

// Function to generate a hash from category name
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// Function to get color for a category
export function getCategoryColor(categoryName) {
    if (!categoryName) return defaultColor;
    
    if (predefinedCategories[categoryName]) {
        return predefinedCategories[categoryName];
    }
    
    if (colorCache.has(categoryName)) {
        return colorCache.get(categoryName);
    }
    
    const hash = hashString(categoryName);
    const colorIndex = hash % colorSchemes.length;
    const color = colorSchemes[colorIndex];
    
    colorCache.set(categoryName, color);
    return color;
}

// Function to get the combined CSS class
export function getCategoryColorClass(categoryName) {
    const color = getCategoryColor(categoryName);
    return `${color.bg} ${color.text}`;
}

// Function to get all category colors (for admin panel)
export function getAllCategoryColors(categories) {
    const result = {};
    categories.forEach(category => {
        result[category] = getCategoryColor(category);
    });
    return result;
}

// Function to reset color cache
export function resetColorCache() {
    colorCache.clear();
}

export { predefinedCategories, colorSchemes, defaultColor };
