import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import Icon from "./images/EmbeddedLogoScaledText.png"



/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
 

async function RetrievePathname()  {

  const pathname = await (await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getPage`)).json()
  if (pathname && typeof(pathname) == "string" && pathname.includes("/docs")) {
    return "mt-0"
  } else {
    return "mt-6"
  }
}

export const baseOptions: BaseLayoutProps = {
  githubUrl: "https://github.com/The-Embedded-Project/Embedded-Curriculum",
  nav: {
    title: 'The Embedded Curriculum',
  },
  links: [
    {
      text: 'Documentation',
      url: '/docs/Course1',
      active: 'nested-url',
    },
    {
      type: 'icon',
      label: 'Visit Homepage', // `aria-label`
      icon: <div className={`LogoBackground relative flex justify-center items-center ${RetrievePathname()}`}>
      <Image 
        src={Icon.src} 
        width={80} 
        height={80} 
        alt={''} 
        className='align-middle Logo m-0 mt-[2em] rounded-md flex items-center relative z-10' 
      />
      <div className="absolute inset-0 rounded-md backdrop-blur-md"></div>
    </div>
    
    ,
      text: 'Back To Home',
      url: '/',
    },
    {
      type: 'menu',
      text: 'Guide',
      items: [
        {
          text: 'Getting Started',
          description: 'Learn to use Fumadocs',
          url: '/docs/Course1',
        },
      ],
    },
  ],
  
};
