import { API_BASE_URL } from '../config';

/**
 * Resolves an image path from backend or relative path into a fully qualified URL.
 * Handles http/https absolute URLs, backend upload paths, and fallback defaults.
 * 
 * @param {string|null|undefined} path - The image path from DB (e.g. "uploads/profiles/kasun.jpg")
 * @param {string} [fallback] - Optional fallback image URL or SVG
 * @returns {string} Fully resolved image URL
 */
export function resolveImageUrl(path, fallback = '') {
    if (!path) return fallback;
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
        return path;
    }
    // Clean leading slashes
    const cleanPath = path.replace(/^\/+/, '');
    return `${API_BASE_URL}/${cleanPath}`;
}

/**
 * OnError handler that tries frontend public /uploads folder if backend /api/uploads fails,
 * and finally falls back to a clean placeholder.
 */
export function handleImageFallback(e, fallback) {
    const currentSrc = e.target.src || '';
    
    // If backend URL failed, try public root uploads/
    if (currentSrc.includes('/api/uploads/')) {
        const relativePath = currentSrc.substring(currentSrc.indexOf('/uploads/'));
        e.target.src = relativePath;
        return;
    }

    if (fallback) {
        e.target.src = fallback;
    } else {
        e.target.style.display = 'none';
    }
}
