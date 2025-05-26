import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// Sample agent data
const sampleAgents = [
  {
    id: "1",
    name: "John Smith",
    company: "Smith Roofing",
    email: "john@smithroofing.com",
    phone: "(555) 123-4567",
    status: "active",
    leads: 24,
    coverage: ["75001", "75002", "75003"],
    lastActive: "2024-03-20T15:30:00Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    company: "Johnson & Sons Roofing",
    email: "sarah@johnsonroofing.com",
    phone: "(555) 987-6543",
    status: "inactive",
    leads: 0,
    coverage: ["75004", "75005"],
    lastActive: "2024-02-15T10:20:00Z",
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    company: "Rodriguez Roofing Solutions",
    email: "mike@rodriguezroofing.com",
    phone: "(555) 456-7890",
    status: "active",
    leads: 42,
    coverage: ["75006", "75007", "75008", "75009"],
    lastActive: "2024-03-21T09:15:00Z",
  },
  {
    id: "4",
    name: "Lisa Chen",
    company: "Chen Roofing & Construction",
    email: "lisa@chenroofing.com",
    phone: "(555) 234-5678",
    status: "pending",
    leads: 0,
    coverage: ["75010"],
    lastActive: "2024-03-19T14:45:00Z",
  },
  {
    id: "5",
    name: "David Wilson",
    company: "Wilson Roofing Services",
    email: "david@wilsonroofing.com",
    phone: "(555) 876-5432",
    status: "active",
    leads: 18,
    coverage: ["75011", "75012", "75013"],
    lastActive: "2024-03-21T11:30:00Z",
  }
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Agents</h1>
        <p className="text-muted-foreground">
          Manage and monitor your roofing agents
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleAgents.map((agent) => (
          <Link key={agent.id} href={`/admin/agents/${agent.id}`}>
            <Card className="transition-colors hover:bg-accent/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{agent.name}</CardTitle>
                <Badge 
                  variant={
                    agent.status === "active" 
                      ? "default" 
                      : agent.status === "inactive" 
                      ? "secondary" 
                      : "outline"
                  }
                >
                  {agent.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Company</p>
                    <p>{agent.company}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <p>{agent.email}</p>
                    <p>{agent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Coverage</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.coverage.map((zip) => (
                        <Badge key={zip} variant="outline">
                          {zip}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-muted-foreground">Active Leads</p>
                      <p className="text-2xl font-bold">{agent.leads}</p>
                    </div>
                    <div>
                      <p className="font-medium text-muted-foreground">Last Active</p>
                      <p>{new Date(agent.lastActive).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 