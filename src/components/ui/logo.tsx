import cn from 'classnames';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import routes from '@/config/routes';
import {useIsMounted} from '@/lib/hooks/use-is-mounted';
import {useIsDarkMode} from '@/lib/hooks/use-is-dark-mode';
import {siteSettings} from '@/data/static/site-settings';
import {useSettings} from '@/data/settings';

export default function Logo({
  className = 'w-20',
  ...props
}: React.AnchorHTMLAttributes<{}>) {
  const isMounted = useIsMounted();
  const { isDarkMode } = useIsDarkMode();
  const { lightLogo, darkLogo } = siteSettings;
  const { settings }: any = useSettings();
  return (
    <AnchorLink
      href={routes.home}
      className={cn(
        'relative flex items-center text-dark focus:outline-none dark:text-light',
        className
      )}
      {...props}
    >
      <span
          className="relative"
          // style={{
          //   width: siteSettings?.width,
          //   height: siteSettings?.height,
          // }}
      >
        {/*{isMounted && isDarkMode && (*/}
        <div className={'w-64 h-12'}>
          <Image
              src={'/icons/dronegraphy_Logo_V2.5.svg'}
              layout="fill"
              objectFit="contain"
              loading="eager"
              alt={settings?.siteTitle ?? 'Dark Logo'}
          />
        </div>

        {/*)}*/}
        {/*<p className={'font-bold text-2xl text-brand'}>DroneGraphy</p>*/}
        {/*{isMounted && !isDarkMode && (*/}
        {/*  <Image*/}
        {/*    src={settings?.logo?.original ?? lightLogo}*/}
        {/*    layout="fill"*/}
        {/*    objectFit="contain"*/}
        {/*    loading="eager"*/}
        {/*    alt={settings?.siteTitle ?? 'Light Logo'}*/}
        {/*  />*/}
        {/*)}*/}
      </span>
    </AnchorLink>
  );
}