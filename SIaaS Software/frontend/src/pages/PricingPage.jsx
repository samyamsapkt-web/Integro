import { useState } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "../components/SectionHeading";
import { pricingPlans } from "../data/siteContent";

function PricingPage() {
  const [billingMode, setBillingMode] = useState("monthly");

  return (
    <div className="page marketing-page">
      <section className="content-section">
        <SectionHeading
          eyebrow="Pricing"
          title="Start with a generous free tier, then upgrade when the workflows are proving value."
          description="The pricing is built to feel accessible early while still giving you a real path to revenue."
          align="center"
        />

        <div className="billing-toggle">
          <button
            className={billingMode === "monthly" ? "toggle-active" : ""}
            onClick={() => setBillingMode("monthly")}
          >
            Monthly
          </button>
          <button
            className={billingMode === "yearly" ? "toggle-active" : ""}
            onClick={() => setBillingMode("yearly")}
          >
            Yearly
          </button>
          <span>Save 20% on annual billing</span>
        </div>

        <div className="pricing-grid">
          {pricingPlans.map((plan) => {
            const amount = billingMode === "monthly" ? plan.priceMonthly : plan.priceYearly;

            return (
              <article
                key={plan.name}
                className={`pricing-card ${plan.highlight ? "pricing-highlight" : ""}`}
              >
                {plan.highlight ? <span className="badge">Most popular</span> : null}
                <h3>{plan.name}</h3>
                <p>{plan.description}</p>
                <div className="price-line">
                  <strong>{amount === 0 ? "Free" : `$${amount}`}</strong>
                  <span>{amount === 0 ? "forever" : "/month"}</span>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link to="/auth?mode=signup" className={plan.highlight ? "primary-button" : "ghost-button"}>
                  {plan.cta}
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section faq-grid">
        <div className="faq-card">
          <h3>Will bring-your-own-key scare people away?</h3>
          <p>
            It can, which is why this starter product is built so you can begin with demo routing or
            limited hosted credits later. You do not have to force it on day one.
          </p>
        </div>
        <div className="faq-card">
          <h3>Can I change pricing later?</h3>
          <p>
            Yes. The UI is already separated from billing logic, so you can tweak tiers before
            connecting a checkout provider.
          </p>
        </div>
        <div className="faq-card">
          <h3>Does the free tier feel real enough?</h3>
          <p>
            Yes. It gives enough usage to test the product while still leaving a natural upgrade
            point when workflows become business-critical.
          </p>
        </div>
      </section>
    </div>
  );
}

export default PricingPage;
