import React from "react";
import { usePackages } from "../hooks/usePackages";
import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import PackageForm from "./PackageForm";

function Packages() {
  const { packages, isLoading, isError, error } = usePackages();
  const openModal = useModalStore((state) => state.openModal);
  const setModalTitle = useModalStore((state) => state.setModalTitle);

  function handleAddPackage() {
    setModalTitle("Add Package");
    openModal({
      type: "form",
      content: <PackageForm />,
    });
  }
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading packages...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-600">Error: {error?.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="py-4 px-3 shadow-lead bg-primary rounded-md mb-4 flex items-center justify-between ">
        <h3 className="text-foreground text-2xl font-semibold"> Packages</h3>
        <Button onClick={handleAddPackage}>Add Package</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {packages?.map((item) => (
          <div
            key={item._id}
            className="bg-primary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {item.title}
            </h2>

            <p className="text-foreground text-sm mb-4">{item.description}</p>

            <div className="mb-4">
              <span className="text-3xl font-bold text-blue-600">
                ₹{item.price}
              </span>
              <span className="text-gray-500 text-sm ml-1">
                / {item.validity_in_days} days
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Features:
              </h3>
              <ul className="space-y-1">
                {item.features?.map((feature) => (
                  <li key={feature._id} className="text-sm text-foreground">
                    <span className="font-medium">{feature.title}:</span>{" "}
                    {feature.meta?.limit || "N/A"}
                  </li>
                ))}
              </ul>
            </div>

            {item.price > 0 && (
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                Select Plan
              </button>
            )}

            {item.price === 0 && (
              <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200">
                Get Started Free
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;
