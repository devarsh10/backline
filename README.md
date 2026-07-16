# Backline India

Backline rental site for events, concerts, and studios across Gujarat — browse equipment, add to cart, and checkout with no account needed. Built with [Astro](https://astro.build) + Tailwind CSS.

![Home page](docs/screenshots/home.png)

<p float="left">
  <img src="docs/screenshots/equipment.png" width="49%" alt="Equipment listing" />
  <img src="docs/screenshots/cart.png" width="49%" alt="Cart" />
</p>

## Features

- Equipment catalog with search, filtering, and related-accessory recommendations
- Cart + checkout flow (order details submitted via Netlify Forms, no payment gateway — payment is UPI/bank transfer post-confirmation)
- Fully static, no backend or database

## Commands

| Command         | Action                          |
| :--------------- | :------------------------------ |
| `npm install`     | Install dependencies            |
| `npm run dev`     | Start dev server (`localhost:4321`) |
| `npm run build`   | Build to `./dist/`              |
| `npm run preview` | Preview the production build    |
