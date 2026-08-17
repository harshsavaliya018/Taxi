// Full multi-language dictionary for the TaxiWalt landing page.
//
// This is a client-side i18n system (the site is a static export, so there is
// no server-side locale routing). `en` is the source of truth for the shape of
// the dictionary; every other locale must match it — enforced by the
// `Dictionary` type below.

export type LocaleCode =
  | "en"
  | "de"
  | "fr"
  | "es"
  | "pt"
  | "ru"
  | "ua"
  | "cn";

export type Language = {
  code: LocaleCode;
  /** flag/region code shown in the pill, e.g. "US" */
  region: string;
  /** language name in its own language */
  label: string;
  /** short code shown in the header pill, e.g. "EN" */
  short: string;
  /** value for the <html lang> attribute */
  htmlLang: string;
};

export const LANGUAGES: Language[] = [
  { code: "en", region: "US", label: "English", short: "EN", htmlLang: "en" },
  { code: "de", region: "DE", label: "Deutsch", short: "DE", htmlLang: "de" },
  { code: "fr", region: "FR", label: "Français", short: "FR", htmlLang: "fr" },
  { code: "es", region: "ES", label: "Español", short: "ES", htmlLang: "es" },
  { code: "pt", region: "PT", label: "Português", short: "PT", htmlLang: "pt" },
  { code: "ru", region: "RU", label: "Русский", short: "RU", htmlLang: "ru" },
  { code: "ua", region: "UA", label: "Українська", short: "UA", htmlLang: "uk" },
  { code: "cn", region: "CN", label: "中文", short: "CN", htmlLang: "zh" },
];

export const DEFAULT_LOCALE: LocaleCode = "en";

export type Dictionary = {
  nav: { main: string; advantages: string; faq: string; signup: string };
  header: { obtainCard: string };
  hero: {
    badge: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    subtitle: string;
    obtainCard: string;
    discoverMore: string;
    reassure: string;
    trustText: string; // {n} placeholder for "200M+"
    cardBalance: string;
    cardChip: string;
    paymentApproved: string;
  };
  stats: {
    trustedBy: string;
    people: string;
    foundedIn: string;
    independently: string;
    audited: string;
    iso: string;
    certified: string;
    topReviews: string;
  };
  privileges: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { title: string; text: string }[]; // 6
  };
  testimonials: {
    eyebrow: string;
    title: string;
    subtitle: string;
    quotes: string[]; // 3
    badges: string[]; // 4
  };
  faq: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: { q: string; a: string }[]; // 5
  };
  joinCta: {
    eyebrow: string;
    title: string;
    subtitle: string;
    getCard: string;
    reassure: string;
  };
  footer: {
    tagline: string;
    productTitle: string;
    companyTitle: string;
    legalTitle: string;
    product: string[]; // 4
    company: string[]; // 4
    legal: string[]; // 3
    rights: string;
    note: string;
  };
  sticky: { title: string; sub: string; button: string };
};

const en: Dictionary = {
  nav: { main: "Main", advantages: "Advantages", faq: "FAQ", signup: "Sign Up" },
  header: { obtainCard: "Obtain Card" },
  hero: {
    badge: "2,347 cards issued in the last 24 hours",
    titleLead: "Create Your ",
    titleAccent: "Cryptocurrency Card",
    titleTail: " from Trust Wallet",
    subtitle:
      "Transactions proceed straight from your Trust Wallet. Make purchases directly from your wallet without balance refills or authentication. Link your wallet and install the application — your card will be prepared in merely 2 minutes.",
    obtainCard: "Obtain Your Card",
    discoverMore: "Discover More",
    reassure: "No registration · Funds stay in your wallet · Cancel anytime",
    trustText: "{n} people trust Trust Wallet",
    cardBalance: "Balance",
    cardChip: "Trust Card",
    paymentApproved: "Payment approved",
  },
  stats: {
    trustedBy: "Trusted By",
    people: "people",
    foundedIn: "Founded In",
    independently: "Independently",
    audited: "Audited",
    iso: "ISO",
    certified: "Certified",
    topReviews: "Top Reviews",
  },
  privileges: {
    eyebrow: "Advantages",
    title: "Received privileges",
    subtitle: "Benefits of using Crypto Card from Trust Wallet",
    items: [
      {
        title: "Instant start, no registration",
        text: "No need to register or create additional accounts. Start using your card immediately.",
      },
      {
        title: "Direct connection to Trust Wallet",
        text: "Crypto card is directly connected to your Trust Wallet. Payment goes directly from your wallet.",
      },
      {
        title: "Payment directly from Trust Wallet",
        text: "Payment goes directly from your Trust Wallet. Use your crypto funds instantly without intermediaries.",
      },
      {
        title: "KYC-free card — complete anonymity",
        text: "Crypto card from Trust Wallet without KYC, directly linked to your wallet.",
      },
      {
        title: "Funds remain in your wallet",
        text: "Money remains in your Trust Wallet until spent. It cannot be blocked or restricted.",
      },
      {
        title: "Verified statistics and metrics",
        text: "Number of users, total transaction volume, daily transaction count.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Loved by users",
    title: "Trusted by millions worldwide",
    subtitle: "Real people spending crypto directly from their wallet, every day.",
    quotes: [
      "Set up in under two minutes and paid for coffee straight from my wallet. No top-ups, no accounts — it just works.",
      "Finally a card where my funds actually stay in my own wallet until I spend them. The non-custodial part sold me instantly.",
      "No KYC, no waiting, no nonsense. I linked Trust Wallet and was buying within minutes. Exactly what crypto payments should be.",
    ],
    badges: [
      "Independently Audited",
      "ISO Certified",
      "Non-custodial",
      "256-bit Encryption",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "FAQ",
    subtitle: "Find answers to some of the most common questions",
    items: [
      {
        q: "What is Crypto Card from Trust Wallet?",
        a: "Crypto Card from Trust Wallet is a card for users who want to use cryptocurrencies in their daily life. Payment goes directly from your Trust Wallet. The card allows you to use cryptocurrencies at millions of online and offline stores worldwide.",
      },
      {
        q: "How does Crypto Card from Trust Wallet work?",
        a: "The card is linked directly to your Trust Wallet. When you make a payment, the amount is taken straight from your wallet balance and settled instantly — no top-ups or separate accounts required.",
      },
      {
        q: "Do I need Trust Wallet to get or use a crypto card?",
        a: "Yes. The card connects to your Trust Wallet, so you need the Trust Wallet app installed and a wallet set up before linking and ordering your card.",
      },
      {
        q: "What can I do with Crypto Card from Trust Wallet?",
        a: "You can pay online and in-store anywhere major cards are accepted, spend your crypto instantly, and manage everything directly from your wallet without intermediaries.",
      },
      {
        q: "What are the prerequisites for ordering Crypto Card?",
        a: "You need the Trust Wallet app with an active wallet and a supported balance. Link your wallet, confirm the connection, and your card will be prepared in about 2 minutes.",
      },
    ],
  },
  joinCta: {
    eyebrow: "Get started in 2 minutes",
    title: "Join us today",
    subtitle:
      "Crypto Card from Trust Wallet. Payment goes directly from your Trust Wallet. Secure, fast and convenient.",
    getCard: "Get Your Card",
    reassure: "No registration · No KYC · Funds stay in your wallet",
  },
  footer: {
    tagline:
      "Create your cryptocurrency card from Trust Wallet. Payments straight from your wallet — no registration, no KYC.",
    productTitle: "Product",
    companyTitle: "Company",
    legalTitle: "Legal",
    product: ["Advantages", "How it works", "FAQ", "Get Card"],
    company: ["About", "Security", "Reviews", "Contact"],
    legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
    rights: "All rights reserved.",
    note: "Non-custodial · Independently audited",
  },
  sticky: {
    title: "Get your crypto card",
    sub: "Ready in 2 minutes · No KYC",
    button: "Obtain Card",
  },
};

const de: Dictionary = {
  nav: { main: "Start", advantages: "Vorteile", faq: "FAQ", signup: "Registrieren" },
  header: { obtainCard: "Karte holen" },
  hero: {
    badge: "2.347 Karten in den letzten 24 Stunden ausgestellt",
    titleLead: "Erstellen Sie Ihre ",
    titleAccent: "Krypto-Karte",
    titleTail: " von Trust Wallet",
    subtitle:
      "Transaktionen laufen direkt über Ihre Trust Wallet. Zahlen Sie direkt aus Ihrer Wallet – ohne Aufladen und ohne Authentifizierung. Verbinden Sie Ihre Wallet und installieren Sie die App – Ihre Karte ist in nur 2 Minuten bereit.",
    obtainCard: "Karte holen",
    discoverMore: "Mehr erfahren",
    reassure: "Keine Registrierung · Guthaben bleibt in Ihrer Wallet · Jederzeit kündbar",
    trustText: "{n} Menschen vertrauen Trust Wallet",
    cardBalance: "Guthaben",
    cardChip: "Trust Card",
    paymentApproved: "Zahlung genehmigt",
  },
  stats: {
    trustedBy: "Vertraut von",
    people: "Nutzern",
    foundedIn: "Gegründet",
    independently: "Unabhängig",
    audited: "Geprüft",
    iso: "ISO",
    certified: "Zertifiziert",
    topReviews: "Top-Bewertungen",
  },
  privileges: {
    eyebrow: "Vorteile",
    title: "Ihre Vorteile",
    subtitle: "Die Vorteile der Krypto-Karte von Trust Wallet",
    items: [
      {
        title: "Sofort starten, keine Registrierung",
        text: "Keine Registrierung und keine zusätzlichen Konten nötig. Nutzen Sie Ihre Karte sofort.",
      },
      {
        title: "Direkte Verbindung zur Trust Wallet",
        text: "Die Krypto-Karte ist direkt mit Ihrer Trust Wallet verbunden. Zahlungen erfolgen direkt aus Ihrer Wallet.",
      },
      {
        title: "Zahlung direkt aus der Trust Wallet",
        text: "Zahlungen erfolgen direkt aus Ihrer Trust Wallet. Nutzen Sie Ihr Krypto-Guthaben sofort, ohne Zwischenhändler.",
      },
      {
        title: "Karte ohne KYC – volle Anonymität",
        text: "Krypto-Karte von Trust Wallet ohne KYC, direkt mit Ihrer Wallet verbunden.",
      },
      {
        title: "Guthaben bleibt in Ihrer Wallet",
        text: "Ihr Geld bleibt bis zur Ausgabe in Ihrer Trust Wallet. Es kann nicht gesperrt oder eingeschränkt werden.",
      },
      {
        title: "Verifizierte Statistiken und Kennzahlen",
        text: "Anzahl der Nutzer, gesamtes Transaktionsvolumen, tägliche Transaktionen.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Von Nutzern geliebt",
    title: "Millionen vertrauen weltweit",
    subtitle: "Echte Menschen, die täglich Krypto direkt aus ihrer Wallet ausgeben.",
    quotes: [
      "In unter zwei Minuten eingerichtet und den Kaffee direkt aus der Wallet bezahlt. Kein Aufladen, keine Konten – es funktioniert einfach.",
      "Endlich eine Karte, bei der mein Guthaben bis zur Ausgabe in meiner eigenen Wallet bleibt. Der Non-Custodial-Ansatz hat mich sofort überzeugt.",
      "Kein KYC, kein Warten, kein Aufwand. Trust Wallet verbunden und binnen Minuten eingekauft. Genau so sollten Krypto-Zahlungen sein.",
    ],
    badges: [
      "Unabhängig geprüft",
      "ISO-zertifiziert",
      "Non-custodial",
      "256-Bit-Verschlüsselung",
    ],
  },
  faq: {
    eyebrow: "Fragen",
    title: "FAQ",
    subtitle: "Antworten auf die häufigsten Fragen",
    items: [
      {
        q: "Was ist die Krypto-Karte von Trust Wallet?",
        a: "Die Krypto-Karte von Trust Wallet ist für Nutzer gedacht, die Kryptowährungen im Alltag verwenden möchten. Die Zahlung erfolgt direkt aus Ihrer Trust Wallet. Mit der Karte zahlen Sie in Millionen von Online- und Offline-Shops weltweit.",
      },
      {
        q: "Wie funktioniert die Krypto-Karte von Trust Wallet?",
        a: "Die Karte ist direkt mit Ihrer Trust Wallet verbunden. Bei einer Zahlung wird der Betrag sofort von Ihrem Wallet-Guthaben abgebucht – ohne Aufladen oder separate Konten.",
      },
      {
        q: "Brauche ich Trust Wallet für die Krypto-Karte?",
        a: "Ja. Die Karte wird mit Ihrer Trust Wallet verbunden. Sie benötigen also die installierte Trust-Wallet-App und eine eingerichtete Wallet, bevor Sie die Karte verbinden und bestellen.",
      },
      {
        q: "Was kann ich mit der Krypto-Karte tun?",
        a: "Sie zahlen online und im Geschäft überall, wo gängige Karten akzeptiert werden, geben Ihr Krypto sofort aus und verwalten alles direkt aus Ihrer Wallet – ohne Zwischenhändler.",
      },
      {
        q: "Welche Voraussetzungen gelten für die Bestellung?",
        a: "Sie benötigen die Trust-Wallet-App mit aktiver Wallet und einem unterstützten Guthaben. Verbinden Sie Ihre Wallet, bestätigen Sie die Verbindung, und Ihre Karte ist in etwa 2 Minuten bereit.",
      },
    ],
  },
  joinCta: {
    eyebrow: "In 2 Minuten startklar",
    title: "Werden Sie heute Teil",
    subtitle:
      "Krypto-Karte von Trust Wallet. Zahlungen direkt aus Ihrer Trust Wallet. Sicher, schnell und bequem.",
    getCard: "Karte holen",
    reassure: "Keine Registrierung · Kein KYC · Guthaben bleibt in Ihrer Wallet",
  },
  footer: {
    tagline:
      "Erstellen Sie Ihre Krypto-Karte von Trust Wallet. Zahlungen direkt aus Ihrer Wallet – keine Registrierung, kein KYC.",
    productTitle: "Produkt",
    companyTitle: "Unternehmen",
    legalTitle: "Rechtliches",
    product: ["Vorteile", "So funktioniert's", "FAQ", "Karte holen"],
    company: ["Über uns", "Sicherheit", "Bewertungen", "Kontakt"],
    legal: ["Datenschutz", "Nutzungsbedingungen", "Cookie-Richtlinie"],
    rights: "Alle Rechte vorbehalten.",
    note: "Non-custodial · Unabhängig geprüft",
  },
  sticky: {
    title: "Holen Sie Ihre Karte",
    sub: "In 2 Minuten bereit · Kein KYC",
    button: "Karte holen",
  },
};

const fr: Dictionary = {
  nav: { main: "Accueil", advantages: "Avantages", faq: "FAQ", signup: "S'inscrire" },
  header: { obtainCard: "Obtenir la carte" },
  hero: {
    badge: "2 347 cartes émises ces dernières 24 heures",
    titleLead: "Créez votre ",
    titleAccent: "carte crypto",
    titleTail: " depuis Trust Wallet",
    subtitle:
      "Les transactions passent directement par votre Trust Wallet. Payez directement depuis votre portefeuille, sans recharge ni authentification. Connectez votre portefeuille et installez l'application — votre carte sera prête en seulement 2 minutes.",
    obtainCard: "Obtenir votre carte",
    discoverMore: "En savoir plus",
    reassure: "Sans inscription · Vos fonds restent dans votre portefeuille · Annulable à tout moment",
    trustText: "{n} personnes font confiance à Trust Wallet",
    cardBalance: "Solde",
    cardChip: "Trust Card",
    paymentApproved: "Paiement approuvé",
  },
  stats: {
    trustedBy: "Approuvé par",
    people: "personnes",
    foundedIn: "Fondé en",
    independently: "Indépendamment",
    audited: "Audité",
    iso: "ISO",
    certified: "Certifié",
    topReviews: "Meilleurs avis",
  },
  privileges: {
    eyebrow: "Avantages",
    title: "Vos privilèges",
    subtitle: "Les avantages de la carte crypto de Trust Wallet",
    items: [
      {
        title: "Démarrage instantané, sans inscription",
        text: "Aucune inscription ni compte supplémentaire requis. Utilisez votre carte immédiatement.",
      },
      {
        title: "Connexion directe à Trust Wallet",
        text: "La carte crypto est directement connectée à votre Trust Wallet. Le paiement part directement de votre portefeuille.",
      },
      {
        title: "Paiement directement depuis Trust Wallet",
        text: "Le paiement part directement de votre Trust Wallet. Utilisez vos fonds crypto instantanément, sans intermédiaire.",
      },
      {
        title: "Carte sans KYC — anonymat total",
        text: "Carte crypto de Trust Wallet sans KYC, directement liée à votre portefeuille.",
      },
      {
        title: "Vos fonds restent dans votre portefeuille",
        text: "L'argent reste dans votre Trust Wallet jusqu'à la dépense. Il ne peut être ni bloqué ni restreint.",
      },
      {
        title: "Statistiques et métriques vérifiées",
        text: "Nombre d'utilisateurs, volume total des transactions, transactions quotidiennes.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Plébiscité par les utilisateurs",
    title: "La confiance de millions d'utilisateurs",
    subtitle: "De vraies personnes qui dépensent leur crypto directement depuis leur portefeuille, chaque jour.",
    quotes: [
      "Configuré en moins de deux minutes et payé mon café directement depuis mon portefeuille. Pas de recharge, pas de compte — ça marche, tout simplement.",
      "Enfin une carte où mes fonds restent dans mon propre portefeuille jusqu'à la dépense. L'aspect non-custodial m'a convaincu immédiatement.",
      "Sans KYC, sans attente, sans complications. J'ai connecté Trust Wallet et j'achetais en quelques minutes. Exactement ce que les paiements crypto devraient être.",
    ],
    badges: [
      "Audité indépendamment",
      "Certifié ISO",
      "Non-custodial",
      "Chiffrement 256 bits",
    ],
  },
  faq: {
    eyebrow: "Questions",
    title: "FAQ",
    subtitle: "Trouvez des réponses aux questions les plus fréquentes",
    items: [
      {
        q: "Qu'est-ce que la carte crypto de Trust Wallet ?",
        a: "La carte crypto de Trust Wallet s'adresse aux utilisateurs qui veulent utiliser les cryptomonnaies au quotidien. Le paiement part directement de votre Trust Wallet. La carte vous permet de payer dans des millions de commerces en ligne et physiques dans le monde.",
      },
      {
        q: "Comment fonctionne la carte crypto de Trust Wallet ?",
        a: "La carte est directement liée à votre Trust Wallet. Lors d'un paiement, le montant est prélevé directement sur le solde de votre portefeuille et réglé instantanément — sans recharge ni compte séparé.",
      },
      {
        q: "Ai-je besoin de Trust Wallet pour la carte crypto ?",
        a: "Oui. La carte se connecte à votre Trust Wallet ; vous devez donc avoir installé l'application Trust Wallet et configuré un portefeuille avant de lier et commander votre carte.",
      },
      {
        q: "Que puis-je faire avec la carte crypto de Trust Wallet ?",
        a: "Vous pouvez payer en ligne et en magasin partout où les grandes cartes sont acceptées, dépenser votre crypto instantanément et tout gérer directement depuis votre portefeuille, sans intermédiaire.",
      },
      {
        q: "Quelles sont les conditions pour commander la carte ?",
        a: "Vous avez besoin de l'application Trust Wallet avec un portefeuille actif et un solde compatible. Connectez votre portefeuille, confirmez la connexion, et votre carte sera prête en environ 2 minutes.",
      },
    ],
  },
  joinCta: {
    eyebrow: "Commencez en 2 minutes",
    title: "Rejoignez-nous dès aujourd'hui",
    subtitle:
      "Carte crypto de Trust Wallet. Le paiement part directement de votre Trust Wallet. Sûr, rapide et pratique.",
    getCard: "Obtenir votre carte",
    reassure: "Sans inscription · Sans KYC · Vos fonds restent dans votre portefeuille",
  },
  footer: {
    tagline:
      "Créez votre carte crypto depuis Trust Wallet. Paiements directement depuis votre portefeuille — sans inscription, sans KYC.",
    productTitle: "Produit",
    companyTitle: "Entreprise",
    legalTitle: "Légal",
    product: ["Avantages", "Comment ça marche", "FAQ", "Obtenir la carte"],
    company: ["À propos", "Sécurité", "Avis", "Contact"],
    legal: ["Confidentialité", "Conditions d'utilisation", "Politique de cookies"],
    rights: "Tous droits réservés.",
    note: "Non-custodial · Audité indépendamment",
  },
  sticky: {
    title: "Obtenez votre carte crypto",
    sub: "Prête en 2 minutes · Sans KYC",
    button: "Obtenir la carte",
  },
};

const es: Dictionary = {
  nav: { main: "Inicio", advantages: "Ventajas", faq: "FAQ", signup: "Registrarse" },
  header: { obtainCard: "Obtener tarjeta" },
  hero: {
    badge: "2.347 tarjetas emitidas en las últimas 24 horas",
    titleLead: "Crea tu ",
    titleAccent: "tarjeta de criptomonedas",
    titleTail: " desde Trust Wallet",
    subtitle:
      "Las transacciones se realizan directamente desde tu Trust Wallet. Compra directamente desde tu monedero, sin recargas ni autenticación. Conecta tu monedero e instala la aplicación: tu tarjeta estará lista en solo 2 minutos.",
    obtainCard: "Obtener tu tarjeta",
    discoverMore: "Saber más",
    reassure: "Sin registro · Tus fondos permanecen en tu monedero · Cancela cuando quieras",
    trustText: "{n} personas confían en Trust Wallet",
    cardBalance: "Saldo",
    cardChip: "Trust Card",
    paymentApproved: "Pago aprobado",
  },
  stats: {
    trustedBy: "Con la confianza de",
    people: "personas",
    foundedIn: "Fundada en",
    independently: "Auditada de forma",
    audited: "Independiente",
    iso: "ISO",
    certified: "Certificada",
    topReviews: "Mejores reseñas",
  },
  privileges: {
    eyebrow: "Ventajas",
    title: "Tus privilegios",
    subtitle: "Beneficios de usar la tarjeta cripto de Trust Wallet",
    items: [
      {
        title: "Inicio instantáneo, sin registro",
        text: "No necesitas registrarte ni crear cuentas adicionales. Empieza a usar tu tarjeta de inmediato.",
      },
      {
        title: "Conexión directa con Trust Wallet",
        text: "La tarjeta cripto está conectada directamente a tu Trust Wallet. El pago sale directamente de tu monedero.",
      },
      {
        title: "Pago directo desde Trust Wallet",
        text: "El pago sale directamente de tu Trust Wallet. Usa tus fondos cripto al instante, sin intermediarios.",
      },
      {
        title: "Tarjeta sin KYC — anonimato total",
        text: "Tarjeta cripto de Trust Wallet sin KYC, vinculada directamente a tu monedero.",
      },
      {
        title: "Los fondos permanecen en tu monedero",
        text: "El dinero permanece en tu Trust Wallet hasta que lo gastas. No puede bloquearse ni restringirse.",
      },
      {
        title: "Estadísticas y métricas verificadas",
        text: "Número de usuarios, volumen total de transacciones, transacciones diarias.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Adorada por los usuarios",
    title: "La confianza de millones en todo el mundo",
    subtitle: "Personas reales que gastan cripto directamente desde su monedero, cada día.",
    quotes: [
      "Configurada en menos de dos minutos y pagué el café directamente desde mi monedero. Sin recargas, sin cuentas: simplemente funciona.",
      "Por fin una tarjeta donde mis fondos permanecen en mi propio monedero hasta que los gasto. Lo no-custodial me convenció al instante.",
      "Sin KYC, sin esperas, sin líos. Conecté Trust Wallet y estaba comprando en minutos. Exactamente como deberían ser los pagos cripto.",
    ],
    badges: [
      "Auditada independientemente",
      "Certificada ISO",
      "No custodial",
      "Cifrado de 256 bits",
    ],
  },
  faq: {
    eyebrow: "Preguntas",
    title: "FAQ",
    subtitle: "Encuentra respuestas a las preguntas más frecuentes",
    items: [
      {
        q: "¿Qué es la tarjeta cripto de Trust Wallet?",
        a: "La tarjeta cripto de Trust Wallet es para usuarios que quieren usar criptomonedas en su día a día. El pago sale directamente de tu Trust Wallet. La tarjeta te permite usar criptomonedas en millones de tiendas online y físicas de todo el mundo.",
      },
      {
        q: "¿Cómo funciona la tarjeta cripto de Trust Wallet?",
        a: "La tarjeta está vinculada directamente a tu Trust Wallet. Al pagar, el importe se descuenta directamente del saldo de tu monedero y se liquida al instante, sin recargas ni cuentas separadas.",
      },
      {
        q: "¿Necesito Trust Wallet para la tarjeta cripto?",
        a: "Sí. La tarjeta se conecta a tu Trust Wallet, así que necesitas la app de Trust Wallet instalada y un monedero configurado antes de vincular y pedir tu tarjeta.",
      },
      {
        q: "¿Qué puedo hacer con la tarjeta cripto de Trust Wallet?",
        a: "Puedes pagar online y en tiendas donde se aceptan las principales tarjetas, gastar tu cripto al instante y gestionarlo todo directamente desde tu monedero, sin intermediarios.",
      },
      {
        q: "¿Cuáles son los requisitos para pedir la tarjeta?",
        a: "Necesitas la app de Trust Wallet con un monedero activo y un saldo compatible. Conecta tu monedero, confirma la conexión y tu tarjeta estará lista en unos 2 minutos.",
      },
    ],
  },
  joinCta: {
    eyebrow: "Empieza en 2 minutos",
    title: "Únete hoy",
    subtitle:
      "Tarjeta cripto de Trust Wallet. El pago sale directamente de tu Trust Wallet. Segura, rápida y cómoda.",
    getCard: "Obtener tu tarjeta",
    reassure: "Sin registro · Sin KYC · Tus fondos permanecen en tu monedero",
  },
  footer: {
    tagline:
      "Crea tu tarjeta cripto desde Trust Wallet. Pagos directamente desde tu monedero, sin registro ni KYC.",
    productTitle: "Producto",
    companyTitle: "Empresa",
    legalTitle: "Legal",
    product: ["Ventajas", "Cómo funciona", "FAQ", "Obtener tarjeta"],
    company: ["Nosotros", "Seguridad", "Reseñas", "Contacto"],
    legal: ["Privacidad", "Términos del servicio", "Política de cookies"],
    rights: "Todos los derechos reservados.",
    note: "No custodial · Auditada independientemente",
  },
  sticky: {
    title: "Obtén tu tarjeta cripto",
    sub: "Lista en 2 minutos · Sin KYC",
    button: "Obtener tarjeta",
  },
};

const pt: Dictionary = {
  nav: { main: "Início", advantages: "Vantagens", faq: "FAQ", signup: "Cadastrar" },
  header: { obtainCard: "Obter cartão" },
  hero: {
    badge: "2.347 cartões emitidos nas últimas 24 horas",
    titleLead: "Crie o seu ",
    titleAccent: "cartão de criptomoedas",
    titleTail: " a partir da Trust Wallet",
    subtitle:
      "As transações partem diretamente da sua Trust Wallet. Faça compras diretamente da sua carteira, sem recargas nem autenticação. Conecte a carteira e instale o aplicativo — o seu cartão fica pronto em apenas 2 minutos.",
    obtainCard: "Obter o seu cartão",
    discoverMore: "Saiba mais",
    reassure: "Sem cadastro · Seus fundos ficam na sua carteira · Cancele quando quiser",
    trustText: "{n} pessoas confiam na Trust Wallet",
    cardBalance: "Saldo",
    cardChip: "Trust Card",
    paymentApproved: "Pagamento aprovado",
  },
  stats: {
    trustedBy: "Confiado por",
    people: "pessoas",
    foundedIn: "Fundada em",
    independently: "Auditada de forma",
    audited: "Independente",
    iso: "ISO",
    certified: "Certificada",
    topReviews: "Melhores avaliações",
  },
  privileges: {
    eyebrow: "Vantagens",
    title: "Seus privilégios",
    subtitle: "Benefícios de usar o cartão cripto da Trust Wallet",
    items: [
      {
        title: "Início instantâneo, sem cadastro",
        text: "Não é preciso se cadastrar nem criar contas adicionais. Comece a usar o seu cartão imediatamente.",
      },
      {
        title: "Conexão direta com a Trust Wallet",
        text: "O cartão cripto está conectado diretamente à sua Trust Wallet. O pagamento sai diretamente da sua carteira.",
      },
      {
        title: "Pagamento direto da Trust Wallet",
        text: "O pagamento sai diretamente da sua Trust Wallet. Use seus fundos cripto na hora, sem intermediários.",
      },
      {
        title: "Cartão sem KYC — anonimato total",
        text: "Cartão cripto da Trust Wallet sem KYC, vinculado diretamente à sua carteira.",
      },
      {
        title: "Os fundos ficam na sua carteira",
        text: "O dinheiro permanece na sua Trust Wallet até ser gasto. Não pode ser bloqueado nem restringido.",
      },
      {
        title: "Estatísticas e métricas verificadas",
        text: "Número de usuários, volume total de transações, transações diárias.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Amado pelos usuários",
    title: "A confiança de milhões pelo mundo",
    subtitle: "Pessoas reais gastando cripto diretamente da carteira, todos os dias.",
    quotes: [
      "Configurei em menos de dois minutos e paguei o café direto da carteira. Sem recargas, sem contas — simplesmente funciona.",
      "Finalmente um cartão em que meus fundos ficam na minha própria carteira até eu gastar. O lado não-custodial me convenceu na hora.",
      "Sem KYC, sem espera, sem burocracia. Conectei a Trust Wallet e já estava comprando em minutos. Exatamente como pagamentos cripto deveriam ser.",
    ],
    badges: [
      "Auditado de forma independente",
      "Certificado ISO",
      "Não custodial",
      "Criptografia de 256 bits",
    ],
  },
  faq: {
    eyebrow: "Perguntas",
    title: "FAQ",
    subtitle: "Encontre respostas para as perguntas mais comuns",
    items: [
      {
        q: "O que é o cartão cripto da Trust Wallet?",
        a: "O cartão cripto da Trust Wallet é para usuários que querem usar criptomoedas no dia a dia. O pagamento sai diretamente da sua Trust Wallet. O cartão permite usar criptomoedas em milhões de lojas online e físicas pelo mundo.",
      },
      {
        q: "Como funciona o cartão cripto da Trust Wallet?",
        a: "O cartão é vinculado diretamente à sua Trust Wallet. Ao pagar, o valor é debitado diretamente do saldo da carteira e liquidado na hora — sem recargas nem contas separadas.",
      },
      {
        q: "Preciso da Trust Wallet para o cartão cripto?",
        a: "Sim. O cartão se conecta à sua Trust Wallet, então você precisa do aplicativo Trust Wallet instalado e de uma carteira configurada antes de vincular e pedir o cartão.",
      },
      {
        q: "O que posso fazer com o cartão cripto da Trust Wallet?",
        a: "Você pode pagar online e em lojas onde os principais cartões são aceitos, gastar sua cripto na hora e gerenciar tudo diretamente da carteira, sem intermediários.",
      },
      {
        q: "Quais os requisitos para pedir o cartão?",
        a: "Você precisa do aplicativo Trust Wallet com uma carteira ativa e saldo compatível. Conecte a carteira, confirme a conexão, e o cartão fica pronto em cerca de 2 minutos.",
      },
    ],
  },
  joinCta: {
    eyebrow: "Comece em 2 minutos",
    title: "Junte-se a nós hoje",
    subtitle:
      "Cartão cripto da Trust Wallet. O pagamento sai diretamente da sua Trust Wallet. Seguro, rápido e conveniente.",
    getCard: "Obter o seu cartão",
    reassure: "Sem cadastro · Sem KYC · Seus fundos ficam na sua carteira",
  },
  footer: {
    tagline:
      "Crie o seu cartão cripto a partir da Trust Wallet. Pagamentos direto da carteira — sem cadastro, sem KYC.",
    productTitle: "Produto",
    companyTitle: "Empresa",
    legalTitle: "Jurídico",
    product: ["Vantagens", "Como funciona", "FAQ", "Obter cartão"],
    company: ["Sobre", "Segurança", "Avaliações", "Contato"],
    legal: ["Privacidade", "Termos de serviço", "Política de cookies"],
    rights: "Todos os direitos reservados.",
    note: "Não custodial · Auditado de forma independente",
  },
  sticky: {
    title: "Obtenha seu cartão cripto",
    sub: "Pronto em 2 minutos · Sem KYC",
    button: "Obter cartão",
  },
};

const ru: Dictionary = {
  nav: { main: "Главная", advantages: "Преимущества", faq: "Вопросы", signup: "Регистрация" },
  header: { obtainCard: "Получить карту" },
  hero: {
    badge: "2347 карт выпущено за последние 24 часа",
    titleLead: "Создайте свою ",
    titleAccent: "криптокарту",
    titleTail: " от Trust Wallet",
    subtitle:
      "Транзакции проходят прямо из вашего Trust Wallet. Оплачивайте покупки напрямую из кошелька — без пополнений и подтверждений. Подключите кошелёк и установите приложение — карта будет готова всего за 2 минуты.",
    obtainCard: "Получить карту",
    discoverMore: "Узнать больше",
    reassure: "Без регистрации · Средства остаются в вашем кошельке · Отмена в любой момент",
    trustText: "{n} человек доверяют Trust Wallet",
    cardBalance: "Баланс",
    cardChip: "Trust Card",
    paymentApproved: "Платёж одобрен",
  },
  stats: {
    trustedBy: "Нам доверяют",
    people: "человек",
    foundedIn: "Основана в",
    independently: "Независимый",
    audited: "Аудит",
    iso: "ISO",
    certified: "Сертификат",
    topReviews: "Лучшие отзывы",
  },
  privileges: {
    eyebrow: "Преимущества",
    title: "Ваши привилегии",
    subtitle: "Преимущества криптокарты от Trust Wallet",
    items: [
      {
        title: "Мгновенный старт, без регистрации",
        text: "Не нужно регистрироваться или создавать дополнительные аккаунты. Начните пользоваться картой сразу.",
      },
      {
        title: "Прямое подключение к Trust Wallet",
        text: "Криптокарта напрямую связана с вашим Trust Wallet. Оплата идёт прямо из кошелька.",
      },
      {
        title: "Оплата напрямую из Trust Wallet",
        text: "Оплата идёт прямо из вашего Trust Wallet. Используйте криптосредства мгновенно, без посредников.",
      },
      {
        title: "Карта без KYC — полная анонимность",
        text: "Криптокарта от Trust Wallet без KYC, напрямую привязана к вашему кошельку.",
      },
      {
        title: "Средства остаются в кошельке",
        text: "Деньги остаются в вашем Trust Wallet до момента траты. Их нельзя заблокировать или ограничить.",
      },
      {
        title: "Проверенная статистика и метрики",
        text: "Количество пользователей, общий объём транзакций, число транзакций в день.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Любимы пользователями",
    title: "Нам доверяют миллионы по всему миру",
    subtitle: "Реальные люди каждый день тратят крипту прямо из своего кошелька.",
    quotes: [
      "Настроил меньше чем за две минуты и оплатил кофе прямо из кошелька. Без пополнений, без аккаунтов — просто работает.",
      "Наконец-то карта, где мои средства действительно остаются в моём кошельке до момента траты. Некастодиальность убедила меня сразу.",
      "Без KYC, без ожидания, без лишнего. Подключил Trust Wallet и уже через минуты совершал покупки. Именно так и должны работать криптоплатежи.",
    ],
    badges: [
      "Независимый аудит",
      "Сертификат ISO",
      "Некастодиальный",
      "256-битное шифрование",
    ],
  },
  faq: {
    eyebrow: "Вопросы",
    title: "Частые вопросы",
    subtitle: "Ответы на самые распространённые вопросы",
    items: [
      {
        q: "Что такое криптокарта от Trust Wallet?",
        a: "Криптокарта от Trust Wallet — это карта для тех, кто хочет использовать криптовалюты в повседневной жизни. Оплата идёт прямо из вашего Trust Wallet. Карта позволяет расплачиваться криптой в миллионах онлайн- и офлайн-магазинов по всему миру.",
      },
      {
        q: "Как работает криптокарта от Trust Wallet?",
        a: "Карта напрямую привязана к вашему Trust Wallet. При оплате сумма списывается прямо с баланса кошелька и проводится мгновенно — без пополнений и отдельных счетов.",
      },
      {
        q: "Нужен ли Trust Wallet для криптокарты?",
        a: "Да. Карта подключается к вашему Trust Wallet, поэтому перед привязкой и заказом карты нужно установить приложение Trust Wallet и создать кошелёк.",
      },
      {
        q: "Что можно делать с криптокартой Trust Wallet?",
        a: "Вы можете платить онлайн и в магазинах везде, где принимают основные карты, мгновенно тратить крипту и управлять всем прямо из кошелька, без посредников.",
      },
      {
        q: "Каковы требования для заказа карты?",
        a: "Нужны приложение Trust Wallet с активным кошельком и поддерживаемым балансом. Подключите кошелёк, подтвердите соединение — и карта будет готова примерно за 2 минуты.",
      },
    ],
  },
  joinCta: {
    eyebrow: "Начните за 2 минуты",
    title: "Присоединяйтесь сегодня",
    subtitle:
      "Криптокарта от Trust Wallet. Оплата идёт прямо из вашего Trust Wallet. Безопасно, быстро и удобно.",
    getCard: "Получить карту",
    reassure: "Без регистрации · Без KYC · Средства остаются в вашем кошельке",
  },
  footer: {
    tagline:
      "Создайте криптокарту от Trust Wallet. Платежи прямо из кошелька — без регистрации и KYC.",
    productTitle: "Продукт",
    companyTitle: "Компания",
    legalTitle: "Правовая информация",
    product: ["Преимущества", "Как это работает", "Вопросы", "Получить карту"],
    company: ["О нас", "Безопасность", "Отзывы", "Контакты"],
    legal: ["Политика конфиденциальности", "Условия использования", "Политика cookie"],
    rights: "Все права защищены.",
    note: "Некастодиальный · Независимый аудит",
  },
  sticky: {
    title: "Получите криптокарту",
    sub: "Готова за 2 минуты · Без KYC",
    button: "Получить карту",
  },
};

const ua: Dictionary = {
  nav: { main: "Головна", advantages: "Переваги", faq: "Питання", signup: "Реєстрація" },
  header: { obtainCard: "Отримати картку" },
  hero: {
    badge: "2347 карток випущено за останні 24 години",
    titleLead: "Створіть свою ",
    titleAccent: "криптокартку",
    titleTail: " від Trust Wallet",
    subtitle:
      "Транзакції проходять прямо з вашого Trust Wallet. Робіть покупки безпосередньо з гаманця — без поповнень і підтверджень. Підключіть гаманець і встановіть застосунок — картка буде готова всього за 2 хвилини.",
    obtainCard: "Отримати картку",
    discoverMore: "Дізнатися більше",
    reassure: "Без реєстрації · Кошти залишаються у вашому гаманці · Скасування будь-коли",
    trustText: "{n} людей довіряють Trust Wallet",
    cardBalance: "Баланс",
    cardChip: "Trust Card",
    paymentApproved: "Платіж схвалено",
  },
  stats: {
    trustedBy: "Нам довіряють",
    people: "людей",
    foundedIn: "Засновано в",
    independently: "Незалежний",
    audited: "Аудит",
    iso: "ISO",
    certified: "Сертифікат",
    topReviews: "Найкращі відгуки",
  },
  privileges: {
    eyebrow: "Переваги",
    title: "Ваші привілеї",
    subtitle: "Переваги криптокартки від Trust Wallet",
    items: [
      {
        title: "Миттєвий старт, без реєстрації",
        text: "Не потрібно реєструватися чи створювати додаткові акаунти. Почніть користуватися карткою одразу.",
      },
      {
        title: "Пряме підключення до Trust Wallet",
        text: "Криптокартка напряму пов'язана з вашим Trust Wallet. Оплата йде прямо з гаманця.",
      },
      {
        title: "Оплата напряму з Trust Wallet",
        text: "Оплата йде прямо з вашого Trust Wallet. Використовуйте криптокошти миттєво, без посередників.",
      },
      {
        title: "Картка без KYC — повна анонімність",
        text: "Криптокартка від Trust Wallet без KYC, напряму прив'язана до вашого гаманця.",
      },
      {
        title: "Кошти залишаються у гаманці",
        text: "Гроші залишаються у вашому Trust Wallet до моменту витрати. Їх не можна заблокувати чи обмежити.",
      },
      {
        title: "Перевірена статистика та метрики",
        text: "Кількість користувачів, загальний обсяг транзакцій, кількість транзакцій на день.",
      },
    ],
  },
  testimonials: {
    eyebrow: "Улюблена користувачами",
    title: "Нам довіряють мільйони у всьому світі",
    subtitle: "Реальні люди щодня витрачають крипту прямо зі свого гаманця.",
    quotes: [
      "Налаштував менш ніж за дві хвилини й оплатив каву прямо з гаманця. Без поповнень, без акаунтів — просто працює.",
      "Нарешті картка, де мої кошти справді залишаються у власному гаманці до моменту витрати. Некастодіальність переконала мене одразу.",
      "Без KYC, без очікування, без зайвого. Підключив Trust Wallet і вже за хвилини робив покупки. Саме так і мають працювати криптоплатежі.",
    ],
    badges: [
      "Незалежний аудит",
      "Сертифікат ISO",
      "Некастодіальний",
      "256-бітне шифрування",
    ],
  },
  faq: {
    eyebrow: "Питання",
    title: "Часті питання",
    subtitle: "Відповіді на найпоширеніші запитання",
    items: [
      {
        q: "Що таке криптокартка від Trust Wallet?",
        a: "Криптокартка від Trust Wallet — це картка для тих, хто хоче використовувати криптовалюти в повсякденному житті. Оплата йде прямо з вашого Trust Wallet. Картка дозволяє розраховуватися криптою в мільйонах онлайн- та офлайн-магазинів по всьому світу.",
      },
      {
        q: "Як працює криптокартка від Trust Wallet?",
        a: "Картка напряму прив'язана до вашого Trust Wallet. Під час оплати сума списується прямо з балансу гаманця і проводиться миттєво — без поповнень та окремих рахунків.",
      },
      {
        q: "Чи потрібен Trust Wallet для криптокартки?",
        a: "Так. Картка підключається до вашого Trust Wallet, тож перед прив'язкою та замовленням картки потрібно встановити застосунок Trust Wallet і створити гаманець.",
      },
      {
        q: "Що можна робити з криптокарткою Trust Wallet?",
        a: "Ви можете платити онлайн і в магазинах усюди, де приймають основні картки, миттєво витрачати крипту й керувати всім прямо з гаманця, без посередників.",
      },
      {
        q: "Які вимоги для замовлення картки?",
        a: "Потрібні застосунок Trust Wallet з активним гаманцем і підтримуваним балансом. Підключіть гаманець, підтвердіть з'єднання — і картка буде готова приблизно за 2 хвилини.",
      },
    ],
  },
  joinCta: {
    eyebrow: "Почніть за 2 хвилини",
    title: "Приєднуйтесь сьогодні",
    subtitle:
      "Криптокартка від Trust Wallet. Оплата йде прямо з вашого Trust Wallet. Безпечно, швидко та зручно.",
    getCard: "Отримати картку",
    reassure: "Без реєстрації · Без KYC · Кошти залишаються у вашому гаманці",
  },
  footer: {
    tagline:
      "Створіть криптокартку від Trust Wallet. Платежі прямо з гаманця — без реєстрації та KYC.",
    productTitle: "Продукт",
    companyTitle: "Компанія",
    legalTitle: "Правова інформація",
    product: ["Переваги", "Як це працює", "Питання", "Отримати картку"],
    company: ["Про нас", "Безпека", "Відгуки", "Контакти"],
    legal: ["Політика конфіденційності", "Умови використання", "Політика cookie"],
    rights: "Усі права захищено.",
    note: "Некастодіальний · Незалежний аудит",
  },
  sticky: {
    title: "Отримайте криптокартку",
    sub: "Готова за 2 хвилини · Без KYC",
    button: "Отримати картку",
  },
};

const cn: Dictionary = {
  nav: { main: "首页", advantages: "优势", faq: "常见问题", signup: "注册" },
  header: { obtainCard: "获取卡片" },
  hero: {
    badge: "过去 24 小时已发行 2,347 张卡片",
    titleLead: "从 Trust Wallet ",
    titleAccent: "创建您的加密货币卡",
    titleTail: "",
    subtitle:
      "交易直接从您的 Trust Wallet 进行。无需充值或额外验证，直接从钱包完成付款。连接钱包并安装应用——您的卡片仅需 2 分钟即可准备就绪。",
    obtainCard: "获取您的卡片",
    discoverMore: "了解更多",
    reassure: "无需注册 · 资金留在您的钱包中 · 随时可取消",
    trustText: "{n} 用户信赖 Trust Wallet",
    cardBalance: "余额",
    cardChip: "Trust 卡",
    paymentApproved: "付款已批准",
  },
  stats: {
    trustedBy: "信赖用户",
    people: "人",
    foundedIn: "成立于",
    independently: "独立",
    audited: "审计",
    iso: "ISO",
    certified: "认证",
    topReviews: "顶级评价",
  },
  privileges: {
    eyebrow: "优势",
    title: "您享有的特权",
    subtitle: "使用 Trust Wallet 加密卡的好处",
    items: [
      {
        title: "即时开始，无需注册",
        text: "无需注册或创建额外账户。立即开始使用您的卡片。",
      },
      {
        title: "直接连接 Trust Wallet",
        text: "加密卡直接连接到您的 Trust Wallet。付款直接从您的钱包扣除。",
      },
      {
        title: "直接从 Trust Wallet 付款",
        text: "付款直接从您的 Trust Wallet 进行。即时使用您的加密资金，无需中介。",
      },
      {
        title: "无 KYC 卡片——完全匿名",
        text: "来自 Trust Wallet 的无 KYC 加密卡，直接与您的钱包关联。",
      },
      {
        title: "资金留在您的钱包中",
        text: "在花费之前，资金一直留在您的 Trust Wallet 中，无法被冻结或限制。",
      },
      {
        title: "经过验证的统计与指标",
        text: "用户数量、总交易量、每日交易笔数。",
      },
    ],
  },
  testimonials: {
    eyebrow: "深受用户喜爱",
    title: "全球数百万用户的信赖之选",
    subtitle: "真实用户每天直接从钱包花费加密货币。",
    quotes: [
      "不到两分钟就设置好了，直接用钱包付了咖啡钱。无需充值，无需账户——用起来就是这么简单。",
      "终于有一张卡，在我花费之前资金真正留在自己的钱包里。非托管这一点立刻打动了我。",
      "无 KYC、无等待、无繁琐。连接 Trust Wallet 后几分钟内就开始消费。加密支付本该如此。",
    ],
    badges: ["独立审计", "ISO 认证", "非托管", "256 位加密"],
  },
  faq: {
    eyebrow: "问题",
    title: "常见问题",
    subtitle: "查找最常见问题的答案",
    items: [
      {
        q: "什么是 Trust Wallet 加密卡？",
        a: "Trust Wallet 加密卡适用于希望在日常生活中使用加密货币的用户。付款直接从您的 Trust Wallet 进行。该卡可让您在全球数百万家线上和线下商店使用加密货币。",
      },
      {
        q: "Trust Wallet 加密卡如何运作？",
        a: "该卡直接与您的 Trust Wallet 关联。付款时，金额直接从您的钱包余额中扣除并即时结算——无需充值或单独账户。",
      },
      {
        q: "使用加密卡需要 Trust Wallet 吗？",
        a: "是的。该卡连接到您的 Trust Wallet，因此在关联和订购卡片之前，您需要安装 Trust Wallet 应用并创建钱包。",
      },
      {
        q: "使用 Trust Wallet 加密卡可以做什么？",
        a: "您可以在接受主流卡片的任何线上和线下商店付款，即时花费加密货币，并直接从钱包管理一切，无需中介。",
      },
      {
        q: "订购加密卡有哪些前提条件？",
        a: "您需要安装 Trust Wallet 应用，拥有活跃的钱包和受支持的余额。连接钱包，确认连接，您的卡片将在约 2 分钟内准备就绪。",
      },
    ],
  },
  joinCta: {
    eyebrow: "2 分钟即可开始",
    title: "立即加入我们",
    subtitle: "Trust Wallet 加密卡。付款直接从您的 Trust Wallet 进行。安全、快速、便捷。",
    getCard: "获取您的卡片",
    reassure: "无需注册 · 无需 KYC · 资金留在您的钱包中",
  },
  footer: {
    tagline: "从 Trust Wallet 创建您的加密卡。直接从钱包付款——无需注册，无需 KYC。",
    productTitle: "产品",
    companyTitle: "公司",
    legalTitle: "法律",
    product: ["优势", "运作方式", "常见问题", "获取卡片"],
    company: ["关于我们", "安全", "评价", "联系我们"],
    legal: ["隐私政策", "服务条款", "Cookie 政策"],
    rights: "版权所有。",
    note: "非托管 · 独立审计",
  },
  sticky: {
    title: "获取您的加密卡",
    sub: "2 分钟准备就绪 · 无需 KYC",
    button: "获取卡片",
  },
};

export const DICTIONARIES: Record<LocaleCode, Dictionary> = {
  en,
  de,
  fr,
  es,
  pt,
  ru,
  ua,
  cn,
};
