import { FC } from 'react';
import { motion } from 'framer-motion';
import { Plus } from '@phosphor-icons/react';
import { modalStyles, modalAnimations } from '../../_styles';
import { FormActionsProps } from '../../_types';

export const FormActions: FC<FormActionsProps> = ({ onCancel }) => {
    return (
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
        <motion.button
            type="button"
            onClick={onCancel}
            className={`${modalStyles.button.base} ${modalStyles.button.cancel}`}
            whileHover={modalAnimations.button.hover}
            whileTap={modalAnimations.button.tap}
        >
            キャンセル
        </motion.button>
        <motion.button
            type="submit"
            className={`${modalStyles.button.base} ${modalStyles.button.submit}`}
            whileHover={modalAnimations.button.hover}
            whileTap={modalAnimations.button.tap}
        >
            <Plus size={20} weight="bold" color="#FFFFFF" />
            追加
        </motion.button>
        </div>
    );
};