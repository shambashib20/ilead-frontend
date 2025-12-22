import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";
import { useFeatures } from "../hooks/useFeature";
import FeatureForm from "./FeatureForm";

function Features() {
  const { features } = useFeatures({
    is_table_view: false,
    page: 1,
    limit: 10,
  });
  const openModal = useModalStore((state) => state.openModal);
  const setModalTitle = useModalStore((state) => state.setModalTitle);

  function handleAddFeature() {
    setModalTitle("Add Feature");
    openModal({
      type: "form",
      content: <FeatureForm />,
    });
  }

  console.log(features);

  return (
    <div className="container mx-auto p-6">
      <div className="py-4 px-3 shadow-lead bg-primary rounded-md mb-4 flex items-center justify-between ">
        <h3 className="text-foreground text-2xl font-semibold"> Features</h3>
        <Button onClick={handleAddFeature}>Add Features</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {features?.map((item) => (
          <div
            key={item._id}
            className="bg-primary rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-700"
          >
            <h2 className="text-xl font-semibold mb-2 text-foreground">
              {item.title}
            </h2>

            <p className="text-foreground text-sm mb-4">{item.description}</p>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Limit: {item.meta?.limit}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
