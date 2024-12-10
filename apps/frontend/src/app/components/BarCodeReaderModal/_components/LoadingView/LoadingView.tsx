import { FC } from 'react';
import { motion } from 'framer-motion';
import { Camera } from '@phosphor-icons/react';

export const LoadingView: FC = () => {
    return (
        <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-orange-50/50 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        >
        <div className="animate-pulse mb-2">
            <Camera 
            size={32}
            weight="duotone"
            color="#FB923C"
            />
        </div>
        <p className="text-sm text-orange-600">カメラを起動しています...</p>
        </motion.div>
    );
};