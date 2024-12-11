import { FC } from 'react';
import { motion } from 'framer-motion';
import { modalAnimations, modalStyles } from '../../_styles';

type FormActionsProps = {
    onCancel: () => void;
};

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
                登録する
            </motion.button>
        </div>
    );
};