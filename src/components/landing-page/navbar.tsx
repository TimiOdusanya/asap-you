import React from "react";
import {
  RoleSwitcher,
  type RoleKey,
  type NavLink,
  type NavbarVariant,
} from "@/components/landing-page/role-switcher";

interface NavbarProps {
  current?: RoleKey;
  navLinks?: NavLink[];
  variant?: NavbarVariant;
}

const Navbar = ({ current = "customer", navLinks, variant = "default" }: NavbarProps) => {
  return <RoleSwitcher current={current} navLinks={navLinks} variant={variant} />;
};

export default Navbar;
