# Conventions de nommage - Projet PAP

Stack : NextJS / JavaScript / Tailwind / Shadcn / HugeIcons / Odoo API

---

## 1. Variables (anglais)

Toutes les variables, fonctions, composants et fichiers sont nommés **en anglais**, même si le contenu métier (textes, données) reste en français.

### Casse

| Élément                    | Convention                  | Exemple                               |
| -------------------------- | --------------------------- | ------------------------------------- |
| Variables                  | `camelCase`                 | `productPrice`, `stockQuantity`       |
| Fonctions                  | `camelCase`, verbe d'action | `getProductStock()`, `formatPrice()`  |
| Composants React           | `PascalCase`                | `ProductCard`, `ProStockTable`        |
| Fichiers composants        | `PascalCase.jsx`            | `ProductCard.jsx`                     |
| Fichiers utilitaires/hooks | `camelCase.js`              | `useCart.js`, `formatPrice.js`        |
| Constantes globales        | `UPPER_SNAKE_CASE`          | `MAX_PALLET_SIZE`, `DEFAULT_CURRENCY` |
| Booléens                   | préfixe `is`/`has`/`can`    | `isProUser`, `hasStock`, `canOrder`   |

### Règles de clarté

- Nom explicite plutôt que court : `wholesalePrice` plutôt que `wp`.
- Pas de mix français/anglais : `getProduits()` → `getProducts()`
- Vocabulaire métier traduit de façon cohérente sur tout le projet :

| Terme métier (FR)    | Terme technique (EN) |
| -------------------- | -------------------- |
| Particulier          | `retailCustomer`     |
| Professionnel        | `proCustomer`        |
| Prix grossiste       | `wholesalePrice`     |
| Prix particulier     | `retailPrice`        |
| Décolisage           | `repackaging`        |
| Franco de port       | `freeShipping`       |
| Tournée de livraison | `deliveryRoute`      |
| Stock disponible     | `availableStock`     |

Lexique à étoffer au besoin

---

## 2. Commits (préfixes prépositionnels)

Format :

```
<type>: <description au présent, en anglais ou français, courte et précise>
```

### Types autorisés

| Préfixe     | Usage                                                               |
| ----------- | ------------------------------------------------------------------- |
| `add:`      | Ajout d'une fonctionnalité, fichier, composant                      |
| `fix:`      | Correction de bug                                                   |
| `update:`   | Modification d'une fonctionnalité existante (comportement inchangé) |
| `remove:`   | Suppression de code, fichier, fonctionnalité                        |
| `refactor:` | Réécriture sans changement fonctionnel                              |
| `style:`    | Mise en forme, CSS, Tailwind, sans impact logique                   |
| `test:`     | Ajout ou modification de tests (Jest, Playwright)                   |
| `docs:`     | Documentation                                                       |
| `chore:`    | Tâches techniques (config, dépendances, CI)                         |
| `perf:`     | Optimisation de performance                                         |

### Exemples

```
add: pro customer login page
fix: incorrect wholesale price calculation for La Vie Claire
update: stock display on product card
remove: unused Odoo sync helper
refactor: extract price logic into usePricing hook
test: add e2e flow for retail checkout
chore: bump next.js to 15.2
```

### Règles

- Un commit = un changement logique.
- Description à l'impératif/présent, sans majuscule finale, sans point.
- Référencer le ticket si applicable : `fix: stock sync delay (#42)`

---

## 3. Branches

Format :

```
<type>/<short-description-in-kebab-case>
```

### Types (alignés sur les commits)

| Préfixe     | Usage                          |
| ----------- | ------------------------------ |
| `feature/`  | Nouvelle fonctionnalité        |
| `fix/`      | Correction de bug              |
| `refactor/` | Refonte technique              |
| `chore/`    | Tâche technique/config         |
| `hotfix/`   | Correctif urgent en production |

### Exemples

```
feature/pro-space-login
feature/odoo-stock-sync
fix/wholesale-price-la-vie-claire
refactor/pricing-logic
chore/setup-playwright
hotfix/checkout-crash
```

### Règles

- Toujours en anglais, kebab-case, sans accents ni majuscules.
- Nom court mais explicite (3 à 5 mots max).
- Une branche = une fonctionnalité ou un correctif isolé, mergée puis supprimée après merge dans `main`/`develop`.

---

## 4. Organisation des composants (`components/`)

```
components/
├── ui/            → composants shadcn (générés, ne pas modifier à la main)
├── layout/         → Header, Footer, Sidebar... (structure commune à tout le site)
├── shared/         → composants maison réutilisés sur plusieurs pages
└── [page-name]/    → composants maison propres à une seule page
```

### Règles

- **`ui/`** : réservé aux composants générés par shadcn (`button`, `card`, `dialog`...). On ne les modifie pas directement ; on les surcharge/étend via des wrappers si besoin.
- **`layout/`** : tout ce qui structure le site globalement - `Header.jsx`, `Footer.jsx`, `Navbar.jsx`, `ProSidebar.jsx`.
- **`[page-name]/`** : un dossier par page, en `kebab-case`, contenant les composants **utilisés uniquement par cette page**.
  - Exemple : `components/product-page/ProGallery.jsx`, `components/checkout/OrderSummary.jsx`
- **`shared/`** : dès qu'un composant maison est utilisé par **2 pages ou plus**, il migre dans `shared/`.
  - Exemple : `components/shared/ProductCard.jsx`, `components/shared/PriceTag.jsx`

### Règle de décision

> Un composant utilisé par une seule page → dossier de la page.
> Un composant utilisé par plusieurs pages → `shared/`.
> Si un doute apparaît en cours de dev (le composant commence à être réutilisé ailleurs) → le déplacer vers `shared/` dès que le deuxième usage apparaît.

### Exemple concret

```
components/
├── ui/
│   ├── button.jsx
│   └── dialog.jsx
├── layout/
│   ├── Header.jsx
│   └── Footer.jsx
├── shared/
│   ├── ProductCard.jsx
│   └── StockBadge.jsx
├── product-page/
│   └── ProGallery.jsx
└── checkout/
    └── OrderSummary.jsx
```

---

## 5. Résumé rapide

- **Variables/fonctions/composants** → anglais, `camelCase`/`PascalCase`/`UPPER_SNAKE_CASE`.
- **Commits** → `type: description`.
- **Branches** → `type/description-kebab-case`.
- **Vocabulaire métier** → toujours traduit selon le lexique partagé, jamais mélangé FR/EN.
- **Composants** → `ui/` (shadcn) · `layout/` (header/footer) · `shared/` (multi-pages) · `[page-name]/` (mono-page).
