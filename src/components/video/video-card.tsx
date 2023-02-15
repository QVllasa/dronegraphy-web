import type {Product} from '@/types';
import {motion} from 'framer-motion';
import Image from '@/components/ui/image';
import AnchorLink from '@/components/ui/links/anchor-link';
import {useModalAction} from '@/components/modal-views/context';
import routes from '@/config/routes';
import usePrice from '@/lib/hooks/use-price';
import placeholder from '@/assets/images/placeholders/product.svg';
import {useGridSwitcher} from '@/components/video/grid-switcher';
import {fadeInBottomWithScaleX} from '@/lib/framer-motion/fade-in-bottom';
import {isFree} from '@/lib/is-free';
import {useTranslation} from 'next-i18next';
import {useEffect, useRef, useState} from "react";
import cn from "classnames";
import {FaCartPlus, FaShareAlt, FaShoppingCart} from "react-icons/fa";
import {Tooltip} from "@mui/material";
import {useCart} from "@/components/cart/lib/cart.context";
import {generateCartItem} from "@/components/cart/lib/generate-cart-item";
import toast from "react-hot-toast";
import FavoriteButton from "@/components/favorite/favorite-button";
import VideoPlayer from "@/components/video/video-player";


export default function VideoCard({product}: { product: Product }) {
    const {name, slug, image, shop} = product ?? {};
    const {openModal} = useModalAction();
    const {isGridCompact} = useGridSwitcher();
    const {price, basePrice} = usePrice({
        amount: product.sale_price ? product.sale_price : product.price,
        baseAmount: product.price,
    });
    const videoRef = useRef<any>(null);

    const {t} = useTranslation('common');
    const isFreeItem = isFree(product?.sale_price ?? product?.price);

    const {addItemToCart, isInCart} = useCart();
    const [inCart, setInCart] = useState(false);

    useEffect(() => {
        setInCart(isInCart(product?.id))
    }, [isInCart])


    const handleMouseEnter = () => {
        console.log("mouse enter")
        videoRef.current?.play();
    };

    const handleMouseLeave = () => {
        console.log("mouse leave")
        videoRef?.current?.stop();
        videoRef?.current?.reset();
    };


    function handleAddToCart() {
        console.log("on handle add cart")
        if (isInCart(product?.id)) return;
        setTimeout(() => {
            addSuccessfully();
        }, 650);
    }

    function addSuccessfully() {
        addItemToCart(generateCartItem(product), 1);
        toast.success(<b>{t('text-add-to-cart-message')}</b>, {});
        setTimeout(() => {
        }, 800);
    }

    return (
        <motion.div variants={fadeInBottomWithScaleX()} title={name}>
            <div onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}
                 className="group relative flex aspect-video w-full justify-center items-center overflow-hidden border border-white">
                <VideoPlayer video={product} ref={videoRef}/>
                <div
                    className="absolute top-0 right-0 z-10 flex flex-col h-auto w-auto cursor-pointer items-end justify-start gap-2  p-4   transition-all  group-hover:opacity-100 ">
                    <Tooltip title={'Add to favorites'} disableInteractive>
                        <div
                            className={cn(
                                'text-center font-medium text-light',
                                isGridCompact ? 'text-xs' : 'text-13px'
                            )}
                        >
                            <div
                                className={cn(
                                    'mb-2 flex items-center justify-center rounded-full border border-white hover:backdrop-blur-sm hover:border-blue-500 text-light  transition-all hover:text-blue-500',
                                    isGridCompact ? 'h-6 w-6' : 'h-[50px] w-[50px]'
                                )}
                            >
                                <FavoriteButton productId={product.id} className={'h-3 w-3'}/>
                            </div>
                        </div>
                    </Tooltip>
                    <Tooltip title={'Add to cart'} disableInteractive>
                        <button
                            onClick={handleAddToCart}
                            className={cn(
                                'relative z-[11] text-center font-medium text-light',
                                isGridCompact ? 'text-xs' : 'text-13px'
                            )}
                        >
                            <div
                                className={`${isGridCompact ? 'h-6 w-6' : 'h-[50px] w-[50px]'} ${inCart ? 'border border-emerald-500' : 'border border-white hover:border-blue-500'} mb-2 flex items-center justify-center rounded-full  hover:backdrop-blur-sm  text-light  transition-all hover:text-blue-500 `
                                }
                            >
                                {
                                    inCart ? (<FaShoppingCart
                                        className={cn(isGridCompact ? 'text-emerald-500 h-3 w-3' : 'h-5 w-5')}/>) : (
                                        <FaCartPlus className={cn(isGridCompact ? 'h-3 w-3' : 'h-5 w-5')}/>)
                                }

                            </div>
                        </button>
                    </Tooltip>
                    <Tooltip title={'Share'} disableInteractive>
                        <button
                            onClick={() => openModal('PRODUCT_DETAILS', {slug})}
                            className={cn(
                                'relative z-[11] text-center font-medium text-light',
                                isGridCompact ? 'text-xs' : 'text-13px'
                            )}
                        >
                            <div
                                className={cn(
                                    'mb-2 flex items-center justify-center rounded-full border border-white hover:backdrop-blur-sm hover:border-blue-500 text-light  transition-all hover:text-blue-500',
                                    isGridCompact ? 'h-6 w-6' : 'h-[50px] w-[50px]'
                                )}
                            >
                                <FaShareAlt
                                    className={cn(isGridCompact ? 'h-3 w-3' : 'h-5 w-5')}
                                />
                            </div>
                        </button>
                    </Tooltip>
                </div>
            </div>

            {/*Shop | Author | Title*/}
            <div className="flex items-start justify-between pt-3.5">
                <div className="relative flex h-8 w-8 flex-shrink-0 4xl:h-9 4xl:w-9">
                    <Image
                        alt={shop?.name}
                        layout="fill"
                        quality={100}
                        objectFit="cover"
                        src={shop?.logo?.thumbnail ?? placeholder}
                        className="rounded-full bg-light-500 dark:bg-dark-400"
                    />
                </div>
                <div
                    className="-mt-[1px] flex flex-col truncate ltr:mr-auto ltr:pl-2.5 rtl:ml-auto rtl:pr-2.5 rtl:text-right">
                    <h3
                        title={name}
                        className="mb-0.5 truncate font-medium text-dark-100 dark:text-light"
                    >
                        <AnchorLink href={routes.productUrl(slug)}>{name}</AnchorLink>
                    </h3>
                    <AnchorLink
                        href={routes.shopUrl(shop?.slug)}
                        className="font-medium text-light-base hover:text-brand dark:text-dark-800 dark:hover:text-brand"
                    >
                        {shop?.name}
                    </AnchorLink>
                </div>

                <div className="flex flex-shrink-0 flex-col items-end pl-2.5">
                    <span
                        className="rounded-2xl bg-light-500 px-1.5 py-0.5 text-13px font-semibold uppercase text-brand dark:bg-dark-300 dark:text-sky-200">
                        {isFreeItem ? t('text-free') : price}
                    </span>
                    {!isFreeItem && basePrice && (
                        <del className="px-1 text-13px font-medium text-dark-900 dark:text-dark-700">
                            {basePrice}
                        </del>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
