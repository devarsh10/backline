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
    question: 'How much does musical instrument rental cost in Ahmedabad?',
    answer: 'Pricing depends on the equipment type and rental duration. Amply offers transparent per-day pricing — browse our <a href="/equipment">equipment catalog</a> for exact rates on drums, guitars, amplifiers, keyboards, and more.',
  },
  {
    question: 'Is there a musical instrument rental service near me in Ahmedabad?',
    answer: 'Yes, Amply provides musical instrument rental across Ahmedabad with delivery, setup, and pickup handled by our crew.',
  },
  {
    question: 'How do I hire musical instruments from Amply?',
    answer: 'Simply browse our catalog, add the items you need to your cart, and check out — no account or login required. Orders are confirmed manually, and you can pay via UPI or bank transfer.',
  },
  {
    question: 'Do I need to create an account to rent equipment?',
    answer: 'No. Amply lets you browse, add to cart, and checkout without signing up.',
  },
];

export const paymentFaq: FaqItem[] = [
  {
    question: 'How do I pay for equipment rental on Amply?',
    answer: 'Payments are made via UPI or bank transfer after your order is manually confirmed by our team.',
  },
  {
    question: 'Do you deliver and set up the equipment?',
    answer: 'Yes — delivery, setup, and pickup are all handled by the Amply crew.',
  },
  {
    question: 'How is my order confirmed?',
    answer: "Since we don't use an automated payment gateway, our team manually reviews and confirms every order to ensure equipment availability.",
  },
];

export const categoryFaq: Record<string, FaqItem[]> = {
  drums: [
    {
      question: 'How much does a drum kit on rent cost in Ahmedabad?',
      answer: 'Drum kit rental pricing varies by kit type — check our Drums &amp; Cymbals page for current per-day rates.',
    },
    {
      question: 'Can I rent a drum kit near me in Ahmedabad?',
      answer: 'Yes, Amply delivers, sets up, and picks up drum kits anywhere in Ahmedabad.',
    },
  ],
  guitars: [
    {
      question: 'Can I rent an electric guitar in Ahmedabad?',
      answer: 'Yes, Amply offers electric guitars, acoustic guitars, and bass guitars for rent with daily pricing.',
    },
    {
      question: 'Can I rent a guitar online without visiting a store?',
      answer: 'Yes — our full catalog, cart, and checkout process is online. No store visit needed.',
    },
  ],
  amplifiers: [
    {
      question: 'Which is the best amplifier on rent in Ahmedabad?',
      answer: 'Amply stocks a range of guitar amplifiers and cabinets suited for gigs, studio sessions, and events — browse our Amplifiers page to compare options and pricing.',
    },
    {
      question: 'Can I rent just a guitar amp without other equipment?',
      answer: 'Yes, all our equipment — including amplifiers — can be rented individually or as part of a full backline setup.',
    },
  ],
  keyboards: [
    {
      question: 'Can I rent a keyboard or synthesizer in Ahmedabad?',
      answer: 'Yes, Amply offers keyboards, synths, and accessories on rent with daily pricing and delivery included.',
    },
  ],
  percussion: [
    {
      question: 'What percussion instruments are available on rent?',
      answer: 'Amply offers a range of percussion instruments for events and studio sessions — check our Percussion page for current stock and pricing.',
    },
  ],
};
