import AdminSidebar from '@/components/admin/sidebar';
import { ToastProvider } from '@/components/admin/toast';

export default function AdminLayout({ children, params }) {
  const { locale } = params;
  return (
    <ToastProvider>
      <div className="flex min-h-[80vh]">
        <AdminSidebar locale={locale} />
        <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8 max-w-6xl ml-0 md:ml-0">
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
