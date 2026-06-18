const features = ["Prompt-driven edits", "Live React preview", "File tools"];

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "All basic features for individuals",
    features: ["Prompt-driven edits", "Community support"]
  },
  {
    name: "Pro",
    price: "$12/mo",
    desc: "Advanced tools for professionals",
    features: ["Everything in Starter", "Live React preview", "Priority support"]
  },
  {
    name: "Team",
    price: "$32/mo",
    desc: "Collaboration features for teams",
    features: ["Everything in Pro", "Multi-user support", "Team analytics"]
  }
];

export function App() {
  return (
    <main className="project-page">
      <section className="hero">
        <p className="kicker">Editable project folder</p>
        <h1>Students update this app with Gemini tool calls.</h1>
        <p className="lede">
          This is the target React project. The main assignment app should inspect these files,
          ask Gemini what to change, write updates here, and show the running preview.
        </p>
        <div className="feature-row">
          {features.map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
      </section>
      <section className="pricing-section">
        <h2 className="pricing-title">Pricing Plans</h2>
        <div className="pricing-row">
          {plans.map((plan) => (
            <div className="pricing-card" key={plan.name}>
              <div className="plan-name">{plan.name}</div>
              <div className="plan-price">{plan.price}</div>
              <div className="plan-desc">{plan.desc}</div>
              <ul className="plan-features">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <button className="plan-cta">Choose {plan.name}</button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
