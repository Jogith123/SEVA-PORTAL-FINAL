import { Link, useLocation } from "wouter";
import { 
  Building, 
  Home, 
  Upload, 
  FileText, 
  User, 
  Settings, 
  ClipboardCheck, 
  Users, 
  LogOut,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  const navigationItems = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  const adminItems = [
    { href: "/admin", icon: ClipboardCheck, label: "Pending Reviews", badge: "3" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Building className="h-8 w-8" />
              <div>
                <h1 className="text-xl font-bold">Government Document Portal</h1>
                <p className="text-sm opacity-90">Official Document Processing System</p>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/dashboard" className="hover:text-blue-200 transition-colors">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:text-blue-200 transition-colors">
                Profile
              </Link>
              <Link href="/admin" className="hover:text-blue-200 transition-colors">
                Admin
              </Link>
              <div className="flex items-center space-x-2 bg-blue-700 px-3 py-2 rounded">
                <User className="h-4 w-4" />
                <span>John Smith</span>
                <Button variant="ghost" size="sm" className="ml-2 hover:text-blue-200 text-white p-1">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </nav>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? "text-blue-600 bg-blue-50 font-medium"
                          : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Link>
                  );
                })}
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">
                    Admin Panel
                  </p>
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                          isActive(item.href)
                            ? "text-blue-600 bg-blue-50 font-medium"
                            : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                        {item.badge && (
                          <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Government Portal</h4>
              <p className="text-sm text-gray-300">
                Official document processing system for secure government services.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><a href="#help" className="hover:text-white">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white">Contact Support</a></li>
                <li><a href="#status" className="hover:text-white">System Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li><a href="#privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#accessibility" className="hover:text-white">Accessibility</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-6 pt-6 text-center text-sm text-gray-300">
            <p>&copy; 2024 Government Document Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
