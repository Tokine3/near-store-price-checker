import { FC } from 'react';
import { Storefront } from '@phosphor-icons/react';
import { modalStyles } from '../../_styles';
import { StoreNameInputProps } from '../../_types';

export const StoreNameInput: FC<StoreNameInputProps> = ({
    storeName,
    onChange
}) => {
    return (
        <div className="flex flex-col gap-2 mt-4">
        <label 
            htmlFor="storeName" 
            className="text-sm font-medium text-gray-700"
        >
            店舗名
        </label>
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Storefront 
                size={20}
                weight="duotone"
                color="#FB923C"
            />
            </div>
            <input
            type="text"
            id="storeName"
            value={storeName}
            onChange={(e) => onChange(e.target.value)}
            className={modalStyles.input}
            placeholder="例：やまだスーパー"
            required
            />
        </div>
        </div>
    );
};