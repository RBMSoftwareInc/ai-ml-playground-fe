# 🚀 RBM AI Playground Frontend

An interactive **AI/ML Playground** for e-commerce intelligence — explore real-time AI-powered tools for product discovery, logistics, personalization, pricing optimization, and more.

Built with **Next.js 14**, **React 18**, and **Material-UI**.

---

## ✨ Features

### 🔍 Product Discovery
| Feature | Description |
|---------|-------------|
| **Smart Search (NLP)** | Natural language product search with semantic understanding |
| **Visual Similarity Search** | Upload inspiration images to find visually similar products |
| **Bundle & Outfit Suggestions** | AI-driven product bundling and outfit recommendations |

### 📦 Logistics & Operations
| Feature | Description |
|---------|-------------|
| **ETA Prediction** | Forecast last-mile delivery windows using distance, carrier data, and weather |
| **Order Delay Forecast** | Predict potential delivery delays before they happen |
| **Inventory Reordering** | Smart inventory replenishment recommendations |

### 🎯 Personalization
| Feature | Description |
|---------|-------------|
| **Real-Time Personalization** | Dynamic content decisions per shopper, channel, and KPI |
| **AI Chat Assistant** | Conversational AI for customer support |
| **Voice Search** | Voice-enabled product search capabilities |

### 💰 Pricing & Fraud
| Feature | Description |
|---------|-------------|
| **Dynamic Pricing** | Balance margin, velocity, and competitor pricing with AI guardrails |
| **Fraud Detection** | Score risky transactions using velocity, biometrics, and payment patterns |
| **Coupon Abuse Detection** | Identify and prevent promotional code misuse |

### 📈 Marketing Intelligence
| Feature | Description |
|---------|-------------|
| **Churn Prediction** | Identify at-risk customers and trigger retention playbooks |
| **Customer Segmentation** | AI-powered audience clustering and analysis |
| **Email Subject Line Generator** | Generate high-converting email subject lines |
| **Lead Gen Blueprint** | Lead generation strategy recommendations |

### 🏷️ Product Intelligence
| Feature | Description |
|---------|-------------|
| **Variant Assignment** | Automatic product variant detection and assignment |
| **Auto Categorization** | ML-powered product taxonomy classification |
| **Review Sentiment Analysis** | Extract insights from customer reviews |
| **Title & Description Generator** | AI-generated product copy |

### 🎨 Creative & AR Tools
| Feature | Description |
|---------|-------------|
| **AI Background Remover** | Remove backgrounds from product images |
| **Image Enhancer/Upscaler** | Improve image quality and resolution |
| **AI Try-On (AR)** | Virtual try-on experiences for apparel |

### 🎮 Gamification
| Feature | Description |
|---------|-------------|
| **Product Match Quiz** | Interactive quiz for product recommendations |
| **Spin-to-Win** | Gamified promotional experiences |
| **IQ Game Suite** | Engagement-driving mini-games |

### 📊 Analytics & Insights
| Feature | Description |
|---------|-------------|
| **Sales Forecasting** | Predict future sales trends |
| **Best Launch Timing** | Optimize product launch schedules |
| **A/B Test Analyzer** | Statistical analysis for experiments |

---

## 🏗️ CMS & StorefrontIQ

A comprehensive content management system for building e-commerce storefronts:

- **Layout Studio** — Visual page layout designer with drag-and-drop capabilities
- **Blueprint Studio** — Pre-built templates and design systems
- **ComposerIQ** — Content composition workflow
- **Fragment Designer** — Reusable UI component builder
- **Page Editor** — WYSIWYG page editing
- **Asset Browser** — Digital asset management

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **UI Library** | React 18 |
| **Component Library** | Material-UI (MUI) v7 |
| **Animations** | Framer Motion |
| **Drag & Drop** | @dnd-kit |
| **Code Editor** | Monaco Editor |
| **HTTP Client** | Axios |
| **Validation** | Zod |
| **Styling** | Tailwind CSS, Emotion |
| **Language** | TypeScript |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-ml-playground-fe

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_ASSET_BASE_URL=http://localhost:5000
```

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run analyze` | Analyze bundle size |

---

## 📁 Project Structure

```
ai-ml-playground-fe/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Main dashboard with AI features
│   │   ├── cms/            # CMS & StorefrontIQ modules
│   │   │   └── store-frontiq/
│   │   │       ├── blueprint-studio/
│   │   │       ├── layout-studio/
│   │   │       └── composeriq/
│   │   └── ...             # AI feature pages
│   ├── eta/                # ETA Prediction
│   ├── vss/                # Visual Similarity Search
│   ├── personalization/    # Real-Time Personalization
│   ├── pricing/            # Dynamic Pricing
│   ├── churn/              # Churn Prediction
│   └── ...                 # Other AI modules
├── components/             # Reusable React components
│   ├── cms/                # CMS-specific components
│   ├── forms/              # Form components (GenericForm, DatasetViewer, etc.)
│   ├── layout/             # Layout components
│   └── navigation/         # Navigation components
├── lib/                    # Utilities and API helpers
├── public/                 # Static assets
└── styles/                 # Global styles and themes
```

---

## 🔗 API Integration

The frontend connects to a backend API (default: `http://localhost:5000`) for:

- AI/ML model predictions
- CMS content management
- Asset storage and retrieval
- Layout and fragment persistence

---

## 🎨 Design Philosophy

Each AI demo module follows a consistent pattern with:

- **Form Panel** — Input parameters for the AI model
- **Result Panel** — Visualized prediction output
- **Theory Panel** — Educational content about the ML approach
- **Dataset Viewer** — Sample training data exploration
- **Insights Panel** — Business impact and recommendations
- **Ask Gene (Copilot)** — Contextual AI assistant
- **Demo Player** — Interactive walkthrough

---

## 📄 License

© 2025 RBM Playground • All Rights Reserved

---

## 🤝 Contributing

Contributions are welcome! Please follow the existing code patterns and ensure all TypeScript types are properly defined.
