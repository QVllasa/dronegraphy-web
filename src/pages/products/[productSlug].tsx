import {serverSideTranslations} from 'next-i18next/serverSideTranslations';
import {useTranslation} from 'next-i18next';
import type {GetStaticPaths, GetStaticProps, InferGetStaticPropsType,} from 'next';
import {useRouter} from 'next/router';
import type {NextPageWithLayout, Product} from '@/types';
import {motion} from 'framer-motion';
import Layout from '@/layouts/_layout';
import client from '@/data/client';
import Image from '@/components/ui/image';
import VideoSocialShare from '@/components/video/video-social-share';
import VideoInformation from '@/components/video/video-information';
import VideoDetailsPaper from '@/components/video/video-details-paper';
import {LongArrowIcon} from '@/components/icons/long-arrow-icon';
import {fadeInBottom, fadeInBottomWithScaleY,} from '@/lib/framer-motion/fade-in-bottom';
import placeholder from '@/assets/images/placeholders/product.svg';
import ProductReviews from '@/components/review/product-reviews';
import AverageRatings from '@/components/review/average-ratings';
import ProductQuestions from '@/components/questions/product-questions';
import isEmpty from 'lodash/isEmpty';
import invariant from 'tiny-invariant';
import AnchorLink from "@/components/ui/links/anchor-link";
import routes from "@/config/routes";
import FavoriteButton from "@/components/favorite/favorite-button";
import {ShoppingCartIcon} from "@/components/icons/shopping-cart-icon";
import pluralize from "pluralize";
import {DownloadIcon} from "@/components/icons/download-icon";
import {isFree} from "@/lib/is-free";
import ReactPlayer from "react-player";

// This function gets called at build time
type ParsedQueryParams = {
  productSlug: string;
};

export const getStaticPaths: GetStaticPaths<ParsedQueryParams> = async ({locales,}) => {
  invariant(locales, 'locales is not defined');
  const {data} = await client.products.all({limit: 100});
  const paths = data?.flatMap((product) =>
      locales?.map((locale) => ({
        params: {productSlug: product.slug},
        locale,
      }))
  );
  return {
    paths,
    fallback: 'blocking',
  };
};

type PageProps = {
  product: Product;
};

export const getStaticProps: GetStaticProps<PageProps, ParsedQueryParams> = async ({params, locale}) => {
  const {productSlug} = params!; //* we know it's required because of getStaticPaths
  try {
    const product = await client.products.get({
      slug: productSlug,
      language: locale,
    });
    return {
      props: {
        product,
        ...(await serverSideTranslations(locale!, ['common'])),
      },
      revalidate: 60, // In seconds
    };
  } catch (error) {
    //* if we get here, the product doesn't exist or something else went wrong
    return {
      notFound: true,
    };
  }
};

function getPreviews(gallery: any[], image: any) {
  if (!isEmpty(gallery) && Array.isArray(gallery)) return gallery;
  if (!isEmpty(image)) return [image, {}];
  return [{}, {}];
}

const ProductPage: NextPageWithLayout<InferGetStaticPropsType<typeof getStaticProps>> = ({product}) => {
  const {t} = useTranslation('common');
  const router = useRouter();
  const isFreeItem = isFree(product.sale_price ?? product.price);
  const defaultUrl = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8";

  return (
      <div className="relative">
        <div className="h-full min-h-screen p-4 md:px-6 lg:px-8 lg:pt-6">
          <div
              className="sticky top-0 z-20 -mx-4 mb-1 -mt-2 flex items-center bg-light-300 p-4 dark:bg-dark-100 sm:static sm:top-auto sm:z-0 sm:m-0 sm:mb-4 sm:bg-transparent sm:p-0 sm:dark:bg-transparent">
            <button
                onClick={() => router.back()}
                className="group inline-flex items-center gap-1.5 font-medium text-dark/70 hover:text-dark rtl:flex-row-reverse dark:text-light/70 hover:dark:text-light lg:mb-6"
            >
              <LongArrowIcon className="h-4 w-4"/>
              {t('text-back')}
            </button>
          </div>
          <div
              className=" flex flex-col p-4 items-center justify-center  md:p-6 lg:flex-row lg:space-x-7 xl:space-x-8 xl:p-8 3xl:space-x-10 bg-light dark:bg-dark-250">
            <div
                className="pt-8 mb-4 w-full shrink-0 items-center justify-center overflow-hidden md:mb-6 lg:mb-auto lg:max-w-[480px] xl:flex xl:max-w-[570px] 2xl:max-w-[650px] 3xl:max-w-[795px]">
              <div className={'pt-[56.25%] relative w-full h-full'}>
                <ReactPlayer playing={false}
                             className={'absolute top-0 left-0 '}
                             width={'100%'}
                             height={'100%'}
                             url={defaultUrl}
                             controls={true} muted={true}/>
              </div>

            </div>
            <div className=" flex flex-col justify-start text-13px lg:w-[400px] xl:w-[520px] 3xl:w-[555px]">
              <div className="-mx-2.5 flex flex-wrap items-center  py-3  md:py-4  lg:-mx-4 ">
                <h2 title={product.name}
                    className="truncate px-2.5 py-1 text-base font-medium text-dark dark:text-light md:text-lg ltr:lg:pl-4 ltr:lg:pr-5 rtl:lg:pr-4 rtl:lg:pl-5 3xl:text-xl">
                  <AnchorLink
                      href={routes.productUrl(product.slug)}
                      className="transition-colors hover:text-brand"
                  >
                    {product.name}
                  </AnchorLink>
                </h2>
                <div className="flex flex-shrink-0 items-center px-2.5 py-1">
                  <div className="relative flex h-5 w-5 flex-shrink-0 md:h-6 md:w-6">
                    <Image
                        alt={product.shop.name}
                        layout="fill"
                        quality={100}
                        objectFit="cover"
                        src={product.shop.logo.thumbnail ?? placeholder}
                        className="rounded-full"
                    />
                  </div>
                  <h3
                      title={product.name}
                      className="text-13px font-medium text-dark-600 ltr:pl-2 rtl:pr-2 dark:text-light-800 ltr:md:pl-2.5 rtl:md:pr-2.5"
                  >
                    <AnchorLink
                        href={routes.shopUrl(product.shop?.slug)}
                        className="hover:text-accent transition-colors"
                    >
                      {product.shop?.name}
                    </AnchorLink>
                  </h3>

                  <FavoriteButton productId={product?.id}/>
                </div>
              </div>
              <div className="pb-7 xs:pb-8 lg:pb-10">
                <div className="pb-5 leading-[1.9em] rtl:text-right dark:text-light-600 xl:pb-6 3xl:pb-8">
                  {product.description}
                </div>
                <div
                    className="flex space-x-6 border-t border-light-500 py-3 rtl:space-x-reverse dark:border-dark-500 md:py-4 3xl:py-5">
                  {!isFreeItem && (
                      <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                        <ShoppingCartIcon
                            className="h-[18px] w-[18px] text-dark-900 ltr:mr-2.5 rtl:ml-2.5 dark:text-light-800"/>
                        {pluralize(t('text-sale'), product.orders_count, true)}
                      </div>
                  )}
                  <div className="flex items-center tracking-[.1px] text-dark dark:text-light">
                    <DownloadIcon
                        className="h-[18px] w-[18px] text-dark-900 ltr:mr-2.5 rtl:ml-2.5 dark:text-light-800"/>
                    {pluralize(t('text-download'), product.total_downloads, true)}
                  </div>
                </div>
                <VideoInformation
                    tags={product.tags}
                    created_at={product.created_at}
                    updated_at={product.updated_at}
                    layoutType={product.type.name}
                    //@ts-ignore
                    icon={product.type?.icon}
                    className="border-t border-light-500 py-5 dark:border-dark-500 lg:py-6 3xl:py-10"
                />
                <div className="border-t border-light-500 pt-5 dark:border-dark-500">
                  <VideoSocialShare productSlug={product.slug}/>
                </div>
                <div className={'mt-4'}>
                  <AverageRatings
                      ratingCount={product.rating_count}
                      totalReviews={product.total_reviews}
                      ratings={product.ratings}
                  />
                </div>
              </div>
            </div>
          </div>
          <motion.div
              variants={fadeInBottom()}
              className="justify-center py-6 lg:flex lg:flex-col lg:py-10"
          >
            <VideoDetailsPaper product={product} className="lg:hidden"/>
            <div className="lg:mx-auto 3xl:max-w-[1200px]">
              <div className="mt-4 w-full md:mt-8 md:space-y-10 lg:mt-12 lg:flex lg:flex-col lg:space-y-12">
                <ProductReviews productId={product.id}/>
                <ProductQuestions
                    productId={product?.id}
                    shopId={product?.shop?.id}
                />
              </div>
            </div>

            <VideoSocialShare
                productSlug={product.slug}
                className="border-t border-light-500 pt-5 dark:border-dark-400 md:pt-7 lg:hidden"
            />

          </motion.div>
      </div>
      <motion.div
        variants={fadeInBottomWithScaleY()}
        className="sticky bottom-0 right-0 z-10 hidden h-[100px] w-full border-t border-light-500 bg-light-100 px-8 py-5 dark:border-dark-400 dark:bg-dark-200 lg:flex 3xl:h-[120px]"
      >
        <VideoDetailsPaper product={product}/>
      </motion.div>
    </div>
  );
};

ProductPage.getLayout = function getLayout(page) {
  return <Layout>{page}</Layout>;
};

export default ProductPage;
