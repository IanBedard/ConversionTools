// components/NavigationMenu.tsx
'use client'

import { Button } from '@/components/ui/button'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu'
import Link from 'next/link'

export default function Navigation() {
  return (
    <div className="w-full bg-white text-black p-4 shadow-lg mb-6">
    <NavigationMenu>
      <NavigationMenuList className="flex justify-center space-x-8">
        <NavigationMenuItem>
          <Link href="/" passHref>
            <NavigationMenuLink asChild>
              <Button variant="ghost" className="hover:underline text-black font-semibold">
                Home
              </Button>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/#" passHref>
            <NavigationMenuLink asChild>
              <Button variant="ghost" className="hover:underline text-black font-semibold">
                DOCX to JSON
              </Button>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/#" passHref>
            <NavigationMenuLink asChild>
              <Button variant="ghost" className="hover:underline text-black font-semibold">
               Coming Soon
              </Button>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
  
  );
}
