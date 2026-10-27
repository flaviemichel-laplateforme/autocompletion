import { useEffect } from 'react';

const DEFAULT_TITLE = 'MiamMiam – Recherche de recettes';

// Met à jour le <title> de l'onglet selon la page affichée (SEO + accessibilité)
function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | MiamMiam` : DEFAULT_TITLE;
    }, [title]);
}

export default useDocumentTitle;
