/** Palette « lavande » : violet moyen (principal), orchidée (accent), fond lilas très clair. */
export const C = {
  bg: '#F4F0FF',
  carte: '#FFFFFF',
  encre: '#2A2150',
  encre2: '#51477E',
  discret: '#8F86B5',
  trait: '#DED4FA',
  nuit: '#7B5CD6', // violet moyen : éléments sélectionnés, cartes
  accent: '#9B6FF0', // violet clair vif : boutons principaux
  or: '#E9DEFF',
  bleu: '#6A47C9', // violet soutenu : textes d'action secondaires
  vert: '#2F9E78',
  puce: '#EBE3FF', // fonds de pastilles
  rose: '#F58FBF', // petite touche chaude (cœur, badges)
} as const;

export const F = {
  titre: 'Fredoka_700Bold',
  titreBold: 'Fredoka_600SemiBold',
  texte: 'Nunito_400Regular',
  texteMedium: 'Nunito_600SemiBold',
  texteBold: 'Nunito_700Bold',
} as const;

export const formatNombre = (n: number) => n.toLocaleString('fr-FR');

/** « 1 lettre », « 5 lettres » : en français, le pluriel commence à 2. */
export const formatLettres = (n: number) => `${n} lettre${n >= 2 ? 's' : ''}`;
