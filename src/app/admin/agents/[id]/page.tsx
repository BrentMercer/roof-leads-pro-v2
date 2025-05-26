import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CreditCardIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "lucide-react";

// Sample detailed agent data
const agentDetails = {
  id: "1",
  name: "John Smith",
  company: "Smith Roofing",
  email: "john@smithroofing.com",
  phone: "(555) 123-4567",
  status: "active",
  leads: 24,
  coverage: ["75001", "75002", "75003"],
  lastActive: "2024-03-20T15:30:00Z",
  subscription: {
    plan: "Professional",
    status: "active",
    nextBilling: "2024-04-20T00:00:00Z",
    price: 299.99,
  },
  stats: {
    totalLeads: 156,
    activeLeads: 24,
    closedLeads: 98,
    conversionRate: "62.8%",
  },
  recentActivity: [
    {
      type: "lead_assigned",
      description: "New lead assigned in 75001",
      date: "2024-03-20T15:30:00Z",
    },
    {
      type: "subscription_renewed",
      description: "Monthly subscription renewed",
      date: "2024-03-19T00:00:00Z",
    },
    {
      type: "coverage_updated",
      description: "Added coverage for 75003",
      date: "2024-03-15T10:20:00Z",
    },
  ],
};

export default function AgentDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{agentDetails.name}</h1>
          <p className="text-muted-foreground">{agentDetails.company}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <MailIcon className="mr-2 h-4 w-4" />
            Send Email
          </Button>
          <Button variant="outline">
            <PhoneIcon className="mr-2 h-4 w-4" />
            Call Agent
          </Button>
          <Button>
            <CheckCircleIcon className="mr-2 h-4 w-4" />
            Approve
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact & Status */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <MailIcon className="h-4 w-4 text-muted-foreground" />
              <span>{agentDetails.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-4 w-4 text-muted-foreground" />
              <span>{agentDetails.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <span>Coverage Areas: {agentDetails.coverage.join(", ")}</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              <span>Last Active: {new Date(agentDetails.lastActive).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">{agentDetails.subscription.plan}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={agentDetails.subscription.status === "active" ? "default" : "secondary"}>
                {agentDetails.subscription.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Billing</span>
              <span>{new Date(agentDetails.subscription.nextBilling).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Monthly Price</span>
              <span className="font-medium">${agentDetails.subscription.price}</span>
            </div>
          </CardContent>
        </Card>

        {/* Lead Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">{agentDetails.stats.totalLeads}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Leads</p>
                <p className="text-2xl font-bold">{agentDetails.stats.activeLeads}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Closed Leads</p>
                <p className="text-2xl font-bold">{agentDetails.stats.closedLeads}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{agentDetails.stats.conversionRate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {agentDetails.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-1">
                    {activity.type === "lead_assigned" ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : activity.type === "subscription_renewed" ? (
                      <CreditCardIcon className="h-4 w-4 text-blue-500" />
                    ) : (
                      <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 