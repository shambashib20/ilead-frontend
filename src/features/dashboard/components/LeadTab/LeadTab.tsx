import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";

export type LeadTabType = {
  content: {
    label: string;
    description: string;
  }[];
};
function LeadTab({ data }: { data: LeadTabType }) {
  const firstValue = data.content[0]?.label || "tab0";

  return (
    <Tabs defaultValue={firstValue} className="">
      <TabsList>
        {data.content.map((item, index) => (
          <TabsTrigger key={index} value={item.label}>
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {data.content.map((item, index) => (
        <TabsContent key={index} value={item.label} className="px-4">
          <p>{item.description}</p>
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default LeadTab;
