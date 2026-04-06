"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/ui/PageHeader";
import { Badge } from "@/components/ui/Badge";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "@/lib/api";
import {
  User, Mail, Building2, GraduationCap, Calendar, BookOpen,
  Pencil, X, Save, Shield
} from "lucide-react";

const COURSES = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "BCA", "MCA", "MBA", "B.E", "M.E"];
const YEARS   = ["1st Year", "2nd Year", "3rd Year", "4th Year", "PG 1st Year", "PG 2nd Year"];
const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

const inputCls =
  "w-full rounded-xl border border-[#1e2d47] bg-[#0d1524] px-4 py-2.5 text-sm text-white placeholder:text-[#64748b] outline-none transition-all duration-200 focus:border-[#3b82f6]/60 focus:bg-[#101828] focus:ring-2 focus:ring-[#3b82f6]/15 hover:border-white/10";

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/[0.04] last:border-0">
      <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#06b6d4]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">{label}</div>
        <div className="text-sm text-white/70 truncate">{value || "Not provided"}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    college: user?.college || "",
    branch: user?.branch || "",
    course: user?.course || "B.Tech",
    year: user?.year || "1st Year",
    semester: user?.semester || "1",
  });

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateProfile(form);
      if (updated) {
        updateUser(updated);
        toast.success("Profile updated successfully");
      } else {
        // If backend not available, update locally
        if (user) {
          updateUser({ ...user, ...form });
          toast.success("Profile updated locally");
        }
      }
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || "",
      college: user?.college || "",
      branch: user?.branch || "",
      course: user?.course || "B.Tech",
      year: user?.year || "1st Year",
      semester: user?.semester || "1",
    });
    setEditing(false);
  };

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <ProtectedRoute>
    <div className="min-h-screen bg-[#080c14] pt-24">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-6">

        <PageHeader
          title="Profile"
          subtitle="Manage your account details and academic information"
          actions={
            !editing ? (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="w-3.5 h-3.5" /> Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <><Save className="w-3.5 h-3.5" /> Save Changes</>
                  )}
                </Button>
              </div>
            )
          }
        />

        <div className="space-y-4">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#06b6d4] flex items-center justify-center text-xl font-bold text-white shadow-[0_0_24px_rgba(59,130,246,0.3)]">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  {editing ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      className={inputCls + " text-lg font-semibold"}
                      placeholder="Your full name"
                    />
                  ) : (
                    <>
                      <h2 className="text-lg font-bold text-white truncate">{user?.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[#64748b]">{user?.email}</span>
                        <Badge variant="purple" className="text-[8px]">
                          <Shield className="w-2.5 h-2.5" />
                          {user?.role === "admin" ? "Admin" : "Student"}
                        </Badge>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {!editing ? (
                <div>
                  <InfoRow icon={<Mail className="w-3.5 h-3.5" />} label="Email" value={user?.email || ""} />
                  <InfoRow icon={<Building2 className="w-3.5 h-3.5" />} label="College" value={user?.college || ""} />
                  <InfoRow icon={<BookOpen className="w-3.5 h-3.5" />} label="Branch" value={user?.branch || ""} />
                  <InfoRow icon={<GraduationCap className="w-3.5 h-3.5" />} label="Course" value={user?.course || ""} />
                  <InfoRow icon={<Calendar className="w-3.5 h-3.5" />} label="Year" value={user?.year || ""} />
                  <InfoRow icon={<BookOpen className="w-3.5 h-3.5" />} label="Semester" value={user?.semester ? `Semester ${user.semester}` : "Not set"} />
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                      College / University
                    </label>
                    <input type="text" value={form.college} onChange={set("college")}
                      placeholder="Anna University" className={inputCls} />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                      Branch / Department
                    </label>
                    <input type="text" value={form.branch} onChange={set("branch")}
                      placeholder="Computer Science" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                        Course
                      </label>
                      <select value={form.course} onChange={set("course")}
                        className={inputCls + " cursor-pointer appearance-none"}>
                        {COURSES.map(c => <option key={c} value={c} className="bg-[#0d1524]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                        Year
                      </label>
                      <select value={form.year} onChange={set("year")}
                        className={inputCls + " cursor-pointer appearance-none"}>
                        {YEARS.map(y => <option key={y} value={y} className="bg-[#0d1524]">{y}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#64748b]">
                        Semester
                      </label>
                      <select value={form.semester} onChange={set("semester")}
                        className={inputCls + " cursor-pointer appearance-none"}>
                        {SEMESTERS.map(s => <option key={s} value={s} className="bg-[#0d1524]">Semester {s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Account info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader title="Account Information" />
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/70">Account Status</div>
                      <div className="text-[11px] text-[#64748b]">Your account is active and verified</div>
                    </div>
                  </div>
                  <Badge variant="green">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#06b6d4]">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/70">Role</div>
                      <div className="text-[11px] text-[#64748b]">
                        {user?.role === "admin" ? "Administrator with full access" : "Student with monitoring access"}
                      </div>
                    </div>
                  </div>
                  <Badge variant="purple">{user?.role === "admin" ? "Admin" : "Student"}</Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
