import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ExternalWebsiteIntegration() {
  return (
    <Card className="mt-10">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          External Website Integration
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Use this API to push leads from your external website or application
          directly into the CRM.
        </p>
      </CardHeader>

      <CardContent className="space-y-8 text-sm">
        {/* Endpoint */}
        <section>
          <h3 className="font-semibold text-base mb-2">API Endpoint</h3>
          <div className="bg-primary text-green-400 rounded-md px-4 py-3 font-mono">
            POST {`{{BASE_URL}}/lead/create/external`}
          </div>
        </section>

        {/* Headers */}
        <section>
          <h3 className="font-semibold text-base mb-2">Headers</h3>
          <pre className="bg-primary rounded-md p-4 overflow-x-auto">
            {`Content-Type: application/json`}
          </pre>
        </section>

        {/* Request Body */}
        <section>
          <h3 className="font-semibold text-base mb-2">Request Body</h3>
          <pre className="bg-primary rounded-md p-4 overflow-x-auto">
            {`{
  "customer_name": "Test korchi",
  "company_name": "ABC Corp",
  "phone_number": "919876543210",
  "email": "john@abc.com",
  "address": "123 Main Street",
  "reference": "Website",
  "comment": "Interested in services",
  "property_id": "68c510b3bf73db6c47d30b30"
}`}
          </pre>
        </section>

        {/* Response */}
        {/* <section>
          <h3 className="font-semibold text-base mb-2">Success Response</h3>
          <pre className="bg-primary rounded-md p-4 overflow-x-auto">
            {`{
  "status": "CREATED",
  "message": "Lead created successfully via API",
  "data": {
    "_id": "693fb14951745eb0ce59660c",
    "name": "Test korchi",
    "phone_number": "919876543210",
    "status": "ACTIVE",
    "meta": {
      "source": "API",
      "ray_id": "ray-id-xxxx"
    }
  }
}`}
          </pre>
        </section> */}

        {/* Curl */}
        <section>
          <h3 className="font-semibold text-base mb-2">cURL Example</h3>
          <pre className="bg-primary text-green-400 rounded-md p-4 overflow-x-auto font-mono">
            {`curl -X POST "{{BASE_URL}}/lead/create/external" \\
-H "Content-Type: application/json" \\

-d '{
  "customer_name": "Test korchi",
  "company_name": "ABC Corp",
  "phone_number": "919876543210",
  "email": "john@abc.com",
  "address": "123 Main Street",
  "reference": "Website",
  "comment": "Interested in services",
  "property_id": "68c510b3bf73db6c47d30b30"
}'`}
          </pre>
        </section>

        {/* Tips */}
        <section>
          <h3 className="font-semibold text-base mb-2">
            Integration Tips & Best Practices
          </h3>
          <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
            <li>
              Always validate phone numbers in E.164 format (e.g. 91XXXXXXXXXX).
            </li>
            <li>
              Use the workspace id (<code>property_id</code>) from the modal for
              creating employees.
            </li>
            <li>
              Store the returned <code>_id</code> for future follow-ups.
            </li>
            <li>Send leads server-to-server to avoid exposing API keys.</li>
            <li>Retry requests only on network or 5xx errors.</li>
          </ul>
        </section>

        {/* Status Codes */}
        <section>
          <h3 className="font-semibold text-base mb-2">Status Codes</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>
              <b>201</b> – Lead created successfully
            </li>
            <li>
              <b>400</b> – Validation error
            </li>
            <li>
              <b>401</b> – Invalid or missing API key
            </li>
            <li>
              <b>500</b> – Internal server error
            </li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
