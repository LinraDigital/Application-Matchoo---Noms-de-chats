import { useImperativeHandle, type Ref } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { C, F, formatLettres } from '@/lib/theme';
import type { Nom } from '@/lib/types';

import { Patte } from './Icones';

export type CarteHandle = { lancer: (aime: boolean) => void };

type Props = {
  nom: Nom;
  nomFamille: string;
  actif: boolean;
  onSwipe: (aime: boolean) => void;
  ref?: Ref<CarteHandle>;
};

export function CarteNom({ nom, nomFamille, actif, onSwipe, ref }: Props) {
  const { width } = useWindowDimensions();
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const lancer = (aime: boolean) => {
    x.value = withTiming((aime ? 1 : -1) * width * 1.5, { duration: 240 }, (fini) => {
      if (fini) scheduleOnRN(onSwipe, aime);
    });
  };
  useImperativeHandle(ref, () => ({ lancer }));

  const pan = Gesture.Pan()
    .enabled(actif)
    .onUpdate((e) => {
      x.value = e.translationX;
      y.value = e.translationY * 0.4;
    })
    .onEnd((e) => {
      const seuil = width * 0.28;
      if (Math.abs(x.value) > seuil || Math.abs(e.velocityX) > 900) {
        const dir = Math.sign(x.value || e.velocityX);
        x.value = withTiming(dir * width * 1.5, { duration: 220 }, (fini) => {
          if (fini) scheduleOnRN(onSwipe, dir > 0);
        });
        y.value = withTiming(y.value + e.velocityY * 0.1, { duration: 220 });
      } else {
        x.value = withSpring(0);
        y.value = withSpring(0);
      }
    });

  const styleCarte = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${interpolate(x.value, [-width, width], [-14, 14])}deg` },
    ],
  }));
  const styleOui = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [20, width * 0.25], [0, 1], Extrapolation.CLAMP),
  }));
  const styleNon = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [-width * 0.25, -20], [1, 0], Extrapolation.CLAMP),
  }));

  const taillePolice = nom.name.length > 14 ? 38 : nom.name.length > 9 ? 52 : 70;
  const lettres = nom.name.replace(/[^A-Za-z]/g, '').length;

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[s.carte, styleCarte]}>
        <Animated.View style={[s.tampon, s.tamponOui, styleOui]}>
          <Text style={[s.tamponTxt, { color: C.vert }]}>J’AIME</Text>
        </Animated.View>
        <Animated.View style={[s.tampon, s.tamponNon, styleNon]}>
          <Text style={[s.tamponTxt, { color: C.bleu }]}>BOF</Text>
        </Animated.View>

        <View style={s.haut}>
          <View style={s.medaillon}>
            <Patte couleur={C.nuit} taille={40} />
          </View>
          <Text style={[s.nom, { fontSize: taillePolice }]} numberOfLines={2} adjustsFontSizeToFit>
            {nom.name}
          </Text>
        </View>

        <View style={s.bas}>
          {nomFamille ? (
            <Text style={s.nomComplet}>
              {nom.name} {nomFamille}
            </Text>
          ) : (
            <Text style={s.nomComplet}>Swipez pour choisir</Text>
          )}
          <View style={s.infos}>
            <View style={s.info}>
              <Text style={s.infoLabel}>Initiale</Text>
              <Text style={s.infoValeur}>{nom.letter}</Text>
            </View>
            <View style={s.info}>
              <Text style={s.infoLabel}>Longueur</Text>
              <Text style={s.infoValeur}>{formatLettres(lettres)}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const s = StyleSheet.create({
  carte: {
    ...StyleSheet.absoluteFill,
    backgroundColor: C.carte,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: C.nuit,
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8,
  },
  haut: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 20,
    backgroundColor: C.nuit,
    borderBottomLeftRadius: 56,
    borderBottomRightRadius: 56,
  },
  medaillon: {
    width: 80,
    height: 80,
    borderRadius: 28,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-6deg' }],
  },
  nom: { fontFamily: F.titre, color: '#fff', letterSpacing: -0.5, textAlign: 'center' },
  bas: { padding: 22, paddingTop: 20, gap: 14 },
  nomComplet: { fontFamily: F.texteMedium, fontSize: 16, color: C.discret, textAlign: 'center' },
  infos: { flexDirection: 'row', gap: 10 },
  info: { flex: 1, backgroundColor: C.puce, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 18 },
  infoLabel: { fontFamily: F.texte, fontSize: 12, color: C.discret },
  infoValeur: { fontFamily: F.texteBold, fontSize: 15, color: C.encre, marginTop: 1 },
  tampon: {
    position: 'absolute',
    top: 28,
    zIndex: 2,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tamponOui: { right: 20, borderColor: C.vert, transform: [{ rotate: '12deg' }] },
  tamponNon: { left: 20, borderColor: C.bleu, transform: [{ rotate: '-12deg' }] },
  tamponTxt: { fontFamily: F.titre, fontSize: 26, letterSpacing: 1 },
});
