export function formatSportNameForImage(sportName: string | null): string | null {
    if (!sportName) return null;
    return sportName.toLowerCase().replace(/\s+/g, '_');
}

export function formatRoleNameForImage(roleName: string | null): string | null {
    if (!roleName) return null;
    return roleName.toLowerCase().replace(/\s+/g, '_');
}
