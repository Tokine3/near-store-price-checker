import { FC } from 'react';
import { motion } from 'framer-motion';
import { Warning } from '@phosphor-icons/react';

export const PermissionDeniedView: FC = () => {
    return (
        <motion.div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-orange-50/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        >
        <div className="mb-2">
            <Warning 
            size={32}
            weight="duotone"
            color="#F87171"
            />
        </div>
        <p className="text-sm text-red-500">カメラへのアクセスが許可されていません</p>
        </motion.div>
    );
};