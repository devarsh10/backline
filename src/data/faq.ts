export interface FaqItem {
  question: string;
  answer: string;
}

export const generalFaq: FaqItem[] = [
  {
    question: 'What is backline rental?',
    answer: 'Backline rental refers to renting music equipment — drums, amplifiers, guitars, keyboards, and percussion — for concerts, gigs, and studio sessions instead of buying it outright.',
  },
  {
    question: 'How much does musical instrument rental cost in Gujarat?',
    answer: 'Pricing depends on the equipment type and rental duration. Backline India offers transparent per-day pricing — browse our <a href="/#categories">equipment catalog</a> for exact rates on drums, amplifiers, keyboards, and more.',
  },
  {
    question: 'Is there a musical instrument rental service near me in Surat or Vadodara?',
    answer: 'Yes, Backline India serves musicians across Gujarat — including Surat and Vadodara — with delivery, setup, and pickup handled by our crew.',
  },
  {
    question: 'How do I hire musical instruments from Backline India?',
    answer: 'Browse our catalog and add the items you need to your cart — no account required for that. When you\'re ready to check out, create a free account (or log in) and pay securely online through Razorpay.',
  },
  {
    question: 'Do I need to create an account to rent equipment?',
    answer: 'You can browse and build your cart without one, but an account is required at checkout — it lets you track your order and see your full rental history anytime.',
  },
];

export const paymentFaq: FaqItem[] = [
  {
    question: 'How do I pay for equipment rental on Backline India?',
    answer: 'Pay securely online via card, UPI, or netbanking through Razorpay at checkout — your booking is confirmed as soon as payment succeeds.',
  },
  {
    question: 'Do you deliver and set up the equipment?',
    answer: 'Yes — delivery, setup, and pickup are all handled by the Backline India crew.',
  },
  {
    question: 'Do I need an account to book equipment?',
    answer: 'Yes, an account (email and password, with a quick email verification) is required to check out — this lets you see your full order history and delivery status anytime from "My Account". Browsing and building your cart doesn\'t require an account.',
  },
];

export const categoryFaq: Record<string, FaqItem[]> = {
  drums: [
    {
      question: 'How much does a drum kit on rent cost in Gujarat?',
      answer: 'Drum kit rental pricing varies by kit type — check our Drums &amp; Cymbals page for current per-day rates.',
    },
    {
      question: 'Can I rent a drum kit near me in Gujarat?',
      answer: 'Yes, Backline India delivers, sets up, and picks up drum kits anywhere in Gujarat — Ahmedabad, Surat, Vadodara, Rajkot, and beyond.',
    },
  ],
  'drum-accessories': [
    {
      question: 'Can I rent drum hardware separately from a kit?',
      answer: 'Yes — hi-hat stands, snare stands, bass pedals, boom cymbal stands, and drum shields are all available as standalone rentals across Gujarat.',
    },
  ],
  amplifiers: [
    {
      question: 'Which is the best amplifier on rent in Vadodara or Rajkot?',
      answer: 'Backline India stocks guitar, bass, and keyboard amplifiers with matching cabinets suited for gigs, studio sessions, and events — browse our Amplifiers &amp; Cabinets page to compare options and pricing.',
    },
    {
      question: 'Can I rent just an amp head without other equipment?',
      answer: 'Yes, all our equipment — including amplifiers — can be rented individually or as part of a full backline setup.',
    },
  ],
  keyboards: [
    {
      question: 'Can I rent a digital piano or stage keyboard in Gujarat?',
      answer: 'Yes, Backline India offers digital grand pianos, stage pianos, and synthesizers for rent with daily pricing and delivery included across Gujarat.',
    },
  ],
  percussion: [
    {
      question: 'What percussion instruments are available on rent?',
      answer: 'Backline India offers congas, bongos, timbales, cajons, and djembes for events and studio sessions — check our Percussion page for current stock and pricing.',
    },
  ],
};
