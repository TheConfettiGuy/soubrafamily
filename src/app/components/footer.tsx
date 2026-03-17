import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import footerData from "@/data/footer.json";

const iconMap = {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
};

const Footer = () => {
  const logoVisible = footerData.logo?.visible !== false;
  const sections = (footerData.sections ?? []).filter(
    (s) => s.visible !== false
  );
  const socialMedia = (footerData.socialMedia ?? []).filter(
    (s) => s.visible !== false
  );

  return (
    <footer className="bg-main-100 text-white" dir="rtl">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            {logoVisible && (
              <div className="mb-4">
                <Image
                  src={footerData.logo.src || "/placeholder.svg"}
                  alt={footerData.logo.alt}
                  width={180}
                  height={80}
                  className="h-16 w-auto bg-white p-2 rounded"
                />
              </div>
            )}
            <p className="text-gray-300 text-sm leading-relaxed">
              {footerData.description}
            </p>
            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              {socialMedia.map((social) => {
                const Icon = iconMap[social.icon as keyof typeof iconMap];
                if (!Icon) return null;
                return (
                  <a
                    key={social.id ?? social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/10 hover:bg-white/20 p-2 rounded transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={section.id ?? index}>
              <h3 className="text-lg font-bold mb-4">{section.title}</h3>
              {section.links && (
                <ul className="space-y-2">
                  {section.links
                    .filter((l) => l.visible !== false)
                    .map((link, linkIndex) => (
                      <li key={link.id ?? linkIndex}>
                        <Link
                          href={link.href}
                          className="text-gray-300 hover:text-white transition-colors text-sm"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
              {section.contact && (
                <ul className="space-y-3">
                  {section.contact
                    .filter((item) => item.visible !== false)
                    .map((item, itemIndex) => {
                      const Icon = iconMap[item.icon as keyof typeof iconMap];
                      if (!Icon) return null;
                      return (
                        <li
                          key={item.id ?? itemIndex}
                          className="flex items-center gap-2 text-gray-300 text-sm"
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.text}</span>
                        </li>
                      );
                    })}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="border-t border-white/20 pt-8">
          <p className="text-center text-gray-300 text-sm">
            {footerData.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
