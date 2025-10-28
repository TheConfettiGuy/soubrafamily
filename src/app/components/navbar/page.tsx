"use client";

import navbarData from "@/data/navbar.json";
import {
  Briefcase,
  ChevronDown,
  Code,
  Cpu,
  Facebook,
  Home,
  Instagram,
  Layout,
  Linkedin,
  Mail,
  Menu,
  Package,
  ShoppingBag,
  Smartphone,
  TrendingUp,
  Twitter,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const iconMap: Record<string, any> = {
  home: Home,
  briefcase: Briefcase,
  package: Package,
  users: Users,
  mail: Mail,
  layout: Layout,
  smartphone: Smartphone,
  "trending-up": TrendingUp,
  code: Code,
  cpu: Cpu,
  "shopping-bag": ShoppingBag,
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
};

interface DropdownItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  icon: string;
  dropdown?: DropdownItem[];
}

interface TopBarLink {
  id: string;
  label: string;
  href: string;
}

interface SocialMediaItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (itemId: string) => {
    setOpenDropdown(openDropdown === itemId ? null : itemId);
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    return pathname === href;
  };

  const renderIcon = (iconName: string, className = "w-4 h-4") => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  return (
    <>
      {/* Top Navbar with logo, social media, and links */}
      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="جمعية آل سويرة"
                  width={200}
                  height={180}
                  className="h-16 w-auto"
                />
              </Link>
            </div>

            {/* Social Media and Links */}
            <div className="flex items-center gap-6">
              {/* Social Media Icons */}
              <div className="flex items-center gap-3">
                {navbarData.topBar.socialMedia.map(
                  (social: SocialMediaItem) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-main-100 transition-colors"
                      aria-label={social.label}
                    >
                      {renderIcon(social.icon, "w-5 h-5")}
                    </a>
                  )
                )}
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-300"></div>

              {/* Top Links */}
              <div className="flex items-center gap-2">
                {navbarData.topBar.links.map(
                  (link: TopBarLink, index: number) => (
                    <div key={link.id} className="flex items-center gap-2">
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 hover:text-main-100 transition-colors"
                      >
                        {link.label}
                      </Link>
                      {index < navbarData.topBar.links.length - 1 && (
                        <span className="text-gray-400">|</span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-gray-100 border-b border-gray-200" dir="rtl">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 md:hidden">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="جمعية آل سويرة"
                  width={120}
                  height={60}
                  className="h-12 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              {/* items-stretch + h-16 lets children use h-full */}
              <div className="flex items-stretch gap-1 h-16">
                {navbarData.items.map((item: NavItem) => (
                  <div key={item.id} className="relative group h-full">
                    {item.dropdown ? (
                      <>
                        {/* Full height; keep horizontal padding (px-4); remove py & rounded */}
                        <button
                          className={`flex items-center gap-2 px-4 text-base font-medium transition-colors h-full
                            hover:bg-main-100 hover:text-white ${
                              isActive(item.href)
                                ? "bg-main-100 text-white"
                                : "text-gray-700"
                            }`}
                        >
                          <span>{item.label}</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>

                        {/* Dropdown Menu (kept as-is for readability) */}
                        <div className="absolute left-0 mt-1 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div className="bg-white shadow-lg border border-gray-200 py-2">
                            {item.dropdown.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.id}
                                href={dropdownItem.href}
                                className={
                                  isActive(dropdownItem.href)
                                    ? "flex items-center gap-3 px-4 py-2.5 text-base transition-colors bg-main-100 text-white"
                                    : "flex items-center gap-3 px-4 py-2.5 text-base transition-colors hover:bg-main-100 hover:text-white text-gray-700"
                                }
                              >
                                <span>{dropdownItem.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={item.href!}
                        className={`flex items-center gap-2 px-4 text-base font-medium transition-colors h-full
                          hover:bg-main-100 hover:text-white ${
                            isActive(item.href)
                              ? "bg-main-100 text-white"
                              : "text-gray-700"
                          }`}
                      >
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-main-100 hover:bg-gray-200 transition-colors"
                aria-label="القائمة الرئيسية"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navbarData.items.map((item: NavItem) => (
                <div key={item.id}>
                  {item.dropdown ? (
                    <>
                      <button
                        onClick={() => toggleDropdown(item.id)}
                        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-base font-medium transition-colors rounded-md hover:bg-main-100 hover:text-white text-gray-700"
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown
                          className={
                            openDropdown === item.id
                              ? "w-4 h-4 transition-transform rotate-180"
                              : "w-4 h-4 transition-transform"
                          }
                        />
                      </button>

                      {/* Mobile Dropdown */}
                      {openDropdown === item.id && (
                        <div className="mr-4 mt-1 space-y-1">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.id}
                              href={dropdownItem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={
                                isActive(dropdownItem.href)
                                  ? "flex items-center gap-3 px-3 py-2.5 text-base transition-colors rounded-md bg-main-100 text-white"
                                  : "flex items-center gap-3 px-3 py-2.5 text-base transition-colors rounded-md hover:bg-main-100 hover:text-white text-gray-700"
                              }
                            >
                              <span>{dropdownItem.label}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={
                        isActive(item.href)
                          ? "flex items-center gap-2 px-3 py-2.5 text-base font-medium transition-colors rounded-md bg-main-100 text-white"
                          : "flex items-center gap-2 px-3 py-2.5 text-base font-medium transition-colors rounded-md hover:bg-main-100 hover:text-white text-gray-700"
                      }
                    >
                      <span>{item.label}</span>
                    </Link>
                  )}
                </div>
              ))}

              {/* Top Bar Links and Social Media */}
              <div className="border-t border-gray-300 mt-4 pt-4">
                {/* Top Bar Links */}
                {navbarData.topBar.links.map((link: TopBarLink) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-base font-medium transition-colors rounded-md hover:bg-main-100 hover:text-white text-gray-700"
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}

                {/* Social Media */}
                <div className="px-3 py-4">
                  <p className="text-base font-medium text-gray-700 mb-3">
                    تابعنا على
                  </p>
                  <div className="flex items-center gap-4">
                    {navbarData.topBar.socialMedia.map(
                      (social: SocialMediaItem) => (
                        <a
                          key={social.id}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-main-100 transition-colors"
                          aria-label={social.label}
                        >
                          {renderIcon(social.icon, "w-6 h-6")}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
