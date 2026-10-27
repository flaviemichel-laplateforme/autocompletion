// TheMealDB sert des versions réduites d'une image : /small (200px),
// /medium (350px) et /large (700px). Évite de télécharger l'original pour une miniature.
export const getThumb = (url, size = 'medium') => (url ? `${url}/${size}` : url);
