import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Storefront, CaretDown, Tag } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { Store } from '../../_types';

type StoreSelectProps = {
    selectedStoreId: string;
    stores: Store[];
    onStoreSelect: (storeId: string) => void;
}

export const StoreSelect: React.FC<StoreSelectProps> = ({
    selectedStoreId,
    stores,
    onStoreSelect,
}) => {
    return ( 
        <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
            店舗を選択
        </label>
        <Listbox value={selectedStoreId} onChange={onStoreSelect}>
            <div className="relative">
            <Listbox.Button className={twMerge(
                "relative w-full cursor-default",
                "rounded-xl bg-white py-2.5 pl-10 pr-10 text-left",
                "border border-orange-100",
                "outline-none",
                "focus:border-transparent",
                "focus:ring-2 focus:ring-orange-500/20",
                "focus:shadow-[0_0_0_4px_rgba(249,115,22,0.1)]",
                "transition-all duration-200",
                "shadow-sm"
            )}>
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <Storefront 
                    size={20} 
                    weight="duotone"
                    color="#FB923C"
                />
                </div>
                <span className="block truncate text-base font-medium text-gray-700">
                {selectedStoreId
                    ? stores.find((store) => store.id === selectedStoreId)?.name
                    : '店舗を選択してください'}
                </span>
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <CaretDown 
                    size={20}
                    weight="bold"
                    color="#FB923C"
                />
                </div>
            </Listbox.Button>

            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className={twMerge(
                "absolute mt-1 max-h-60 w-full overflow-auto",
                "rounded-xl bg-white py-1",
                "text-base shadow-lg",
                "ring-1 ring-orange-100",
                "focus:outline-none",
                "z-50"
                )}>
                {stores.map((store) => (
                    <Listbox.Option
                    key={store.id}
                    value={store.id}
                    className={({ active }) => twMerge(
                        "relative cursor-default select-none",
                        "py-2.5 pl-10 pr-4",
                        active ? "bg-orange-50 text-orange-900" : "text-gray-900",
                        "transition-colors duration-100"
                    )}
                    >
                    {({ selected }) => (
                        <>
                        <span className={twMerge(
                            "block truncate",
                            selected ? "font-medium" : "font-normal"
                        )}>
                            {store.name}
                        </span>
                        {selected && (
                            <motion.span 
                            className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-600"
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                            <Tag weight="duotone" size={20} />
                            </motion.span>
                        )}
                        </>
                    )}
                    </Listbox.Option>
                ))}
                </Listbox.Options>
            </Transition>
            </div>
        </Listbox>
        </div>
    );
};