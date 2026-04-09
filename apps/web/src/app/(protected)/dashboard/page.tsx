"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  ArrowUpRight,
  Video,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const stats = [
  {
    name: "Total Meetings",
    value: "48",
    change: "+12%",
    trend: "up",
    icon: Calendar,
  },
  {
    name: "Hours Saved",
    value: "24h",
    change: "+8%",
    trend: "up",
    icon: Clock,
  },
  {
    name: "Team Members",
    value: "12",
    change: "+2",
    trend: "up",
    icon: Users,
  },
  {
    name: "Completion Rate",
    value: "94%",
    change: "+3%",
    trend: "up",
    icon: TrendingUp,
  },
];

const upcomingMeetings = [
  {
    id: 1,
    title: "Product Review",
    time: "10:00 AM",
    duration: "45 min",
    attendees: [
      { name: "Alice", avatar: "" },
      { name: "Bob", avatar: "" },
      { name: "Carol", avatar: "" },
    ],
    type: "video",
  },
  {
    id: 2,
    title: "Sprint Planning",
    time: "2:00 PM",
    duration: "1 hour",
    attendees: [
      { name: "David", avatar: "" },
      { name: "Eve", avatar: "" },
    ],
    type: "video",
  },
  {
    id: 3,
    title: "1:1 with Sarah",
    time: "4:30 PM",
    duration: "30 min",
    attendees: [{ name: "Sarah", avatar: "" }],
    type: "video",
  },
];

const recentActivity = [
  {
    id: 1,
    action: "Meeting scheduled",
    subject: "Design Review with Marketing",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Invite accepted",
    subject: "Alex joined Q4 Planning",
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Meeting rescheduled",
    subject: "Weekly Standup moved to Friday",
    time: "Yesterday",
  },
  {
    id: 4,
    action: "New team member",
    subject: "Jordan was added to your team",
    time: "2 days ago",
  },
];

export default function DashboardContent() {
  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="mx-auto max-w-6xl">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">
            Good morning, John
          </h1>
          <p className="mt-1 text-muted-foreground">
            {"You have 3 meetings scheduled for today. Here's your overview."}
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="border-border/50 bg-card/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <stat.icon className="h-5 w-5 text-accent" />
                  </div>
                  <span className="flex items-center gap-1 text-xs text-accent">
                    {stat.change}
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upcoming Meetings */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    Today&apos;s Meetings
                  </CardTitle>
                  <CardDescription>Your schedule for today</CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  View all
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {upcomingMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between rounded-xl border border-border/50 bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                        <Video className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {meeting.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {meeting.time} · {meeting.duration}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {meeting.attendees.map((attendee, i) => (
                          <Avatar
                            key={i}
                            className="h-8 w-8 border-2 border-background"
                          >
                            <AvatarImage src={attendee.avatar} />
                            <AvatarFallback className="bg-accent/20 text-xs text-accent">
                              {attendee.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <Button size="sm" variant="outline">
                        Join
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Activity */}
          <div>
            <Card className="border-border/50 bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest updates from your team</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex flex-col gap-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.subject}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {activity.time}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-6">
              <div>
                <p className="font-medium text-foreground">Quick Actions</p>
                <p className="text-sm text-muted-foreground">
                  Shortcuts to your most common tasks
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Invite Team
                </Button>
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" />
                  Set Availability
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
