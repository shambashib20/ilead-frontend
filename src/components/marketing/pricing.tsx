import { usePricingPlans } from "@/features/payment/hooks/usePricingPlans";


function Pricing() {
  const { pricingPlans } = usePricingPlans();

  const firstThreePlans = pricingPlans.slice(0, 3);

  const handlePlanClick = (plan: any) => {
    if (plan.price === 0) {
      window.location.href = "/register?plan=free";
    } else {
      window.location.href = `/register?plan=${plan._id}`;
    }
  };

  const getCtaLabel = (plan: any) => {
    if (plan.price === 0) return "Start Free";
    return "Buy Now";
  };

  return (
    <section className="pricing">
      <div className="content">
        <h6 className="badge">Pricing</h6>
        <h3>Professional headshots for 8× less than a physical photo shoot</h3>
        <p>
          The average cost of professional headshots in the United States is
          $232.50*. Our packages start from just $29.
        </p>
      </div>

      <div className="pricing-grid">
        {firstThreePlans.map((plan) => (
          <div
            key={plan._id}
            className={`plan ${plan.price >= 0 || plan.price <= 500 ? "" : "featured"}`}
          >
            <h4>{plan.title}</h4>

            <div className="price">
              {plan.price === 0 ? "Free" : `$${plan.price}`}
            </div>

            <h5>Per {plan.validity_in_days} Days</h5>
            <p>{plan.description}</p>

            <ul>
              {plan.features.map((feature) => (
                <li key={feature._id}>
                  ✔ {feature.title} (Limit: {feature.meta.limit})
                </li>
              ))}
            </ul>

            <button
              className={`btn ${plan.price > 0 ? "btn-primary" : ""}`}
              onClick={() => handlePlanClick(plan)}
            >
              {getCtaLabel(plan)}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;
