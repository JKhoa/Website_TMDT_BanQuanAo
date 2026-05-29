'use client';

import AdminLayout from '@/app/pages/admin/AdminLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
