'use client';

import * as React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatCurrency } from '@/lib/utils';
import {
  Plus,
  Mail,
  User,
  Crown,
  Shield,
  Settings2,
  Trash2,
  Check,
  Users,
  Briefcase,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'founder' | 'admin' | 'member' | 'viewer';
  title: string;
  department: string;
  location: string;
  joined: string;
  equity: number;
  status: 'active' | 'invited' | 'disabled';
}

const demoTeam: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Alex Founder',
    email: 'alex@finflow.ai',
    role: 'founder',
    title: 'Co-Founder & CEO',
    department: 'Executive',
    location: 'San Francisco, CA',
    joined: '2023-06',
    equity: 40,
    status: 'active',
  },
  {
    id: 'member-2',
    name: 'Jordan Founder',
    email: 'jordan@finflow.ai',
    role: 'founder',
    title: 'Co-Founder & CTO',
    department: 'Engineering',
    location: 'New York, NY',
    joined: '2023-06',
    equity: 30,
    status: 'active',
  },
  {
    id: 'member-3',
    name: 'Priya Patel',
    email: 'priya@finflow.ai',
    role: 'admin',
    title: 'VP of Finance',
    department: 'Finance',
    location: 'Austin, TX',
    joined: '2024-01',
    equity: 2,
    status: 'active',
  },
  {
    id: 'member-4',
    name: 'Carlos Rivera',
    email: 'carlos@finflow.ai',
    role: 'member',
    title: 'Head of Revenue',
    department: 'Sales',
    location: 'Remote',
    joined: '2024-02',
    equity: 1.5,
    status: 'active',
  },
  {
    id: 'member-5',
    name: 'Emma Wilson',
    email: 'emma@finflow.ai',
    role: 'member',
    title: 'Lead Engineer',
    department: 'Engineering',
    location: 'Seattle, WA',
    joined: '2024-03',
    equity: 1,
    status: 'invited',
  },
];

const roleInfo = {
  founder: { label: 'Founder', icon: Crown, color: 'bg-yellow-100 text-yellow-700' },
  admin: { label: 'Admin', icon: Shield, color: 'bg-blue-100 text-blue-700' },
  member: { label: 'Member', icon: User, color: 'bg-green-100 text-green-700' },
  viewer: { label: 'Viewer', icon: EyeIcon, color: 'bg-gray-100 text-gray-700' },
};

export default function TeamPage() {
  const { currentStartup } = useAppStore();
  const [members, setMembers] = React.useState<TeamMember[]>(demoTeam);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<string>('all');
  const [isInviteOpen, setIsInviteOpen] = React.useState(false);
  const [inviteForm, setInviteForm] = React.useState({
    email: '',
    role: 'member' as TeamMember['role'],
    title: '',
    department: '',
  });

  const founders = members.filter((m) => m.role === 'founder');
  const totalFounderEquity = founders.reduce((sum, f) => sum + f.equity, 0);

  const filteredMembers = members.filter((m) => {
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !m.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !m.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (roleFilter !== 'all' && m.role !== roleFilter) return false;
    return true;
  });

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteForm.email.split('@')[0],
      email: inviteForm.email,
      role: inviteForm.role,
      title: inviteForm.title || 'New Member',
      department: inviteForm.department || 'Undefined',
      location: '—',
      joined: new Date().toISOString().slice(0, 7),
      equity: 0,
      status: 'invited',
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteForm({ email: '', role: 'member', title: '', department: '' });
    setIsInviteOpen(false);
  };

  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const updateRole = (id: string, role: TeamMember['role']) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role } : m)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Team Management</h1>
          <p className="text-muted-foreground">Manage your team, roles, and workspace access</p>
        </div>
        <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
          <DialogTrigger asChild>
            <Button variant="gold"><Plus className="h-4 w-4 mr-2" />Invite Member</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                They&apos;ll get an email with a magic link to join your workspace.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" value={inviteForm.email} onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})} placeholder="teammate@company.com" required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={inviteForm.role} onValueChange={(v) => setInviteForm({...inviteForm, role: v as any})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={inviteForm.title} onChange={(e) => setInviteForm({...inviteForm, title: e.target.value})} placeholder="Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input id="department" value={inviteForm.department} onChange={(e) => setInviteForm({...inviteForm, department: e.target.value})} placeholder="Engineering" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)}>Cancel</Button>
                <Button type="submit" variant="gold"><Mail className="h-4 w-4 mr-2" />Send Invite</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold">{members.filter((m) => m.status === 'active').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Crown className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Founders</p>
                <p className="text-2xl font-bold">{founders.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Founder Equity</p>
                <p className="text-2xl font-bold tabular-nums">{totalFounderEquity}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>Team Members ({members.length})</CardTitle>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search team..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64"
              />
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="All Roles" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="founder">Founders</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                  <SelectItem value="member">Members</SelectItem>
                  <SelectItem value="viewer">Viewers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Equity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.map((member) => {
                const role = roleInfo[member.role];
                return (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(member.name)}`} alt={member.name} />
                          <AvatarFallback>{member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {member.name}
                            {member.role === 'founder' && <Crown className="h-3.5 w-3.5 text-yellow-500" />}
                          </p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{member.title}</TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn(role.color)}>
                        {role.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {member.equity > 0 ? `${member.equity}%` : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.status === 'active' ? 'success' : member.status === 'invited' ? 'warning' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Select value={member.role} onValueChange={(v) => updateRole(member.id, v as any)} disabled={member.role === 'founder'}>
                          <SelectTrigger className="h-8 w-[100px] text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        {member.role !== 'founder' && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemove(member.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Permission</TableHead>
                <TableHead className="text-center">Founder</TableHead>
                <TableHead className="text-center">Admin</TableHead>
                <TableHead className="text-center">Member</TableHead>
                <TableHead className="text-center">Viewer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { name: 'View dashboard & metrics', founder: true, admin: true, member: true, viewer: true },
                { name: 'Edit financial models', founder: true, admin: true, member: true, viewer: false },
                { name: 'Manage cap table', founder: true, admin: true, member: false, viewer: false },
                { name: 'Update investor pipeline', founder: true, admin: true, member: false, viewer: false },
                { name: 'Send investor updates', founder: true, admin: true, member: false, viewer: false },
                { name: 'Invite team members', founder: true, admin: true, member: false, viewer: false },
                { name: 'Delete workspace', founder: true, admin: false, member: false, viewer: false },
              ].map((perm) => (
                <TableRow key={perm.name}>
                  <TableCell>{perm.name}</TableCell>
                  {(['founder', 'admin', 'member', 'viewer'] as const).map((role) => (
                    <TableCell key={role} className="text-center">
                      {perm[role] ? (
                        <Check className="h-4 w-4 text-green-600 inline" />
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return <Settings2 className={className} />;
}