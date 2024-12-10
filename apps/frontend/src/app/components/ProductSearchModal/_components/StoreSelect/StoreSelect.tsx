import { FC, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Storefront, CaretUpDown, Check } from '@phosphor-icons/react';
import { twMerge } from 'tailwind-merge';

type StoreSelectProps = {
    selectedSearchStoreId: string;
    setSelectedSearchStoreId: (id: string) => void;
    stores: Array<{ id: string; name: string }>;
};

export const StoreSelect: FC<StoreSelectProps> = ({
    selectedSearchStoreId,
    setSelectedSearchStoreId,
    stores,
}) => {
    return (
        <div className="relative max-w-lg mx-auto mb-4">
        <Listbox value={selectedSearchStoreId} onChange={setSelectedSearchStoreId}>
            <div className="relative">
            <Listbox.Button className={twMerge(
                "relative w-full cursor-default",
                "rounded-xl bg-white py-3 pl-10 pr-10",
                "border border-orange-100",
                "outline-none",
                "focus:border-transparent",
                "focus:ring-2 focus:ring-orange-500/20",
                "transition-all duration-200",
                "shadow-sm"
            )}>
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Storefront weight="duotone" size={20} color="#FB923C" />
                </span>
                <span className="block truncate text-base font-medium text-gray-700">
                {stores.find((store) => store.id === selectedSearchStoreId)?.name || '店舗を選択'}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <CaretUpDown weight="bold" size={20} color="#FB923C" />
                </span>
            </Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                {stores.map((store) => (
                    <Listbox.Option
                    key={store.id}
                    value={store.id}
                    className={({ active }) => twMerge(
                        "relative cursor-default select-none py-2 pl-10 pr-4",
                        active ? "bg-orange-50 text-orange-600" : "text-gray-700"
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
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-orange-500">
                            <Check weight="bold" size={20} />
                            </span>
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