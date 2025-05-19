"use client";

import React from 'react';
import {motion, AnimatePresence} from '@/lib/motion'
import { cartContainerVariants, cartItemVariants, checkoutButtonVariants } from '@/lib/motion';
import { formatPrice } from '@/lib/format';
import CartEntry from './CartEntry';
import { ShoppingCart } from '@/lib/db/cart';

interface AnimatedCartPageProps {
    cart: ShoppingCart | null;
    setProductQuantity: (productId: string, quantity: number) => Promise<void>;
}


const AnimatedCartPage = ({cart, setProductQuantity}: AnimatedCartPageProps) => {
    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
        >
            <motion.h1
                className='text-3xl mb-6 font-bold'
                initial={{opacity: 0, y: -20}}
                animate={{opacity:1, y: 0}}
                transition={{duration: 0.6}}
            >
                Shopping Cart
            </motion.h1>

            <AnimatePresence mode="wait">
                {cart?.item && cart.item.length > 0 ? (
                    <motion.div
                        variants={cartContainerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {cart.item.map((cartItem: { product: { id: string; name: string; description: string; imageUrl: string; price: number; createdAt: Date; updatedAt: Date; }; } & { id: string; productId: string; quantity: number; cartId: string; }) => (
                            <motion.div
                                variants={cartItemVariants}
                                key={cartItem.id}
                                exit={{
                                    opacity: 0,
                                    x: -100,
                                    transition: {duration: 0.3}
                                }}
                            >
                                <CartEntry cartItem={cartItem} key={cartItem.id} setProductQuantity={setProductQuantity}/>
                            </motion.div>
                        ))}
                    </motion.div>
                ): (
                    <motion.p 
                        key="empty-cart"
                        className='mt-6 text-4xl'
                        initial={{opacity: 0}}
                        animate= {{opacity: 1, y: [20, 0]}}
                        transition= {{duration: 0.5}}
                        >
                            Your cart is empty 
                    </motion.p>
                )}
            </AnimatePresence>

            <motion.div
                className="flex flex-col items-end pb-8 sm:items-center"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.3, duration: 0.5}}
            >   
                <motion.p
                    className="mb-3 font-bold"
                    initial={{scale: 0.9}}
                    animate={{scale: 1}}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        delay: 0.4
                    }}
                >
                    Total: {formatPrice(cart?.subtotal || 0)}
                </motion.p>

                <motion.button
                    className="btn bg-amber-500 transition-colors hover:bg-amber-600 sn:w-[200px]"
                    variants={checkoutButtonVariants}
                    initial='initial'
                    whileHover="hover"
                    whileTap="tap"
                >
                    Checkout
                </motion.button>
            </motion.div>
        </motion.div>
    )
}

export default AnimatedCartPage;