import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Construit l'URL complète d'une image à partir de son chemin relatif
 * @param imagePath - Chemin relatif de l'image (ex: "/kc.png" ou "kc.png")
 * @returns URL complète de l'image ou null si le chemin est vide
 */
export function getImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;

    const apiUrl = process.env['NEXT_PUBLIC_API_URL'] || 'http://localhost:3001';

    // Nettoyer le chemin : enlever le "/" initial s'il existe
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;

    return `${apiUrl}/public/images/${cleanPath}`;
}

/**
 * Construit l'URL d'une image de joueur
 * @param imagePath - Nom du fichier image (ex: "photo.png")
 * @returns URL complète de l'image
 */
export function getPlayerImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return getImageUrl(`player/${cleanPath}`);
}

/**
 * Construit l'URL d'une image de sport
 * @param imagePath - Nom du fichier image (ex: "football.png")
 * @returns URL complète de l'image
 */
export function getSportImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return getImageUrl(`sport/${cleanPath}`);
}

/**
 * Construit l'URL d'une image de position
 * @param imagePath - Nom du fichier image (ex: "football_attaquant.png")
 * @returns URL complète de l'image
 */
export function getPositionImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return getImageUrl(`position/${cleanPath}`);
}

/**
 * Construit l'URL d'une image d'équipe
 * @param imagePath - Nom du fichier image (ex: "logo.png")
 * @returns URL complète de l'image
 */
export function getTeamImageUrl(imagePath: string | null | undefined): string | null {
    if (!imagePath) return null;
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return getImageUrl(`team/${cleanPath}`);
}
