import { usePricingPlans } from "@/features/payment/hooks/usePricingPlans";
import React from "react";

function Pricing() {
  const { pricingPlans } = usePricingPlans();

  // Get only the first 3 plans
  const firstThreePlans = pricingPlans.slice(0, 3);

  return (
    <section className="pricing">
      <div className="content">
        <h6 className="badge">Pricing</h6>
        <h3>Professional headshots for 8× less than a physical photo shoot</h3>
        <p data-animate="fade-up">
          The average cost of professional headshots in the United States is
          $232.50*. Our packages start from just $29.
        </p>
      </div>

      <div className="pricing-grid">
        {firstThreePlans.map((plan, index) => (
          <div
            key={plan._id}
            className={`plan ${index === 1 ? "featured" : ""}`}
          >
            <h4>{plan.title}</h4>
            <div className="price">${plan.price}</div>
            <h5>Per {plan.validity_in_days} Days</h5>
            <p>{plan.description}</p>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature._id}>
                  ✔ {feature.title} (Limit: {feature.meta.limit})
                </li>
              ))}
            </ul>
            <button className={`btn ${index === 1 ? "btn-primary" : ""}`}>
              {index === 0
                ? "Start Free Trial"
                : index === 1
                  ? "Get Started"
                  : "Book a Demo"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
