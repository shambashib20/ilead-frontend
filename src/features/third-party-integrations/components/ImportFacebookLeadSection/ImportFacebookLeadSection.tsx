"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useFetchFacebookLeads } from "../../hooks/useFacebookFetchLeads";

export default function ImportFacebookLeadsSection() {
  const [formId, setFormId] = useState("");
  const [labelTitle, setLabelTitle] = useState("");

  const { mutate: fetchLeads, isPending } = useFetchFacebookLeads();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    fetchLeads({ formId, labelTitle });
  }

  return (
    <Card className=" mt-10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Import Facebook Leads
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="formId">Facebook Form ID</Label>
            <Input
              id="formId"
              placeholder="Enter Form ID"
              value={formId}
              onChange={(e) => setFormId(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="labelTitle">Label Title</Label>
            <Input
              id="labelTitle"
              placeholder="Enter Label Title"
              value={labelTitle}
              onChange={(e) => setLabelTitle(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? "Fetching..." : "Fetch Leads"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
